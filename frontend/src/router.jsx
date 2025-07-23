import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import GroupChat from "./pages/GroupChat.jsx";
import AskAI from "./pages/AskAI.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Notifications from "./pages/Notifications.jsx";
import QuestionDetails from "./pages/QuestionDetails.jsx";
import Community from "./pages/Community.jsx";
import AskQuestion from "./pages/AskQuestion.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MainLayout from "./Layout/MainLayout.jsx";
import { useUser } from "./context/UserContext.jsx";

function AdminWrapper() {
  const { user } = useUser();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <AdminDashboard />;
}

const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/resend-verification", element: <ResendVerification /> },

  // Protected routes with shared layout
  {
    element: <PrivateRoute><MainLayout />
</PrivateRoute>,
    children: [
      { path: "/notifications", element: <Notifications /> },
      { path: "/profile-page", element: <ProfilePage /> },
      { path: "/community", element: <Community /> },
      { path: "/community/question/:questionId", element: <QuestionDetails /> },
      { path: "/community/question/ask-question", element: <AskQuestion /> },
      { path: "/group-chat", element: <GroupChat /> },
      { path: "/ask-ai", element: <AskAI /> },
      { path: "/admin", element: <AdminWrapper /> },
    ],
  },

  { path: "*", element: <PageNotFound /> },
]);

export default router;
