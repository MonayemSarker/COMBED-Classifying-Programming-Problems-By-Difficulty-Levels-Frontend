import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiBaseUrl, decodeToken, isTokenExpired } from "../../utils/authUtil";

function ProtectedRoute({ children }: any) {
  const [isValidUser, setIsValidUser] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    // console.log(isValidUser);

    if (!accessToken) {
      setIsValidUser(false);
      return;
    }

    const decodedToken = decodeToken(accessToken);
    // console.log(decodedToken);

    if (!decodedToken || isTokenExpired(decodedToken.exp)) {
      localStorage.removeItem("accessToken"); // Remove expired token
      setIsValidUser(false);
      return;
    }
    const validateUser = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/users/${decodedToken.sub}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("accessToken"); // Remove expired token
          setIsValidUser(false);
          throw new Error("User validation failed");
        }
        setIsValidUser(true);
      } catch (error) {
        console.error("User validation error:", error);
        localStorage.removeItem("accessToken"); // Clean up if validation fails
        setIsValidUser(false);
      }
    };

    validateUser();
  }, [localStorage.getItem("accessToken")]);

  return isValidUser ? children : <Navigate to="/" />;
}

export default ProtectedRoute;

/* 
unction ProtectedRoute({ children }: any) {
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    // console.log(accessToken);

    if (!accessToken) {
      setIsValidUser(false);
      return;
    }

    const decodedToken = decodeToken(accessToken);
    // console.log(decodedToken);

    if (!decodedToken || isTokenExpired(decodedToken.exp)) {
      localStorage.removeItem("accessToken"); // Remove expired token
      setIsValidUser(false);
      return;
    }
    const validateUser = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/users/${decodedToken.sub}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("User validation failed");
        setIsValidUser(true);
      } catch (error) {
        console.error("User validation error:", error);
        localStorage.removeItem("accessToken"); // Clean up if validation fails
        setIsValidUser(false);
      }
    };

    validateUser();
  }, []);

  return isValidUser ? children : <Navigate to="/" />;
}
*/
