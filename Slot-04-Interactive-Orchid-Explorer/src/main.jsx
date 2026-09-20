import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </StrictMode>
);