import { Box, Heading, SimpleGrid } from "@chakra-ui/react"
import { UserListParamsType } from "../types/UserListComponentType"
import UserListComponent from "./UserList"

function AllUsersList({ users, onSelected }: UserListParamsType) {
    return (
        <Box>
            <Heading pl={10} pb={2} as="h3" size="lg">Gebruikers</Heading>
                <UserListComponent
                    users={users}
                    onSelected={(userId) => onSelected(userId)} />
        </Box>
    )
}

export default AllUsersList