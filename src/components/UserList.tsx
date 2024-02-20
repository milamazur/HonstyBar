import { Box, SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'
import { UserListParamsType } from '../types/UserListComponentType'
import { UserType } from '../types/UserType'
import UserComponent from './UserInfoView'
import "./UserList.css"

function UserList({ users, onSelected }: UserListParamsType) {
    const colors = ["#02CCFF", "#ffaf00", "#3AE3DD", "#A886FE", "#FFB31E", "#FA659D"]
    const colorLight = ["#97eaff", "#ffd883", "#8afffc", "#c1a9ff", "#ffcf73", "#fc99be"]

    const colors2 = ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"]
    const colorLight2 = ["#FFDC7B", "#FFA981", "#FD7DB4", "#A579E2", "#95BDFF"]
    let colorCounter = 0

    return (
        <SimpleGrid
            className="userList-Grid"
            columns={{ md: 2, lg: 3 }}
            spacing='1'
            p='10'
            textAlign='center'
            rounded='lg'
            color='gray.400'
        >
            {
                users.map((u: UserType) => {

                    colorCounter++;
                    if (colorCounter >= colors2.length) {
                        colorCounter = 0
                    }

                    return (
                        <UserComponent
                            key={u.id}
                            user={u}
                            color={colors2[colorCounter]}
                            colorLight={colorLight2[colorCounter]}
                            onSelected={(userId) => onSelected(userId)} />)
                })
            }

        </SimpleGrid>
    )
}

export default UserList