import { API_ENDPOINT } from ".";

export const authRegisterUser = async (form) => {
  const response = await fetch(`${API_ENDPOINT}/auth/register`, {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  return responseData;
}

export const authLogin = async (form) => {
  const response = await fetch(`${API_ENDPOINT}/auth/login`, {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  return responseData;
}

export const authLogout = async () => {
  const response = await fetch(`${API_ENDPOINT}/auth/logout`, {
    method: "POST",
  });

  if(response.ok) {
    const responseData = await response.json();
    return responseData;
  } else {
    return null;
  }
}

export const authVerify = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/verify`);

    if(response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return null;
    }
  } catch {
    return {error:true};
  }

}