
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="mt-4 px-4"> 
        <Outlet />
      </main>
    </>
  );
}
