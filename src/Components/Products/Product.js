
import { Link } from 'react-router-dom';
import { star, halfStar, emptyStar } from "../../assets/index";

<<<<<<< HEAD
// Redux hooks and actions for cart state
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/amazonSlice";

// Firestore configuration and functions
import { db } from "../../firebase.config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

// Custom context for user cart
import { useCart } from "../../context/userCartContext";

/**
 * Product component renders a list of product cards with details,
 * ratings, pricing, and an Add to Cart button supporting
 * authenticated (Firestore) and guest (Redux) users.
 */
=======
>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c
const Product = (props) => {
  // Destructure productsData array from props
  const { productsData } = props;
<<<<<<< HEAD

  // Redux dispatch and selectors for authentication and user info
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);

  // Custom cart context for updating cart in Firestore
  const { userCart, updateUserCart } = useCart();

  /**
   * saveProductToFirsebase
   * Adds or updates a product entry in the Firestore cart collection
   * under users/{email}/cart/{userId}. Merges quantities if exists.
   */
=======
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.amazon.userInfo);
  const authenticated = useSelector((state) => state.amazon.isAuthenticated);
  const { userCart, updateUserCart } = useCart();
>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c
  const saveProductToFirsebase = async (product) => {
    const productWithDefaultQuantity = { ...product, quantity: 1 };
    // Reference to Firestore document for this user's cart
    const cartRef = doc(
      collection(db, "users", userInfo.email, "cart"),
      userInfo.id
    );
    const snap = await getDoc(cartRef);

    if (snap.exists()) {
      // Update existing cart array
      const cart = snap.data().cart || [];
      const existingIndex = cart.findIndex(
        (item) => item.title === product.title
      );
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push(productWithDefaultQuantity);
      }
      // Write updated cart back to Firestore
      await setDoc(cartRef, { cart }, { merge: true });
      updateUserCart(cart);
    } else {
      // Create new cart array if not exists
      await setDoc(
        cartRef,
        { cart: [productWithDefaultQuantity] },
        { merge: true }
      );
      updateUserCart([...userCart, productWithDefaultQuantity]);
    }
  };

  /**
   * handleButton
   * On click, dispatches addToCart for guests, or calls
   * saveProductToFirsebase for authenticated users.
   */
  const handleButton = async (product) => {
    if (!authenticated) {
      // Use Redux for unauthenticated users
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
      // Save to Firestore for authenticated users
      await saveProductToFirsebase(product);
    }
  };

  // Render a card for each product in productsData
  return productsData.map((product, index) => (
    <div
      key={index}
      className="w-full mx-auto mdl:w-[30%] my-5 rounded border-[1px] border-gray-200 shadow-none hover:shadow-testShadow duration-200"
    >
      {/* Image and link to product detail */}
      <div className="bg-gray-100 border-b-[1px] border-gray-200 flex justify-center items-center cursor-pointer relative group">
        <Link to={`${product.title}`}>
          <img
            className="w-full h-72"
            src={product.thumbnail}
            alt="productImage"
          />
        </Link>
      </div>

<<<<<<< HEAD
      {/* Product details section */}
      <div className="p-2">
        <Link to={`${product.title}`}>
          <p className="text-lg font-medium cursor-pointer">{product.title}</p>
        </Link>

        {/* Short description preview */}
        <div className="my-3">
          <p>{product.description.substring(0, 50)}...</p>
        </div>

        {/* Rating stars display */}
        <div className="flex items-center">
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
          <span className="ml-1 text-blue-500">{product.rating}</span>
        </div>

        {/* Price and discount display */}
        <div className="flex items-center mt-1">
          <p className="font-medium mb-1">&nbsp;₹&nbsp;</p>
          <span className="text-[26px] font-medium">{product.price}</span>
          <span>&nbsp;({product.discountPercentage}% Off)</span>
        </div>

        {/* Add to Cart button */}
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
=======
>>>>>>> 065d13bc514f0944cfe658bbdfd72108175af39c

export default Product;
