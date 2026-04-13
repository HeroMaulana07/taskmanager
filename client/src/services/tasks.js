import { API_URL } from "../config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Gagal memuat data tugas");
  }
  return json;
};

export const createTask = async (taskData) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memuat tugas");
  return json;
};

export const updateTask = async (id, taskData) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memperbarui tugas");
  return json;
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal menghapus tugas");
  return json;
};
