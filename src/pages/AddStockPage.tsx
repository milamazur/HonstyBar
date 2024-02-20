import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Grid, GridItem, Heading, IconButton, Spacer, Toast, useDisclosure, useToast } from "@chakra-ui/react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import OrderDetailsView from "../components/OrderDetailsView";
import AlertPopup from "../components/PopupConfirmCancel";
import ProductGrid from "../components/ProductGrid";
import { useApi } from "../hooks/useApi";
import useGetData from "../hooks/useGetData";
import { OrderItemType } from "../types/OrderItemType";
import { ProductType } from "../types/ProductType";
import { toastDuration } from "../variables";


function AddStockPage() {
    const appInsights = useAppInsightsContext();
    const navigate = useNavigate();
    const toast = useToast();
    const { loading: loadingProducts, error: errorProducts, data: products, refetch: refetchItems } = useGetData<Array<ProductType>>("/products");
    const [stockData, setStockData] = useState<OrderItemType[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { changeStock } = useApi()


    const cancelOrder = () => {
        navigate('/')
        setStockData([])
    }

    function addStock(order: OrderItemType) {
        let existing = false;
        let foundedorder;
        for (var i = 0; i < stockData.length; i++) {
            if (stockData[i].name === order.name) {
                existing = true;
                foundedorder = i
                changeExistingStock(foundedorder, true)
            }
        }
        if (!existing) {
            setStockData(orderData => [...orderData, order])
        }
    }

    async function confirmStockFull() {
        if (stockData.length <= 0) {
            toast({
                title: 'Maak een bestelling',
                description: 'Gelieve een bestelling te maken alvorens te bevestigen.',
                status: 'warning',
                duration: toastDuration,
                isClosable: true
            })
            return;
        }
        changeStock(stockData)
            .then(response => {
                return response.data
            })
            .then(data => {
                appInsights.trackEvent({ name: "The stock has been refilled" })
                navigate("/")
                setStockData([])
            })
            .catch(e => {
                appInsights.trackException({ error: new Error("Add stock fail"), severityLevel: SeverityLevel.Error })
                toast({
                    title: 'Oeps, er ging iets mis.',
                    description: 'Probeer later opnieuw',
                    status: 'warning',
                    duration: toastDuration,
                    isClosable: true
                })
            })
    }

    function changeExistingStock(i: number, increase: boolean) {
        let items = [...stockData];
        let item = { ...stockData[i] };
        if (increase) {
            item.quantity++;
        } else {
            item.quantity--;
        }
        items[i] = item;
        setStockData(items);
    }

    function deleteStock(productId: string) {
        for (var i = 0; i < stockData.length; i++) {
            if (stockData[i].productId === productId) {
                stockData.splice(i, 1)
                setStockData(stockData => [...stockData]);
            }
        }
    }

    function reduceQuantityProduct(id: string) {
        for (var i = 0; i < stockData.length; i++) {
            if (stockData[i].productId === id) {
                changeExistingStock(i, false)
            }
        }
    }

    if (loadingProducts) {
        return (
            <LoadingSpinner />
        )
    }

    if (errorProducts || products === undefined) {
        return (
            <p>ERROR</p>
        )
    }

    return (
        <div className='orderPage-full'>
            <AlertPopup
                isOpen={isOpen}
                onClose={onClose}
                onCancel={cancelOrder}
                title="Annuleer aanvulling"
                desciption="Ben je zeker dat je de aanvulling van de voorraad wil annuleren?"
                cancelButtonText="Neen, verder aanvullen"
                confirmButtonText="Ja, annuleer aanvulling"
            />

            <Grid
                h='100vh'
                templateRows='repeat(20, 1fr)'
                templateColumns='repeat(10, 1fr)'
            >
                <GridItem rowSpan={20} colSpan={7} bg='#EDF2F7' >
                    <ProductGrid
                        data={products}
                        onAddOrder={(order) => addStock(order)}
                        addStock={true} />
                </GridItem>

                {/* Header name */}
                <GridItem colSpan={3} rowSpan={4} bg='white'>
                    <GridItem backgroundColor="#EDF2F7" h='20vh'>
                        <Heading as="h3" p="3" textAlign="center" size="lg">Voorraad aanvullen</Heading>
                    </GridItem>
                    <Divider orientation='horizontal' />

                    {/* Winkelmandje */}
                    <GridItem h='70vh'>
                        <OrderDetailsView
                            data={stockData}
                            onChangeTotalOrderPrice={(increase, order) => console.log(increase + " " + order)}
                            onDeleteOrder={(orderId) => deleteStock(orderId)}
                            addStock={true}
                        />
                    </GridItem>
                    <Divider orientation='horizontal' />


                    <GridItem h='9vh'>
                        <Flex>
                            <Box p={3} w={"50%"}>
                                <IconButton
                                    size="lg"
                                    width="150px"
                                    onClick={() => stockData.length != 0 ? onOpen() : cancelOrder()}
                                    colorScheme='red'
                                    variant="solid"
                                    aria-label='Annuleer stock'
                                    icon={<CloseIcon />}
                                />
                            </Box>
                            <Spacer />
                            <Box p={3}>
                                <IconButton
                                    size="lg"
                                    width="150px"
                                    onClick={() => confirmStockFull()}
                                    colorScheme='green'
                                    aria-label='Bevestig stock'
                                    icon={<CheckIcon />}
                                />
                            </Box>
                        </Flex>
                    </GridItem>
                </GridItem >

            </Grid >
        </div>
    )
}

export default AddStockPage;