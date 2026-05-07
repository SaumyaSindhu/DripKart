import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct';

const Home = () => {

    const user = useSelector((state) => state.products.products);

    const { handleGetAllProducts } = useProduct();

    useEffect(() => {
        handleGetAllProducts();
    }, []);

  return (
    <div>Home</div>
  )
}

export default Home