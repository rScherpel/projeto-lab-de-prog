import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/login/Login";
import Register from "@/pages/register/Register";
import Home from "@/pages/home/Home";
import Projects from "@/pages/projects/Projects";
import Board from "@/pages/board/Board";
import IssueDetail from "@/pages/issue/IssueDetail";

import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/board/:projectId"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issue/:issueId"
          element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;