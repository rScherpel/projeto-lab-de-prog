import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(undefined);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsValid(false);
      return;
    }

    fetch("http://localhost:3000/api/token/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Token inválido");
        }
        return res.json();
      })
      .then((data) => {
        if (data.valid) {
          setIsValid(true);
        } else {
          throw new Error("Token inválido");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setIsValid(false);
      });
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