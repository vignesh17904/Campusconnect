import { createBrowserRouter } from "react-router-dom";
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/notifications",
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path:"/community",
    element:(
      <PrivateRoute>
        <Community />
      </PrivateRoute>
    )
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
    path: "/profile-page/:userId",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/community/question/:questionId",
    element: (
      <PrivateRoute>
        <QuestionDetails />
      </PrivateRoute>
    ),
  },
   {
    path: "/community/question/ask-question",
    element: (
      <PrivateRoute>
       <AskQuestion />
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
