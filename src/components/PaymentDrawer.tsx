import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js"
import { SeverityLevel } from "@microsoft/applicationinsights-web"
import { Box, Button, CloseButton, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, Input, SimpleGrid, Text, Toast, useDisclosure, useToast } from "@chakra-ui/react"
import { Context, useEffect, useRef, useState } from "react"
import { useApi } from "../hooks/useApi"
import { UserBalanceType } from "../types/UserBalanceType"
import { UserType } from "../types/UserType"
import { toastDuration } from "../variables"
import Balance from "./Balance"
import QrComponent from "./QrComponent"

type PaymentDrawerParams = {
    isOpenDrawer: boolean,
    onCloseDrawer: () => void,
    onOpenPopup: () => void,
    user: UserType,
    refetchUser: () => void
    context: any
}

const defaultPaymentAmounts = [5, 10, 15, 20, 25, 50]

function PaymentDrawer({ isOpenDrawer, onCloseDrawer, onOpenPopup, user, refetchUser, context }: PaymentDrawerParams) {
    const toast = useToast();
    const appInsights = useAppInsightsContext();
    const [confirm, setConfirm] = useState(false);
    const [paymentValue, setPaymentValue] = useState(0);
    const { addPayment, deletePayment, updateUser } = useApi();
    const [reference, setReference] = useState("");
    const [topUpId, setTopupId] = useState("");
    const [paymentAmounts, setPaymentAmounts] = useState(defaultPaymentAmounts);

    useEffect(() => {
      if (user?.balance !== null && user?.balance < 0) {
          let positiveBalance = Math.abs(user.balance);

          if (!defaultPaymentAmounts.includes(positiveBalance)) {
            setPaymentAmounts(defaultPaymentAmounts.concat([positiveBalance]));
          }
      }

      return () => {
      }
    }, [user])


    function createPayment() {
        if (validatePayment()) {
            setConfirm(true);
            addPayment(user.id, paymentValue)
                .then(response => {
                    setReference(response.data.reference);
                    setTopupId(response.data.topUpId.toString());
                })
        }
    }

    function validatePayment() {
        let valid = true;
        if (paymentValue == 0) {
            toast({
                title: 'Geen bedrag',
                description: 'Je moet een bedrag kiezen alvorens te bevestigen',
                status: 'warning',
                duration: toastDuration,
                isClosable: true
            })
            setConfirm(false)
            valid = false;
        }
        return valid;
    }

    function deleteTopUp() {
        deletePayment(topUpId)
    }

    async function changeUserBalance(userBalance: UserBalanceType) {
        await updateUser(userBalance).then(() => {
            appInsights.trackEvent({ name: "Balance of user with id: " + user.id + " is updated" })
            onCloseDrawer()
            refetchUser()
        }).catch(e => {
            toast({
                title: 'Oeps, er ging iets mis.',
                description: 'Probeer later opnieuw',
                status: 'warning',
                duration: toastDuration,
                isClosable: true
            })
            appInsights.trackException({ error: new Error("Error user update money"), severityLevel: SeverityLevel.Error })
        });

    }

    return (
        <>
            <Drawer
                isOpen={isOpenDrawer}
                placement='right'
                onClose={() => {
                    onCloseDrawer();
                    setConfirm(false);
                    setPaymentValue(0);
                    if (paymentValue != 0) {
                        deleteTopUp()
                    }
                    context.startTimer()
                }}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <CloseButton position={"absolute"} justifyContent="center" top={"var(--chakra-space-2)"} right={"var(--chakra-space-3)"} onClick={onOpenPopup} />
                    <DrawerHeader>{user.firstName} {user.lastName}</DrawerHeader>

                    <DrawerBody>
                        {!confirm ?
                            <Box>
                                <Text pt={5} fontSize='md'>Via dit menu kan u uw <b>saldo verhogen</b> met een gewenst bedrag.</Text>
                                <Text pt={5} fontSize='md'>Welk bedrag wenst u te storten?</Text>

                                <SimpleGrid mt={3} columns={3} spacing={5}>
                                    {paymentAmounts.map((amount) =>
                                        <Box key={amount}><Button onClick={() => setPaymentValue(amount)}><Balance balance={amount} /></Button></Box>
                                    )}
                                </SimpleGrid>
                                <Box w={"100%"} textAlign="center"><Button mt={5} w={"90%"} colorScheme="blue" onClick={() => { createPayment() }}>Bevestig</Button></Box>
                            </Box>
                            :
                            <Box >
                                <Box w="100%">
                                    <Box m=" 0 auto 0 0 " mb={3} textAlign={"center"} color='white' p={2} w="30%" borderRadius={"md"} bg={"#2F855A"}>
                                        <Balance balance={paymentValue} />
                                    </Box>
                                    <Text pt={5} fontSize='md'>1. <b>Scan </b> de QR-code hieronder met een bank applicatie naar keuze.</Text>
                                </Box>
                                <QrComponent user={user} amount={paymentValue} reference={reference} />
                                <Text fontSize='md'>2. Vervolledig de betaling op je smartphone.</Text>
                                <Text pt={5} fontSize='md'>3. Is de betaling <b>succesvol?</b></Text>
                                <Text fontSize='md'>Klik hieronder dan op bevestig.</Text>
                                <Text pt={5} fontSize='md'>4. Is de betaling <b>gefaald?</b></Text>
                                <Text fontSize='md'>Klik hieronder dan op annuleer en probeer opnieuw.</Text>

                            </Box>
                        }
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={() => {
                            setConfirm(false);
                            setPaymentValue(0);
                            if (paymentValue != 0) {
                                deleteTopUp()
                            }
                            onOpenPopup()
                        }}>
                            Annuleer
                        </Button>
                        {confirm ?
                            <Button colorScheme='blue' onClick={() => {
                                setConfirm(false);
                                const userBalance: UserBalanceType = {
                                    userId: user.id,
                                    amount: paymentValue
                                }
                                changeUserBalance(userBalance)
                                context.startTimer()
                            }}>Bevestig</Button>
                            :
                            ""
                        }
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}
export default PaymentDrawer
