import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login/Login";

const App: React.FC = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Rutas futuras... */}
        </Routes>
      </Router>
    );
  };

export default App;
