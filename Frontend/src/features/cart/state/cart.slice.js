import { createSlice } from "@reduxjs/toolkit" ;
import { incrementCartItem } from "../service/cart.api";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                if (item.productId === productId && item.variantId === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item
                }
            })
        }
    }
})

export const{ setCart, addItem, incrementCartItem } = cartSlice.actions;
export default cartSlice.reducer;