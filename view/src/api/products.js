import { API_ENDPOINT } from ".";


export const getProducts = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/products`);
    const responseData = await response.json();
    return responseData;
  } catch {
    return [];
  }
};

export const getProductById = async (productId) => {
  const response = await fetch(`${API_ENDPOINT}/products/${productId}`);
  const responseData = await response.json();
  return responseData;
};
