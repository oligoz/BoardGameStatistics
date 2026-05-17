import { create } from "zustand";
import api from "../api";

const useLocaisStore = create((set) => ({
  locais: null,
  loading: false,
  error: null,

  fetchLocais: () => {
    set({ loading: true, error: null });
    api
      .get("/api/locais/")
      .then((res) => res.data)
      .then((data) => set({ locais: data, loading: false }))
      .catch((error) => set({ error: error.message, loading: false }));
  },

  clearLocais: () => set({ locais: null, loading: false, error: null }),
}));

export default useLocaisStore;
