// src/store/userStore.js
import { create } from "zustand";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: () => {
    set({ loading: true, error: null });
    api
      .get("api/auth/user-data/")
      .then((res) => res.data)
      .then((data) => {
        set({ user: data, loading: false });
      })
      .catch((error) => {
        error.response && error.response.status === 401
          ? (localStorage.removeItem(ACCESS_TOKEN),
            console.log("Token inválido, removido do localStorage"))
          : set({ error: error.message, loading: false });
      });
  },

  clearUser: () => set({ user: null, loading: false, error: null }),
}));

export default useUserStore;
