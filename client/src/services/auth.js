import { API_URL } from "../config";

const api = API_URL;

export const register = async (data) => {
  const res = await fetch(`${api}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Registrasi gaga");
  return json;
};

export const login = async (data) => {
  const res = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Login Gagal");
  return json;
};
