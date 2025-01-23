import { useState, useLayoutEffect, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Services from "./scenes/services";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Category from "./scenes/category";
import Orders from "./scenes/orders";
import Login from "./scenes/login";
import util from "./Utils/util";
import { appContext } from "./Utils/context";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const token = util.getToken();
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (token !== null && token !== undefined) {
      util.setToken(token);
    }
  }, [token]);

  const isLoggedIn = util.isLogged() || token != null;

  const getUserInfo = async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let projectedUserInfo = response.data.data[0];
        if (projectedUserInfo.users.profile_picture) {
          const filePath = projectedUserInfo.users.profile_picture;
          const serverBaseUrl = "http://localhost:5000"; // Update with your server's base URL
          const relativePath = filePath
            .replace(/\\/g, "/")
            .replace(/^public\//, "");
          const imageUrl = `${serverBaseUrl}/${relativePath}`;
          projectedUserInfo.users.profile_picture = imageUrl;
        }
        setUser(projectedUserInfo);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          toast.error(
            error.response ? error.response.message : "An error occurred."
          );
        }
      }
    }
  };
  useEffect(() => {
    getUserInfo();
  }, [location]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <appContext.Provider value={{ user }}>
          <div className="app">
            {isLoggedIn && <Sidebar isSidebar={isSidebar} />}
            <main
              className="content"
              style={{
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "20px",
                height: "100%",
              }}
            >
              {isLoggedIn && <Topbar setIsSidebar={setIsSidebar} />}
              <Routes>
                {!isLoggedIn && <Route path="/login" element={<Login />} />}
                {!isLoggedIn && (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
                {isLoggedIn && <Route path="/team" exact element={<Team />} />}
                {isLoggedIn && (
                  <Route path="/category" element={<Category />} />
                )}
                {isLoggedIn && (
                  <Route path="/services" element={<Services />} />
                )}
                {isLoggedIn && <Route path="/orders" element={<Orders />} />}
              </Routes>
            </main>
          </div>
        </appContext.Provider>
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
