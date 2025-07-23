import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import {  useUser } from "../context/UserContext";

export default function MainLayout() {
  const { user } = useUser

  return (
    <div >
      <Navbar />
      <main className="mt-4 px-4"> 
        <Outlet />
      </main>
    </div>
  );
}