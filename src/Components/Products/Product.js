// Import React for component development
import React from "react";
// Import Link for navigation to product details
import { Link } from "react-router-dom";
// Import star icons for rating display
import { star, halfStar, emptyStar } from "../../assets/index";
// Import Redux hooks and actions for cart management
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/amazonSlice";
// Import Firebase database configuration and functions
import { db } from "../../firebase.config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
// Import cart context for updating user cart
import { useCart } from "../../context/userCartContext";

// Product component - Renders a list of product cards with add to cart functionality
const Product = (props) => {
  const { productsData } = props;

  // Redux dispatch for state updates
  const dispatch = useDispatch();
  // Get user info and authentication status from Redux store
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  // Get user cart and update function from context
  const { userCart, updateUserCart } = useCart();

  // Save product to Firebase cart for authenticated users
  const saveProductToFirsebase = async (product) => {
    const productWithDefaultQuantity = {
      ...product,
      quantity: 1,
    };
    const cartRef = doc(
      collection(db, "users", userInfo.email, "cart"),
      userInfo.id
    );
    const snap = await getDoc(cartRef);
    if (snap.exists()) {
      const cart = snap.data().cart || [];
      const existingProductIndex = cart.findIndex(
        (item) => item.title === product.title
      );
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
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
  };

  // Handle add to cart button click
  const handleButton = async (product) => {
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
          quantity: 1,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
        })
      );
    } else {
      // Add to Firebase cart for authenticated users
      await saveProductToFirsebase(product);
    }
  };

  // Render product cards
  return productsData.map((product, index) => (
    <div
      className="w-full mx-auto mdl:w-[30%] my-5 rounded border-[1px] border-gray-200 shadow-none hover:shadow-testShadow duration-200"
      key={index}
    >
      {/* Product image section */}
      <div className=" bg-gray-100 border-b-[1px] border-gray-200 flex justify-center items-center cursor-pointer relative group">
        <Link to={`${product.title}`}>
          <img
            className="w-full h-72"
            src={product.thumbnail}
            alt="productImage"
          />
        </Link>
      </div>
      {/* Product details section */}
      <div className="p-2 ">
        <Link to={`${product.title}`}>
          <div>
            <p className="text-lg font-medium cursor-pointer">
              {product.title}
            </p>
          </div>
        </Link>
        <div className="my-3">
          <p>{product.description.substring(0, 50)}...</p>
        </div>
        {/* Product rating section */}
        <div className="flex items-center ">
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
          <div className="ml-1 text-blue-500">{product.rating}</div>
        </div>
        {/* Product price and discount section */}
        <div className="flex items-center mt-1">
          <p className="font-medium mb-1">&nbsp;₹&nbsp;</p>
          <span className="text-[26px] font-medium">{product.price}</span>
          <span>&nbsp;({product.discountPercentage}% Off)</span>
        </div>
        {/* Add to cart button */}
        <button
          onClick={() => handleButton(product)}
          className={`text-lg font-medium w-full text-center rounded-lg bg-yellow-300 hover:bg-yellow-400 p-[4px] mt-3 shadow active:ring-2 active:ring-offset-1 active:ring-blue-500`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  ));
};

// Export the Product component as the default export
export default Product;
