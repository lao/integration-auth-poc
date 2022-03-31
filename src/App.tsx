import { Container, Typography } from "@mui/material";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import CallbackPage from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";


require("dotenv").config();


function App() {
  return (
    <Container>
      <div>
        <header>
          <Typography variant="h2">dropbox demo</Typography>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/:service/callback" element={<CallbackPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App;
