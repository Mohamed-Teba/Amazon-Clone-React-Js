// Import React hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import useParams for accessing URL parameters
import { useParams } from "react-router-dom";
// Import navigation and data loading hooks
import { ScrollRestoration, useLoaderData, Link } from "react-router-dom";
// Import icons and images for product details
import {
  star,
  halfStar,
  emptyStar,
  offers,
  delivery,
  cod,
  exchange,
  delivered,
  transaction,
} from "../../assets/index";
// Import Redux hooks and actions for cart and buy now
import { useDispatch, useSelector } from "react-redux";
import { addToCart, buyNow } from "../../Redux/amazonSlice";
// Import Firebase database configuration and functions
import { db } from "../../firebase.config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
// Import cart context for updating user cart
import { useCart } from "../../context/userCartContext";

// ProductDetails component - Displays detailed information for a single product
const ProductDetails = () => {
  // Redux dispatch for state updates
  const dispatch = useDispatch();

  // Get authentication status and user info from Redux store
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  const userInfo = useSelector((state) => state.amazon.userInfo);
  // State for controlling cart button
  const [cartButton, setCartButton] = useState(false);

  // Get product data from route loader
  const data = useLoaderData();
  const productsData = data.data.products;

  // Get product title from URL parameters
  const { title } = useParams();
  // Find the product by title
  const product = productsData.find((product) => product.title === title);

  // State for image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Automatically cycle through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [product.images.length]);

  // Handle image thumbnail click
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Get user cart and update function from context
  const { userCart, updateUserCart } = useCart();

  // State for selected quantity
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setSelectedQuantity(newQuantity);
  };

  // Save product to Firebase cart for authenticated users
  const saveProductToFirsebase = async (product) => {
    const productWithDefaultQuantity = {
      ...product,
      quantity: selectedQuantity,
    };
    const cartRef = doc(
      collection(db, "users", userInfo.email, "cart"),
      userInfo.id
    );
    try {
      const snap = await getDoc(cartRef);
      if (snap.exists()) {
        const cart = snap.data().cart || [];
        const existingProductIndex = cart.findIndex(
          (item) => item.title === product.title
        );
        if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += selectedQuantity;
        } else {
          cart.push(productWithDefaultQuantity);
        }
        await setDoc(cartRef, { cart: cart }, { merge: true });
        updateUserCart(cart);
      } else {
        await setDoc(
          cartRef,
          { cart: [productWithDefaultQuantity] },
          { merge: true }
        );
        updateUserCart([...userCart, productWithDefaultQuantity]);
      }
    } catch (error) {
      console.error("Error saving product to Firebase cart:", error);
    }
  };

  // Handle add to cart button click
  const handleAddToCart = (product) => {
    if (!authenticated) {
      // Add to Redux cart for guest users
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          images: product.images,
          thumbnail: product.thumbnail,
          brand: product.brand,
          quantity: selectedQuantity,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
        })
      );
    } else {
      // Add to Firebase cart for authenticated users
      saveProductToFirsebase(product);
    }
  };

  // Handle buy now button click
  const handleBuyNow = (product) => {
    if (authenticated) {
      dispatch(
        buyNow({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          images: product.images,
          thumbnail: product.thumbnail,
          brand: product.brand,
          quantity: selectedQuantity,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
        })
      );
    }
  };

  // Render product details page
  return (
    <div className="flex flex-col mdl:flex-row bg-white justify-between">
      {/* Scroll restoration for navigation */}
      <ScrollRestoration />
      {/* Image thumbnails section */}
      <div className="w-[5%] mt-10 ml-1 hidden mdl:block">
        {product.images.map((item, index) => (
          <div
            key={index}
            className="border-[1px] border-black rounded-lg mb-5"
            onClick={() => handleImageClick(index)}
          >
            <img src={item} alt="allImages" className="rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main product image section */}
      <div className="w-full mdl:w-[38%] mt-4 ">
        <img
          src={product.images[currentImageIndex]}
          className="w-full h-[85%]"
          alt="productImage"
        />
      </div>

      {/* Product details and offers section */}
      <div className="w-full mdl:w-[35%] mt-2 ml-2 mdl:ml-0 ">
        <h1 className="text-[26px] font-bold">{product.title}</h1>
        <p className="text-blue-500 capitalize ">Brand : {product.brand}</p>
        {/* Product rating section */}
        <div className="flex border-b-[1px] border-gray-200 pb-1">
          <span>{product.rating}&nbsp;</span>
          <span className="flex items-center ">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <img
                key={starIndex}
                className="w-4 h-4"
                src={
                  starIndex <= product.rating
                    ? star
                    : starIndex - 0.5 <= product.rating
                    ? halfStar
                    : emptyStar
                }
                alt={`star-${starIndex}`}
              />
            ))}
          </span>
          <span className="text-blue-500 ml-10">{product.stock} ratings</span>
        </div>
        {/* Product price and EMI section */}
        <div className="border-b-[1px] border-gray-200 pb-2">
          <div className="flex items-center mt-1">
            <p className="font-medium mb-1">&nbsp;₹&nbsp;</p>
            <span className="text-[26px] font-medium">{product.price}</span>
            <span>&nbsp;({product.discountPercentage}% Off)</span>
          </div>
          <p>No Cost EMI available</p>
        </div>
        {/* Offers section */}
        <div className="border-b-[1px] border-border-gray-200 pb-4">
          <div className="flex pt-3 pb-2">
            <img className="w-7 h-7" src={offers} alt="offers" />
            <span className="ml-5 font-semibold text-lg">Offers</span>
          </div>
          <div className="flex mr-2 text-sm mdl:text-base justify-between">
            <div className="w-[30%] border-2 border-gray-200 rounded-lg p-2">
              <p className="font-bold ">No Cost EMI</p>
              <p>EMI interest savings on Amazon Pay ICICI…</p>
            </div>
            <div className="w-[30%] border-2 border-gray-200 rounded-lg p-2">
              <p className="font-bold ">Bank Offers</p>
              <p>Upto ₹1,750.00 discount on select Credit Cards, HDFC…</p>
            </div>
            <div className="w-[30%] border-2 border-gray-200 rounded-lg p-2">
              <p className="font-bold ">Partner Offers</p>
              <p>Get GST invoice and save up to 28% on business purchases.</p>
            </div>
          </div>
        </div>
        {/* Delivery and service icons section */}
        <div className="w-full flex justify-between border-b-[1px] border-border-gray-200  pt-4 pb-2">
          <div className="w-[18%] flex flex-col  items-center ">
            <img src={delivery} alt="delivery" className="w-9 h-9" />
            <p className="text-blue-500 text-xs">Free Delivery</p>
          </div>
          <div className="w-[18%] flex flex-col  items-center ">
            <img src={cod} alt="cod" className="w-9 h-9" />
            <p className="text-blue-500 text-xs">Pay on Delivery</p>
          </div>
          <div className="w-[18%] flex flex-col  items-center ">
            <img src={exchange} alt="exchange" className="w-9 h-9" />
            <p className="text-blue-500 text-xs text-center">
              7 days Replacement
            </p>
          </div>
          <div className="w-[18%] flex flex-col  items-center justify-center ">
            <img src={delivered} alt="delivered" className="w-9 h-9" />
            <span className="text-blue-500 text-xs">Amazon Delivered</span>
          </div>
          <div className="w-[18%] flex flex-col  items-center ">
            <img src={transaction} alt="transaction" className="w-9 h-9" />
            <p className="text-blue-500 text-xs">Secure transaction</p>
          </div>
        </div>
        {/* Product description section */}
        <div className="pt-2">
          <span className="font-bold">About this item</span>
          <div className="ml-2">{product.description}</div>
        </div>
      </div>

      {/* Purchase options sidebar */}
      <div className="w-full mdl:w-[20%] h-[430px] border-[0.066rem] border-gray-200 rounded-lg p-5 mt-2 mr-1">
        <div className="flex items-center mt-1">
          <span className="text-[26px] font-medium text-red-600">
            ₹&nbsp;{product.price}
          </span>
          <span>&nbsp;({product.discountPercentage}% Off)</span>
        </div>
        <span className="text-blue-500">Delivery&nbsp;</span>
        <span>within Two Days.</span>
        <p className="text-green-600 text-xl font-bold pt-4">In stock.</p>
        <p className="pt-3">
          Sold by{" "}
          <span className="text-blue-500 capitalize ">{product.brand}</span> and{" "}
          <span className="text-blue-500">Fulfilled by Amazon.</span>
        </p>
        {/* Quantity selection dropdown */}
        <div className="pt-3">
          <span>Quantity: </span>
          <select
            className="border-[1px] border-gray-200 rounded-md "
            value={selectedQuantity}
            onChange={handleQuantityChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        {/* Add to cart and buy now buttons */}
        {cartButton ? (
          <Link to="/cart">
            <button
              className={`pt-2 w-full text-center text-blue-600 rounded-2xl  bg-gray-100 border-gray-200 p-[4px] mt-3 active:ring-2 active:ring-offset-1 active:ring-blue-600`}
            >
              Go to Cart
            </button>
          </Link>
        ) : (
          <button
            onClick={() => {
              handleAddToCart(product);
              setCartButton(true);
            }}
            className={`pt-2 w-full text-center rounded-2xl bg-yellow-300 hover:bg-yellow-400 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500`}
          >
            Add to Cart
          </button>
        )}
        {authenticated ? (
          <Link to="/checkout">
            <button
              onClick={() => handleBuyNow(product)}
              className={`pt-2 w-full text-center rounded-2xl bg-orange-400 hover:bg-orange-500 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500`}
            >
              Buy Now
            </button>
          </Link>
        ) : (
          <Link to="/Login">
            <button
              className={`pt-2 w-full text-center rounded-2xl bg-orange-400 hover:bg-orange-500 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500`}
            >
              Buy Now
            </button>
          </Link>
        )}

        <p className="text-blue-500 pt-3">Secure transaction</p>
      </div>
    </div>
  );
};

// Export the ProductDetails component as the default export
export default ProductDetails;
