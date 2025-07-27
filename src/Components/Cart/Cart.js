import React from 'react';
import { useSelector } from 'react-redux';
import { ScrollRestoration } from 'react-router-dom';
import EmptyCart from './emptyCart';
import CartItems from './cartItems';
import { useCart } from '../../context/userCartContext';

const Cart = () => {
    const products = useSelector((state) => state.amazon.products);
    const { userCart } = useCart();

    return (
        <div className='gap-5 w-full h-full bg-gray-200 '>
            <ScrollRestoration />
            {
                products.length > 0 || userCart.length > 0
                    ? (<CartItems />)
                    : (<EmptyCart />)
            }
        </div>
    )
}

export default Cart;
