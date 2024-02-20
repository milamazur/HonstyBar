import axios from "axios";
import { OrderItemType } from "../types/OrderItemType";
import { UserBalanceType } from "../types/UserBalanceType";
import { UserType } from "../types/UserType";


export function useApi() {

    function changeStock(stockData: OrderItemType[]) {
       return axios.post('/products/actions/addstock', {
            stockData
        })
    }

    function updateUserBalance(user: UserType) {
     
     }

     function addPayment(userId: string, amount:number) {
        return axios.post('/users/'+ userId + '/actions/topup/pending', {
            userId, amount 
        })
    }

    function deletePayment(topupId: string) {
        return axios.delete('/topup/'+ topupId)
    }

    function updateUser(user: UserBalanceType) {
        return axios.post("/users/" + user.userId+ "/actions/addBalance", user)
    }

    return {
        changeStock,
        updateUserBalance,
        addPayment,
        deletePayment,
        updateUser
    }
}