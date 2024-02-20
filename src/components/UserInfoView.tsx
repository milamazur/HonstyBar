import { Avatar, Box, Image, Text } from "@chakra-ui/react"
import { UserType } from "../types/UserType"

type UserInfoViewParamsType = {
    user: UserType
    color: string
    colorLight: string
    onSelected: (userId: string) => void
}

function UserInfoView({ user, onSelected, color, colorLight }: UserInfoViewParamsType) {
    return (
        <Box as='button' color={"blackAlpha.700"} bg={"white"} boxShadow='lg' p='4' rounded='xl' onClick={() => onSelected(user.id)} key={user.id}
            mr={3} mb={3} py={3} px={2}  >
            <Avatar size='2xl' name={user.firstName + " " + user.lastName} src={user.image} />{' '}
            <Text pt={2} fontSize={'lg'}>
                {user.firstName}
            </Text>
            <Text fontSize={'lg'}>
                {user.lastName}
            </Text>
        </Box>
    )
}

export default UserInfoView