import { create } from "zustand";
import api from "../api";

const useJogosStore = create((set) => ({
  jogos: null,
  loading: false,
  error: null,

  fetchJogos: () => {
    set({ loading: true, error: null });
    api
      .get("/api/jogos/")
      .then((res) => res.data)
      .then((data) => set({ jogos: data, loading: false }))
      .catch((error) => set({ error: error.message, loading: false }));
  },

  clearJogos: () => set({ jogos: null, loading: false, error: null }),
}));

export default useJogosStore;
