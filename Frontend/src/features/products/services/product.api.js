import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/products",
    withCredentials: true
});


export async function createProduct(formData) {

    const response = await productApiInstance.post("/create", formData)

    return response.data;

}

export async function getSellerProducts() {

    const response = await productApiInstance.get("/seller")

    return response.data;
}