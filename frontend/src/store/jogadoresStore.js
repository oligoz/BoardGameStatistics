import { create } from "zustand";
import api from "../api";

const useJogadoresStore = create((set) => ({
  jogadores: null,
  loading: false,
  error: null,

  fetchJogadores: () => {
    set({ loading: true, error: null });
    api
      .get("/api/jogadores/")
      .then((res) => res.data)
      .then((data) => set({ jogadores: data, loading: false }))
      .catch((error) => set({ error: error.message, loading: false }));
  },

  clearJogadores: () => set({ jogadores: null, loading: false, error: null }),
}));

export default useJogadoresStore;
