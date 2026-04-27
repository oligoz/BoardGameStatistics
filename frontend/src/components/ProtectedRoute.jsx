import { Navigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    api
      .get("api/auth/user-data/")
      .then(setIsAuthorized(true))
      .catch((error) => {
        localStorage.removeItem(ACCESS_TOKEN);
        console.log(error.response);
        setIsAuthorized(false);
      });
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
