import { create } from "zustand";
import api from "../api";

const usePartidasStore = create((set) => ({
  partidas: null,
  loading: false,
  error: null,

  fetchPartidas: () => {
    set({ loading: true, error: null });
    api
      .get("/api/partidas/")
      .then((res) => res.data)
      .then((data) => set({ partidas: data, loading: false }))
      .catch((error) => set({ error: error.message, loading: false }));
  },

  clearPartidas: () => set({ partidas: null, loading: false, error: null }),
}));

export default usePartidasStore;
