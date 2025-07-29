import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScrollRestoration, useLoaderData, Link } from "react-router-dom";
// Asset imports: rating stars and icons for offers & delivery info
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

// Redux hooks and cart actions
import { useDispatch, useSelector } from "react-redux";
import { addToCart, buyNow } from "../../Redux/amazonSlice";

// Firestore configuration and functions for persisting cart
import { db } from "../../firebase.config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

// Custom hook to update cart context
import { useCart } from "../../context/userCartContext";

/**
 * ProductDetails component renders detailed view of a single product,
 * including image carousel, pricing, offers, purchase actions,
 * and persists cart for authenticated users.
 */
const ProductDetails = () => {
  const dispatch = useDispatch();

  // Authentication state and user info from Redux store
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  const userInfo = useSelector((state) => state.amazon.userInfo);

  // Local state to toggle 'Go to Cart' button after adding
  const [cartButton, setCartButton] = useState(false);

  // Load data provided by React Router loader
  const data = useLoaderData();
  const productsData = data.data.products;

  // Extract product title from URL params
  const { title } = useParams();
  // Find the product object matching the title
  const product = productsData.find((product) => product.title === title);

  // Carousel: current image index and auto-rotation effect
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [product.images.length]);

  // Click handler to manually select carousel image
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Cart context for updating Firestore cart
  const { updateUserCart } = useCart();
  // Quantity selection state and handler
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const handleQuantityChange = (e) => {
    setSelectedQuantity(parseInt(e.target.value, 10));
  };

  /**
   * saveProductToFirsebase
   * Persists or updates product in Firestore under user-specific cart.
   * Increments quantity if existing, or creates new entry.
   */
  const saveProductToFirsebase = async (product) => {
    const productWithQuantity = { ...product, quantity: selectedQuantity };
    const cartRef = doc(
      collection(db, "users", userInfo.email, "cart"),
      userInfo.id
    );
    try {
      const snap = await getDoc(cartRef);
      let cart = snap.exists() ? snap.data().cart || [] : [];
      const idx = cart.findIndex((item) => item.title === product.title);
      if (idx !== -1) {
        cart[idx].quantity += selectedQuantity;
      } else {
        cart.push(productWithQuantity);
      }
      await setDoc(cartRef, { cart }, { merge: true });
      updateUserCart(cart);
    } catch (error) {
      console.error("Error saving product to Firebase cart:", error);
    }
  };

  /**
   * handleAddToCart
   * For unauthenticated users, dispatch Redux action.
   * For authenticated, save to Firestore.
   */
  const handleAddToCart = (product) => {
    if (!authenticated) {
      dispatch(addToCart({ ...product, quantity: selectedQuantity }));
    } else {
      saveProductToFirsebase(product);
    }
  };

  /**
   * handleBuyNow
   * Dispatches buyNow action only for authenticated users.
   * Navigates to checkout page on link click.
   */
  const handleBuyNow = (product) => {
    if (authenticated) {
      dispatch(buyNow({ ...product, quantity: selectedQuantity }));
    }
  };

  return (
    <div className="flex flex-col mdl:flex-row bg-white justify-between">
      {/* Ensures scroll position is restored on navigation */}
      <ScrollRestoration />

      {/* Thumbnail sidebar for carousel navigation */}
      <div className="w-[5%] mt-10 ml-1 hidden mdl:block">
        {product.images.map((item, idx) => (
          <div
            key={idx}
            className="border-[1px] border-black rounded-lg mb-5 cursor-pointer"
            onClick={() => handleImageClick(idx)}
          >
            <img src={item} alt="thumbnail" className="rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main carousel display */}
      <div className="w-full mdl:w-[38%] mt-4">
        <img
          src={product.images[currentImageIndex]}
          className="w-full h-[85%]"
          alt="productImage"
        />
      </div>

      {/* Product info and offers section */}
      <div className="w-full mdl:w-[35%] mt-2 ml-2 mdl:ml-0">
        <h1 className="text-[26px] font-bold">{product.title}</h1>
        <p className="text-blue-500 capitalize">Brand: {product.brand}</p>

        {/* Ratings display with stars and count */}
        <div className="flex border-b-[1px] border-gray-200 pb-1">
          <span>{product.rating}&nbsp;</span>
          <span className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                className="w-4 h-4"
                src={
                  i <= product.rating
                    ? star
                    : i - 0.5 <= product.rating
                    ? halfStar
                    : emptyStar
                }
                alt={`star-${i}`}
              />
            ))}
          </span>
          <span className="text-blue-500 ml-10">{product.stock} ratings</span>
        </div>

        {/* Price and discount information */}
        <div className="border-b-[1px] border-gray-200 pb-2">
          <div className="flex items-center mt-1">
            <p className="font-medium mb-1">&nbsp;₹&nbsp;</p>
            <span className="text-[26px] font-medium">{product.price}</span>
            <span>&nbsp;({product.discountPercentage}% Off)</span>
          </div>
          <p>No Cost EMI available</p>
        </div>

        {/* Offers section with icons and details */}
        <div className="border-b-[1px] border-gray-200 pb-4">
          <div className="flex pt-3 pb-2">
            <img src={offers} alt="offers" className="w-7 h-7" />
            <span className="ml-5 font-semibold text-lg">Offers</span>
          </div>
          <div className="flex mr-2 text-sm mdl:text-base justify-between">
            {/* Example offer cards */}
            <div className="w-[30%] border-2 border-gray-200 rounded-lg p-2">
              <p className="font-bold">No Cost EMI</p>
              <p>EMI interest savings on Amazon Pay ICICI…</p>
            </div>
            <div className="w-[30%] border-2 border-gray-200 rounded-lg p-2">
              <p className="font-bold">Bank Offers</p>
              <p>Upto ₹1,750.00 discount on select Credit Cards, HDFC…</p>
            </div>
            <div className="w-[30%] border-2 border-gray-200 rounded-lg p-2">
              <p className="font-bold">Partner Offers</p>
              <p>Get GST invoice and save up to 28% on business purchases.</p>
            </div>
          </div>
        </div>

        {/* Delivery & service icons */}
        <div className="w-full flex justify-between border-b-[1px] border-gray-200 pt-4 pb-2">
          {[
            { icon: delivery, label: "Free Delivery" },
            { icon: cod, label: "Pay on Delivery" },
            { icon: exchange, label: "7 days Replacement" },
            { icon: delivered, label: "Amazon Delivered" },
            { icon: transaction, label: "Secure transaction" },
          ].map((item, idx) => (
            <div key={idx} className="w-[18%] flex flex-col items-center">
              <img src={item.icon} alt={item.label} className="w-9 h-9" />
              <p className="text-blue-500 text-xs text-center">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Long description */}
        <div className="pt-2">
          <span className="font-bold">About this item</span>
          <div className="ml-2">{product.description}</div>
        </div>
      </div>

      {/* Action panel: price, stock, quantity, and purchase buttons */}
      <div className="w-full mdl:w-[20%] h-[430px] border-[0.066rem] border-gray-200 rounded-lg p-5 mt-2 mr-1">
        <div className="flex items-center mt-1">
          <span className="text-[26px] font-medium text-red-600">
            ₹ {product.price}
          </span>
          <span>&nbsp;({product.discountPercentage}% Off)</span>
        </div>
        <span className="text-blue-500">Delivery&nbsp;</span>
        <span>within Two Days.</span>
        <p className="text-green-600 text-xl font-bold pt-4">In stock.</p>
        <p className="pt-3">
          Sold by{" "}
          <span className="text-blue-500 capitalize">{product.brand}</span> and{" "}
          <span className="text-blue-500">Fulfilled by Amazon.</span>
        </p>

        {/* Quantity selector */}
        <div className="pt-3">
          <span>Quantity: </span>
          <select
            className="border-[1px] border-gray-200 rounded-md"
            value={selectedQuantity}
            onChange={handleQuantityChange}
          >
            {[1, 2, 3, 4, 5].map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Add to Cart / Go to Cart button */}
        {cartButton ? (
          <Link to="/cart">
            <button className="pt-2 w-full text-center text-blue-600 rounded-2xl bg-gray-100 border-gray-200 p-[4px] mt-3 active:ring-2 active:ring-offset-1 active:ring-blue-600">
              Go to Cart
            </button>
          </Link>
        ) : (
          <button
            onClick={() => {
              handleAddToCart(product);
              setCartButton(true);
            }}
            className="pt-2 w-full text-center rounded-2xl bg-yellow-300 hover:bg-yellow-400 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500"
          >
            Add to Cart
          </button>
        )}

        {/* Conditional Buy Now button based on auth */}
        {authenticated ? (
          <Link to="/checkout">
            <button
              onClick={() => handleBuyNow(product)}
              className="pt-2 w-full text-center rounded-2xl bg-orange-400 hover:bg-orange-500 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500"
            >
              Buy Now
            </button>
          </Link>
        ) : (
          <Link to="/Login">
            <button className="pt-2 w-full text-center rounded-2xl bg-orange-400 hover:bg-orange-500 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500">
              Buy Now
            </button>
          </Link>
        )}

        {/* Secure transaction note */}
        <p className="text-blue-500 pt-3">Secure transaction</p>
      </div>
    </div>
  );
};

export default ProductDetails;
