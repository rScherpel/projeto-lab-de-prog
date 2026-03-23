import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "./protectedRoute.js";

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(undefined);

  useEffect(() => {
    const checkToken = async () => {
      const isTokenValid = await validateToken();
      setIsValid(isTokenValid);
    };

    checkToken();
  }, []);

  if (isValid === undefined) {
    return <div>Carregando...</div>;
  }

  if (!isValid) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;