import axios from "axios";

export async function productsData({ params }) {
    let url = 'https://dummyjson.com/products?limit=100';

    if (params?.category) {
        url = `https://dummyjson.com/products/category/${params.category}`;
    }

    const products = await axios.get(url);

    return products;
}
