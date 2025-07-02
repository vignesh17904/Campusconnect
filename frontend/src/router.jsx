import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GroupChat from "./pages/GroupChat.jsx";
import AskAI from "./pages/AskAI.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/resend-verification",
    element: <ResendVerification />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/group-chat",
    element: (
      <PrivateRoute>
        <GroupChat />
      </PrivateRoute>
    ),
  },
  {
    path: "/ask-ai",
    element: (
      <PrivateRoute>
        <AskAI />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
