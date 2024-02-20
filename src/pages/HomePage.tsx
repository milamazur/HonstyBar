import { Box, Button, Heading, Flex } from "@chakra-ui/react"
import useGetCollection from "../hooks/useGetData"
import { UserType } from "../types/UserType"
import './HomePage.css'
import { useNavigate } from "react-router-dom";
import RecentUserList from "../components/RecentUserList"
import AllUsersList from "../components/AllUsersList"
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
    const navigate = useNavigate();
    const { loading: loadingUsers, error: errorUsers, data: users } = useGetCollection<Array<UserType>>("/users")

    if (loadingUsers) {
        return (
            <LoadingSpinner />
        )
    }

    if (errorUsers || users == undefined) {
        return (
            <p>Error</p>
        )
    }

    return (
        <Box className="homePage-homeScreenBox">
            <Box className="homePage-homePageTitle" textAlign='center'>
                <Heading pt={3} as="h1" size="4xl">Honesty Bar</Heading>
            </Box>
            <Flex className="homePage-userOverview">
                <Box w="50%">
                    <RecentUserList
                        users={users}
                        onSelected={(userId) => {
                            navigate("/order/" + userId)
                        }} />
                </Box>
                <Box flex={1}>
                    <AllUsersList
                        users={users}
                        onSelected={async (userId) => {

                            navigate("/order/" + userId);
                        }} />
                </Box>
            </Flex>

            <Button  colorScheme="blue" className="homePage-add-stock" onClick={() => navigate('/stock/add')}>Voorraad aanvullen</Button>

        </Box>

    )
}

export default HomePage