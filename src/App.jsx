import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Chat from "./pages/chat/Chat";

const SecureRoute = ({ redirectPath = "/", children }) => {
  if (!localStorage.getItem("token")) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Auth />} />
      <Route
        exact
        path="/chat-screen"
        element={
          <SecureRoute>
            <Chat />
          </SecureRoute>
        }
      />
    </Routes>
  );
}

export default App;
