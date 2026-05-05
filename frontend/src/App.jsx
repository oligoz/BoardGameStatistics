import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ListJogadores from "./pages/Jogador/ListJogadores";
import CreateJogador from "./pages/Jogador/CreateJogador";
import Admin from "./pages/Admin";
import "./styles/main.css";
import "./styles/index.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import LargePage from "./pages/LargePage";
import CreateJogo from "./pages/Jogo/CreateJogo";
import BggGames from "./pages/BggGames";
import ListJogos from "./pages/Jogo/ListJogos";
import ListLocais from "./pages/Local/ListLocais";
import CreateLocal from "./pages/Local/CreateLocal";
import UpdateJogador from "./pages/Jogador/UpdateJogador";
import CreatePartida from "./pages/Partida/CreatePartida";
import ListPartidas from "./pages/Partida/ListPartidas";
import UpdatePartida from "./pages/Partida/UpdatePartida";
import Statistics from "./pages/Estatisticas/Statistics";
import UpdateLocal from "./pages/Local/UpdateLocal";
import DeleteJogo from "./pages/Jogo/DeleteJogo";
import BggPlays from "./pages/BggPlays";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/estatisticas" element={<Statistics />} />
        <Route path="/jogadores" element={<ListJogadores />} />
        <Route
          path="/jogador/create"
          element={
            <ProtectedRoute>
              <CreateJogador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jogador/update/:id"
          element={
            <ProtectedRoute>
              <UpdateJogador />
            </ProtectedRoute>
          }
        />
        <Route path="/jogos" element={<ListJogos />} />
        <Route
          path="/jogo/:id"
          element={
            <ProtectedRoute>
              <DeleteJogo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jogos/create"
          element={
            <ProtectedRoute>
              <CreateJogo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bgg-games"
          element={
            <ProtectedRoute>
              <BggGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bgg-plays"
          element={
            <ProtectedRoute>
              <BggPlays />
            </ProtectedRoute>
          }
        />
        <Route path="/locais" element={<ListLocais />} />
        <Route
          path="/local/create"
          element={
            <ProtectedRoute>
              <CreateLocal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/local/update/:id"
          element={
            <ProtectedRoute>
              <UpdateLocal />
            </ProtectedRoute>
          }
        />
        <Route path="/partidas" element={<ListPartidas />} />
        <Route
          path="/partida/create"
          element={
            <ProtectedRoute>
              <CreatePartida />
            </ProtectedRoute>
          }
        />
        <Route path="/partida/update/:id" element={<UpdatePartida />} />
        <Route path="/large-page" element={<LargePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
