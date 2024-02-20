import { CloseIcon, SearchIcon } from "@chakra-ui/icons"
import { Divider, Spacer, Flex, Box, IconButton } from "@chakra-ui/react"
import { OrderItemType } from "../types/OrderItemType"
import { FiTrash2 } from "react-icons/fi"

type OrderDetailsViewParams = {
    data: OrderItemType[],
    onDeleteOrder: (orderId: string) => void
    onChangeTotalOrderPrice: (increase: boolean, order: OrderItemType) => void
    addStock: boolean
}

function OrderDetailsView({ data, onDeleteOrder, onChangeTotalOrderPrice, addStock }: OrderDetailsViewParams) {

    return (
        <Box overflowY='scroll' h='100%'>
            {
                data.map((order: OrderItemType) => (
                    <Box key={order.productId}>
                        <Flex>
                            <Box w="20%" as="p" p={3}>{order.quantity}</Box>
                            <Box w="30%" as="p" p={3}>x {addStock ? order.deliveryQuantity : ""}</Box>
                            <Box w="50%" as="p" p={3}>{order.name}</Box>
                            <Spacer />
                            <Box p={3} flex={1} as="p">
                                <IconButton colorScheme="red" aria-label='Search database' onClick={(e) => {
                                    onDeleteOrder(order.productId)
                                    onChangeTotalOrderPrice(false, order)
                                }} icon={<FiTrash2 />} />
                            </Box>
                        </Flex>
                    </Box>
                )
                )
            }
        </Box>
    )
}

export default OrderDetailsView