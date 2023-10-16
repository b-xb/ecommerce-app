import { API_ENDPOINT } from ".";

export const getUserById = async (userId) => {
  const response = await fetch(`${API_ENDPOINT}/users/${userId}`);
  const responseData = await response.json();
  return responseData;
};

export const getCartItemsByUser = async (userId) => {
  const response = await fetch(`${API_ENDPOINT}/users/${userId}/cart-items`);
  const responseData = await response.json();
  return responseData;
};

export const updateCartItemByUserAndProduct = async (userId, productId, amount) => {
  const response = await fetch(`${API_ENDPOINT}/users/${userId}/cart-items/${productId}`, {
    method: "PUT",
    body: JSON.stringify({
      amount,
    }),
    headers: {
      "Content-Type": "application/json",
    },   
  });
  const responseData = await response.json();

  
  return responseData;
};
