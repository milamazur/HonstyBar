import { SimpleGrid, Box, Flex, Avatar } from "@chakra-ui/react";
import { OrderItemType } from "../types/OrderItemType";
import { ProductType } from "../types/ProductType";
import Balance from "./Balance";
import './ProductGrid.css'

type ProductGridParams = {
    data: ProductType[],
    onAddOrder: (order: OrderItemType) => void
    onChangeTotalOrderPrice?: (increase: boolean, order: OrderItemType) => void
    addStock: boolean
}

function ProductGrid({ data, onAddOrder, onChangeTotalOrderPrice, addStock }: ProductGridParams) {
    return (
        <>
            <SimpleGrid backgroundColor="#EDF2F7"
                spacing={5}
                className='productGrid-productsGrid'
                columns={{ md: 2, lg: 3 }} p='4'>
                {data.map(({ id, name, price, image, deliveryQuantity }: ProductType) => {
                    return (
                        <Box as='button' bg="white" key={id} className='productGrid-oneProductGrid touchStyle' boxShadow="lg" onClick={() => {
                            const order = {
                                quantity: 1,
                                productId: id,
                                name: name,
                                price: price,
                                deliveryQuantity: deliveryQuantity
                            }
                            onAddOrder(order);
                            if (onChangeTotalOrderPrice != null) {
                                onChangeTotalOrderPrice(true, order)
                            }
                        }}
                        >
                            <Flex>
                                <Box>
                                    {image.length > 0 ?
                                        (<Avatar m={2} bg="none" size='2xl' name={name} src={image} />) :
                                        (<Avatar m={2} size='2xl' name={name} src={image} />)
                                    }

                                </Box>
                                <Box margin="auto" pl={2} flex={1}>
                                    {
                                        addStock ? (<Box><Box textAlign="center" p={2} as="p">{name}</Box> <p>x {deliveryQuantity}</p></Box>) : (<Box textAlign='center'><Box textAlign="center" p={2} as="p">{name}</Box> <Balance balance={price}/></Box>)}
                                </Box>
                            </Flex>
                        </Box>
                    )
                }
                )}
            </SimpleGrid>
        </>
    )
}

export default ProductGrid