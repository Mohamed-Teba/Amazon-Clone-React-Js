// Import axios for making HTTP requests
import axios from "axios";

// Function to fetch products data from external API
export async function productsData() {
  // Fetch products from dummyjson API with a limit of 100 products
  const products = await axios.get("https://dummyjson.com/products?limit=100");
  // Return the products data
  return products;
}
