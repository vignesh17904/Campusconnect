# 🎓 CampusConnect – College Collaboration Platform

CampusConnect is a full-stack **personal project** built to streamline academic collaboration within colleges. It enables students to connect via academic groups, participate in real-time chats, ask questions, and access AI-powered study assistance — all in one unified platform.
CampusConnect emphasizes collaborative learning in academic groups, replicating real-world study environments and project teams.
---

## 🚀 Features

- **User Authentication & Email Verification**  
  Secure sign-up and login using JWT-based authentication (access/refresh tokens) with email verification via Nodemailer.

- **Auto Group Assignment**  
  On sign-up, users are automatically assigned to default groups based on their branch and year.

- **User-Created Groups + Join Requests**  
  Students can create their own groups, browse available ones, send join requests, and manage group memberships.

- **Real-Time Group Chat**  
  Group-based chat functionality built with Socket.IO, supporting text, image, video, and PDF uploads via Multer + Cloudinary.

- **AI Assistant (Gemini API)**  
  Built-in chatbot helps users compose posts, resolve doubts, and brainstorm ideas contextually using Gemini.

- **Community Q&A Forum**  
  Reddit-style discussion board where students can post questions and answers with upvote/downvote support.

- **Reputation System**  
  Students earn or lose points based on community feedback, encouraging helpful contributions.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios, React Router  
- **Backend**: Node.js, Express.js, JWT, Nodemailer  
- **Real-Time**: Socket.IO  
- **Database**: MongoDB + Mongoose  
- **File Uploads**: Multer, Cloudinary  
- **AI Integration**: Gemini API  
- **Tools**: GitHub, Postman, VS Code

---

## 🔧 Getting Started

### Backend

```bash
cd backend
npm install
npm start
# Add your .env file with:
# - MONGODB_URI
# - JWT_SECRET
# - REFRESH_TOKEN_SECRET
# - EMAIL_USER / EMAIL_PASS
# - CLOUDINARY credentials
# - GEMINI_API_KEY


### Frontend

cd frontend
npm install
npm run dev
