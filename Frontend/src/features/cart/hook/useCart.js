import { addItem, getCart, incrementCartItemApi } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setCart, incrementCartItem } from "../state/cart.slice";
import { useCallback } from "react";

export const useCart = () => {

    const dispatch = useDispatch();

    const handleAddItem = useCallback(async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId });
        
        return data;
    }, []);

    const handleGetCart = useCallback(async function handleGetCart() {
        const data = await getCart();
        dispatch(setCart(data.cart.items))
    }, [dispatch]);

    const handleIncrementCartItem = useCallback(async function handleIncrementCartItem({ productId, variantId }) {
        await incrementCartItemApi({ productId, variantId })
        dispatch(incrementCartItem({ productId, variantId }))
    }, [dispatch]);

    return { handleAddItem, handleGetCart, handleIncrementCartItem }
}
