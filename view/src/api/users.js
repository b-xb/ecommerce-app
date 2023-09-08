import { API_ENDPOINT } from ".";

export const getUserById = async (id) => {
  console.log(`${API_ENDPOINT}/users/${id}`);
  const response = await fetch(`${API_ENDPOINT}/users/${id}`);
  const responseData = await response.json();
  return responseData;
};