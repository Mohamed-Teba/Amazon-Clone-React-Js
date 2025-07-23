import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { correct } from '../../assets/index';
import { deleteProduct, resetCart, increaseQuantity, decreaseQuantity } from '../../Redux/amazonSlice';
import { Link, useLoaderData} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useCart } from '../../context/userCartContext';
import ProductsSlider from '../../Home/productSlider';

const CartItems = () => {
    const data = useLoaderData();
    const productsData = data.data.products;

    const dispatch = useDispatch();
    const products = useSelector((state) => state.amazon.products);
    const userInfo = useSelector((state) => state.amazon.userInfo);
    const authenticated = useSelector((state) => state.amazon.isAuthenticated);


    const { userCart, updateUserCart, cartTotalQty, cartTotalPrice } = useCart();


    const [totalQty, setTotalQty] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const cartRef = useRef(null);
    const [productDivHeight, setProductDivHeight] = useState(0);
    useEffect(() => {
        let allPrice = 0;
        let allQty = 0;
        products.forEach((product) => {
            allPrice += product.quantity * product.price;
            allQty += product.quantity;
        });
        setTotalPrice(allPrice);
        setTotalQty(allQty);

        const updateCartHeight = () => {
            if (cartRef.current) {
                const cartHeight = cartRef.current.clientHeight;
                const setHeight = cartHeight + 8;
                setProductDivHeight(setHeight);
            }
        };

        updateCartHeight();
    }, [products, userCart]);

    const navigate = useNavigate();
    const handleCategoryClick = (category, title) => {
        navigate(`/${category}/${title}`);
    };

    const handleDecreaseQuantity = async (productTitle) => {
        const userCartRef = doc(collection(db, 'users', userInfo.email, 'cart'), userInfo.id);
        const docSnapshot = await getDoc(userCartRef);
        if (docSnapshot.exists()) {
            const userCartData = docSnapshot.data().cart;
            const productIndex = userCartData.findIndex(product => product.title === productTitle);
            if (productIndex !== -1) {
                if (userCartData[productIndex].quantity > 1) {
                    userCartData[productIndex].quantity -= 1;
                    await setDoc(userCartRef, { cart: userCartData }, { merge: true });

                    const updatedUserCart = userCart.map(product =>
                        product.title === productTitle
                            ? { ...product, quantity: product.quantity - 1 }
                            : product
                    );
                    updateUserCart(updatedUserCart);
                }
            }
        }
    };

    const handleIncreaseQuantity = async (productTitle) => {
        const userCartRef = doc(collection(db, 'users', userInfo.email, 'cart'), userInfo.id);
        const docSnapshot = await getDoc(userCartRef);
        if (docSnapshot.exists()) {
            const userCartData = docSnapshot.data().cart;
            const productIndex = userCartData.findIndex(product => product.title === productTitle);
            if (productIndex !== -1) {
                userCartData[productIndex].quantity += 1;
                await setDoc(userCartRef, { cart: userCartData }, { merge: true });

                const updatedUserCart = userCart.map(product =>
                    product.title === productTitle
                        ? { ...product, quantity: product.quantity + 1 }
                        : product
                );
                updateUserCart(updatedUserCart);
            }
        }
    };

    const handleDeleteProduct = async (productTitle) => {
        const userCartRef = doc(collection(db, 'users', userInfo.email, 'cart'), userInfo.id);
        const docSnapshot = await getDoc(userCartRef);
        if (docSnapshot.exists()) {
            const userCartData = docSnapshot.data().cart;
            const updatedCart = userCartData.filter(product => product.title !== productTitle);
            await updateDoc(userCartRef, { cart: updatedCart });
            const updatedUserCart = userCart.filter(product => product.title !== productTitle);
            updateUserCart(updatedUserCart);
        }
    };

    const handleClearCart = async () => {
        if (authenticated) {
            try {
                const userCartRef = doc(collection(db, 'users', userInfo.email, 'cart'), userInfo.id);
                await setDoc(userCartRef, { cart: [] }, { merge: true });
                updateUserCart([]);
            } catch (error) {
                console.error("Error clearing Firebase cart:", error);
            }
        } else {
            dispatch(resetCart());
        }
    };

    return (
        <div className='flex flex-col-reverse lgl:flex-row gap-5'>
            <div className='w-[92%] lgl:w-[74%] flex flex-col gap-6  lgl:my-10 mx-auto lgl:ml-5' >
                <div className='w-full  bg-white py-7 px-5' >
                    <h1 className='text-3xl font-semibold mb-1'>Shopping Cart</h1>
                    <hr />
                    {
                    userCart.length > 0
                        ?
                        <div ref={cartRef}>
                            {
                                userCart.map((product, index) => (
                                    <div key={index} className='w-full border-b-[1px] border-b-gray-200 p-4 flex flex-col mdl:flex-row gap-6' >
                                        <div className='w-full mdl:w-1/5 cursor-pointer' onClick={() => handleCategoryClick(product.category, product.title)}>
                                            <img className='w-[70%] mx-auto h-[70%] mdl:w-48 mdl:h-48' src={product.thumbnail} alt="productImage" />
                                        </div>
                                        <div className='w-4/5 flex flex-col gap-2 -mt-2'>
                                            <h2 className='text-[23px] font-medium cursor-pointer' onClick={() => handleCategoryClick(product.category, product.title)}>{product.title}</h2>
                                            <p className=''>{product.description}</p>
                                            <div className='flex items-center '>
                                                <p className='font-medium text-[20px] '>₹&nbsp;</p>
                                                <span className='text-[26px] font-medium'>{product.price}.00</span>
                                            </div>
                                            <p className='text-green-700'>In stock</p>
                                            <div className='flex flex-row text-sm mdl:text-base gap-5'>
                                                <p className='capitalize'>Sold by : {product.brand}</p>
                                                <p className='border-l-[1px] pl-5 border-gray-200 capitalize'>Category : {product.category}</p>
                                            </div>
                                            <div className='flex flex-row justify-between gap-5 mt-2'>
                                                <div className='flex items-center justify-center  '>
                                                    Qty :&nbsp;&nbsp;
                                                    <p onClick={() => handleDecreaseQuantity(product.title)} className='px-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-400 duration'>-</p>
                                                    <p className='font-semibold text-[20px]'>&nbsp;{product.quantity}&nbsp;</p>
                                                    <p onClick={() => handleIncreaseQuantity(product.title)} className='px-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-400 duration'>+</p>
                                                </div>
                                                <button onClick={() => handleDeleteProduct(product.title)} className='text-blue-600 '>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div ref={cartRef}>
                            {
                                products.map((product, index) => (
                                    <div key={index} className='w-full border-b-[1px] border-b-gray-200 p-4 flex flex-col mdl:flex-row gap-6' >
                                        <div className='w-full mdl:w-1/5 cursor-pointer' onClick={() => handleCategoryClick(product.category, product.title)}>
                                            <img className='w-[70%] mx-auto h-[70%] mdl:w-48 mdl:h-48' src={product.thumbnail} alt="productImage" />
                                        </div>
                                        <div className='w-4/5 flex flex-col gap-2 -mt-2'>
                                            <h2 className='text-[23px] font-medium cursor-pointer' onClick={() => handleCategoryClick(product.category, product.title)}>{product.title}</h2>
                                            <p className=''>{product.description}</p>
                                            <div className='flex items-center '>
                                                <p className='font-medium text-[20px] '>₹&nbsp;</p>
                                                <span className='text-[26px] font-medium'>{product.price}.00</span>
                                            </div>
                                            <p className='text-green-700'>In stock</p>
                                            <div className='flex flex-row text-sm mdl:text-base gap-5'>
                                                <p className='capitalize'>Sold by : {product.brand}</p>
                                                <p className='border-l-[1px] pl-5 border-gray-200 capitalize'>Category : {product.category}</p>
                                            </div>
                                            <div className='flex flex-row justify-between gap-5 mt-2'>
                                                <div className='flex items-center justify-center  '>
                                                    Qty :&nbsp;&nbsp;
                                                    <p onClick={() => dispatch(decreaseQuantity(product.title))} className='px-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-400 duration'>-</p>
                                                    <p className='font-semibold text-[20px]'>&nbsp;{product.quantity}&nbsp;</p>
                                                    <p onClick={() => dispatch(increaseQuantity(product.title))} className='px-2 cursor-pointer bg-gray-200 rounded-md hover:bg-gray-400 duration'>+</p>
                                                </div>
                                                <button onClick={() => dispatch(deleteProduct(product.title))} className='text-blue-600 '>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                    <div className='flex flex-col mdl:flex-row justify-between text-xs mdl:text-base  '>
                        <button onClick={() => handleClearCart()}
                            className='lgl:w-[200px] border-[1px] bg-gray-100 border-gray-200 py-1 text-sm text-blue-600 rounded-lg
                          text-center p-[4px] mt-1 active:ring-2 active:ring-offset-1 active:ring-blue-600
                         '>Clear Cart</button>
                        <div className='text-sm mdl:text-[22px] items-baseline mt-5 mdl:mt-0 font-medium flex justify-center mdl:justify-end'>SubTotal ({userCart.length > 0  ? cartTotalQty : totalQty} items) :&nbsp;
                            <div className='flex justify-center items-center '>
                                <p className='font-medium text-sm mdl:text-lg '>₹&nbsp;</p>
                                <span className='text-sm mdl:text-2xl font-bold'>{userCart.length > 0 ? cartTotalPrice : totalPrice}.00</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full hidden mdl:block bg-white h-16'>
                </div>
                <div className='xs:block mdl:hidden'>
                    <ProductsSlider />
                </div>
                <p className='text-sm p-5'>
                    The price and availability of items at Amazon.in are subject to change. The shopping cart is a temporary place to store a list of your items and reflects each item's most recent price.
                    Do you have a promotional code? We'll ask you to enter your claim code when it's time to pay.
                </p>
            </div>
            
            <div className=' w-[92%] items-center lgl:w-[22%] mx-auto flex flex-col gap-5 my-4 lgl:my-10 '>
                <div className='w-full  bg-white py-6 px-5'>
                    <div className='flex flex-row gap-2 '>
                        <img className='w-5 h-5' src={correct} alt="correct" />
                        <span className='text-[13px] text-[#17a34acc]'>Part of your order qualifies for FREE Delivery.
                            <span className='text-gray-500'>Select this option at checkout.</span>
                        </span>
                    </div>
                    <div className='text-[18px] mt-4 font-medium flex justify-start items-center'>SubTotal ({userCart.length > 0 ? cartTotalQty : totalQty} items) :&nbsp;
                        <div className='flex items-center '>
                            <p className='font-medium text-[16px] '>₹&nbsp;</p>
                            <span className='text-[18px] font-bold'>{userCart.length > 0 ? cartTotalPrice : totalPrice}.00</span>
                        </div>
                    </div>
                    {
                        authenticated
                            ? <Link to="/checkout">
                                <button className={`pt-2 w-full text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500`}>
                                    Proceed to Buy
                                </button>
                            </Link>
                            : <Link to="/Login">
                                <button className={`pt-2 w-full text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500`}>
                                    Proceed to Buy
                                </button>
                            </Link>
                    }
                    <div className='border-[1px] border-gray-200 mt-4 flex items-center justify-center py-2 '>EMI Available</div>
                </div>
                <div className='w-full hidden lgl:block bg-white' >
                    <h1 className='font-semibold mx-3 pt-3 '>Customers who bought other items</h1>
                    <div style={{ height: productDivHeight }} className='bg-white flex flex-col gap-4 py-3 ml-3 custom-scrollbar overflow-y-hidden hover:overflow-y-scroll '>
                        {productsData.map((product, index) => (
                            <div className='flex flex-row gap-2' key={index} >
                                <Link to={`/allProducts/${product.title}`}>
                                    <img className='w-20 h-20' src={product.thumbnail} alt="productImage" />
                                </Link>
                                <div className=''>
                                    <Link to={`/${product.category}/${product.title}`}>
                                        <p className='text-blue-600 text-xl font-semibold'>{product.title.substring(0, 15)}</p>
                                    </Link>
                                    <p className='text-red-600 text-[20px] font-semibold mt-2'>₹ {product.price}.00</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems;


