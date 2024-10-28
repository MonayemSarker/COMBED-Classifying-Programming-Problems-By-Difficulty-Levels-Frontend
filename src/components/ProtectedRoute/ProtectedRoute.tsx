import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: any) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/" />;
  }

  return children;
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
          `http://localhost:3000/users/${decodedToken.sub}`,
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
