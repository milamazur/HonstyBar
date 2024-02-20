import { UserType } from "./UserType"

export type UserListParamsType = {
    users: Array<UserType>
    onSelected: (userId: string) => void
}