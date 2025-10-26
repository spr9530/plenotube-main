import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { AuthProvider } from "./context/AuthContext"
import "@/styles/globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '805820231410-d1c2thc3f5jgbq18r8o02pb3ibd3f4m9.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </GoogleOAuthProvider>;
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
