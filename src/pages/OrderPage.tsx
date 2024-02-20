import { Box, Divider, IconButton, Spacer, Grid, GridItem, Heading, Button, useToast, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Flex } from '@chakra-ui/react'
import { CloseIcon, CheckIcon } from "@chakra-ui/icons"
import { ProductType } from '../types/ProductType';
import useGetCollection from '../hooks/useGetData';
import { useContext, useEffect, useState } from 'react';
import { OrderItemType } from '../types/OrderItemType';
import OrderDetailsView from '../components/OrderDetailsView';
import ProductGrid from '../components/ProductGrid';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserType } from '../types/UserType';
import AlertPopup from '../components/PopupConfirmCancel';
import Balance from '../components/Balance';
import LoadingSpinner from '../components/LoadingSpinner';
import { toastDuration } from '../variables';
import PaymentDrawer from '../components/PaymentDrawer';
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Context, Timer } from '../components/Timer';

function OrderPage() {
    const context = useContext(Context);
    const navigate = useNavigate();
    const toast = useToast();
    const { userId } = useParams<{ userId: string }>();
    const { loading: loadingProducts, error: errorProducts, data: products, refetch: refetchItems } = useGetCollection<Array<ProductType>>("/products");
    const { loading: loadingUser, error: errorUser, data: user, refetch: refetchUser } = useGetCollection<UserType>("/users/" + userId);
    const [orderData, setOrderData] = useState<OrderItemType[]>([]);
    const [total, setTotal] = useState(0);
    const { isOpen: isOpenOrder, onOpen: onOpenOrder, onClose: onCloseOrder } = useDisclosure()
    const { isOpen: isOpenPayment, onOpen: onOpenPayment, onClose: onClosePayment } = useDisclosure()
    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
    const [pauseTimer, setPauseTimer] = useState(false);
    const appInsights = useAppInsightsContext();

    useEffect(() => {
        context?.startTimer()
        document.addEventListener("click", (e) => {
            const target = e.target as Element;
            const targetId = target.id
            if (target === null) {
                context.resetTimer()
                context.startTimer()
            } else if (targetId !== 'addPaymentButton' && targetId !== 'confirmOrderButton') {
                context.resetTimer()
                context.startTimer()
            }
        })
    }, [])


    const cancelOrder = () => {
        navigate('/')
        setOrderData([])
    }

    function addOrder(order: OrderItemType) {
        let existing = false;
        let foundedorder;
        for (var i = 0; i < orderData.length; i++) {
            if (orderData[i].productId === order.productId) {
                existing = true;
                foundedorder = i
                changeExistingOrder(foundedorder, true)
            }
        }
        if (!existing) {
            setOrderData(orderData => [...orderData, order])
        }
    }

    function changeExistingOrder(i: number, increase: boolean) {
        let items = [...orderData];
        let item = { ...orderData[i] };
        if (increase) {
            item.quantity++;
            changeTotalOrderPrice(true, orderData[i])
        } else {
            item.quantity--
            changeTotalOrderPrice(false, orderData[i])
        }
        items[i] = item;
        setOrderData(items);
    }

    function deleteOrder(productId: string) {
        for (var i = 0; i < orderData.length; i++) {
            if (orderData[i].productId === productId) {
                orderData.splice(i, 1)
                setOrderData(orderData => [...orderData]);
            }
        }
    }

    function changeTotalOrderPrice(increase: boolean, order: OrderItemType) {
        if (increase) {
            setTotal(total + order.price)
        } else {
            setTotal(total - (order.quantity * order.price))
        }
    }

    async function confirmOrder() {
        if (orderData.length <= 0) {
            toast({
                title: 'Maak een bestelling',
                description: 'Gelieve een bestelling te maken alvorens te bevestigen.',
                status: 'warning',
                duration: toastDuration,
                isClosable: true
            })
            return;
        }

        axios.post('/order', {
            userId, orderData
        })
            .then(response => {
                return response.data
            })
            .then(data => {
                navigate("/succes/" + userId)
                setOrderData([])
                appInsights.trackEvent({ name: 'Added order', properties: { "userId": userId } })
            })
            .catch(error => {
                appInsights.trackException({ error: new Error("Add order fail"), severityLevel: SeverityLevel.Information });
                toast({
                    title: 'Oeps, er ging iets mis.',
                    description: 'Probeer later opnieuw',
                    status: 'warning',
                    duration: toastDuration,
                    isClosable: true
                });

            })
    }

    if (loadingProducts || loadingUser) {
        return (
            <LoadingSpinner />
        )
    }

    if (errorProducts || errorUser || products === undefined || user === undefined) {
        return (
            <p>Error</p>
        )
    }

    function cancelAndResetTimer() {
        cancelOrder();
        context.resetTimer();
    }

    return (
        <div className='orderPage-full'>
            <PaymentDrawer
                context={context}
                user={user}
                isOpenDrawer={isOpenDrawer}
                onCloseDrawer={
                    () => {
                        onCloseDrawer();
                        setPauseTimer(false)
                    }}
                refetchUser={refetchUser}
                onOpenPopup={onOpenPayment}
            />
            <AlertPopup
                isOpen={isOpenOrder}
                onClose={onCloseOrder}
                onCancel={() => { cancelOrder(); context.resetTimer() }}
                title="Annuleer bestelling!"
                desciption="Ben je zeker dat je de bestelling wil annuleren?"
                cancelButtonText="Neen, verder bestellen"
                confirmButtonText="Ja, annuleer bestelling"
            />
            <AlertPopup
                isOpen={isOpenPayment}
                onClose={onClosePayment}
                onCancel={() => { onCloseDrawer(); onClosePayment(); context.startTimer() }}
                title="Annuleer betaling!"
                desciption="Ben je zeker dat je de betaling wil annuleren?"
                cancelButtonText="Neen, verder betalen"
                confirmButtonText="Ja, annuleer betaling"
            />
            <Grid
                h='100vh'
                templateRows='repeat(20, 1fr)'
                templateColumns='repeat(10, 1fr)'
            >
                <GridItem rowSpan={20} colSpan={7} bg='#EDF2F7' >
                    <ProductGrid
                        data={products}
                        onAddOrder={(order) => addOrder(order)}
                        onChangeTotalOrderPrice={(increase, order) => changeTotalOrderPrice(increase, order)}
                        addStock={false} />
                </GridItem>


                {/* Header name */}
                <GridItem colSpan={3} rowSpan={4} bg='white'>
                    <GridItem backgroundColor="#EDF2F7" h='25vh'>
                        <Heading as="h3" p="3" textAlign="center" size="lg">{user.firstName} {user.lastName}</Heading>
                        <Flex>
                            <Heading p={3} w={"70%"} as="p" size="sm">Huidig saldo</Heading>
                            <Spacer />
                            <Heading p={3} size="sm"><Balance balance={user?.balance} /></Heading>
                        </Flex>
                        <Box w={"100%"} textAlign="center">
                            <Button id="addPaymentButton" m={3} width="90%" colorScheme='blue' onClick={() => { onOpenDrawer(); context?.pauseTimer() }}>Saldo toevoegen</Button>
                        </Box>
                    </GridItem>
                    <Divider orientation='horizontal' />

                    {/* Winkelmandje */}
                    <GridItem h='50vh' overflowY="scroll">
                        <OrderDetailsView
                            data={orderData}
                            onChangeTotalOrderPrice={(increase, order) => changeTotalOrderPrice(increase, order)}
                            onDeleteOrder={(orderId) => deleteOrder(orderId)}
                            addStock={false}
                        />
                    </GridItem>
                    <Divider orientation='horizontal' />

                    {/* Bestelling */}
                    <GridItem h='15vh'>
                        <Flex>
                            <Box p={3} w={"70%"} as="p">Totaal</Box>
                            <Box p={3} flex={1}><Balance balance={total} />
                            </Box>
                        </Flex>
                        <Flex>
                            <Box p={3} w={"70%"} as="p">Resterend saldo</Box>
                            <Box p={3}> <Balance balance={user.balance - total} /></Box>
                        </Flex>


                    </GridItem>
                    <Divider orientation='horizontal' />

                    {/* Knoppen */}
                    <GridItem h='9vh'>
                        <Flex>
                            <Box p={3} w={"50%"}>
                                <IconButton
                                    size="lg"
                                    width="120px"
                                    onClick={() => orderData.length != 0 ? onOpenOrder() : cancelAndResetTimer()}
                                    colorScheme='red'
                                    variant="solid"
                                    aria-label='Annuleer order'
                                    icon={<CloseIcon />}
                                />
                            </Box>
                            <Spacer />
                            <Box p={3}>
                                <IconButton
                                    id='confirmOrderButton'
                                    size="lg"
                                    width="120px"
                                    onClick={() => {
                                        context.resetTimer()
                                        confirmOrder()
                                    }}
                                    colorScheme='green'
                                    aria-label='Annuleer order'
                                    icon={<CheckIcon />}
                                />
                            </Box>
                        </Flex>
                    </GridItem>


                </GridItem>
            </Grid>
        </div >
    )
}

export default OrderPage