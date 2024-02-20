import { useNavigate, useParams } from "react-router-dom";
import { UserType } from "../types/UserType";
import useGetCollection from '../hooks/useGetData';
import { CheckCircleIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Progress } from "@chakra-ui/react";
import './SuccesPage.css';
import { Button } from '@chakra-ui/react'
import Balance from "../components/Balance";
import { useTimer } from "use-timer";
import SuccesPageProgress from "../components/SuccesPageProgress";

function SuccesPage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { loading: loadingUser, error: errorUser, data: user, refetch: refetchUser } = useGetCollection<UserType>("/users/" + userId);
    const { } = useTimer({
        autostart: true,
        endTime: 5,
        onTimeOver: () => {
            goToHomePage();
        }
    });

    if (loadingUser) {
        return (
            <p>Loading...</p>
        )
    }

    if (errorUser || user === undefined) {
        return (
            <p>Error</p>
        )
    }

    function goToHomePage() {
        navigate('/');
    }

    return (
        <Box className="succesPage-full" textAlign="center" >
            <SuccesPageProgress />
            <Flex height="90vh" textAlign="center" direction="column" justifyContent="center">
                <Box><CheckCircleIcon boxSize={250} color="green.500" m={5} /></Box>
                <Heading as="h1" mb={2}>Bestelling geslaagd!</Heading>
                <Flex ml="auto" mr="auto" w="50%">
                    <Box w="50%" p={3} as="p">Resterend saldo:</Box>
                    <Box w="50%" p={3}><Balance balance={user.balance} /></Box>
                </Flex>
            </Flex>
            <Button w="50%" size='lg' colorScheme="green" onClick={() => goToHomePage()}>Ga verder</Button>
        </Box>
    )
}

export default SuccesPage
