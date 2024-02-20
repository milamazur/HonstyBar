import { Box, Heading } from "@chakra-ui/react"
import { UserListParamsType } from "../types/UserListComponentType"
import UserListComponent from "./UserList"

function RecentUserList({ users, onSelected }: UserListParamsType) {
    return (
        <Box>
            <Heading pl={10} pb={2} as="h3" size="lg">Recent</Heading>
            <UserListComponent 
                users={users
                    .filter(x => x.lastOrderDate !== null)
                    .sort((a, b) => (a.lastOrderDate > b.lastOrderDate) ? -1 : ((b.lastOrderDate > a.lastOrderDate) ? 1 : 0))
                    .slice(0, 6)}
                onSelected={(userId) => onSelected(userId)} />
        </Box>
    )
}

export default RecentUserList