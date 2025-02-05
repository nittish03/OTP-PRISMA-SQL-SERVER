"use client";
import { useState } from "react";
import NavLink from "next/link";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="shadow-md bg-gradient-to-r from-green-500 to-blue-500 backdrop-blur-lg  flex justify-between items-center py-1 px-6 text-white font-inter fixed top-0 left-0 w-full z-50">
      <div className="text-3xl font-extrabold font-koho text-white drop-shadow-lg">DECENTRA</div>
      <div className="flex gap-6 text-base">
        <NavLink href="/" className=" hover:text-green-100 transition">Home</NavLink>
        <NavLink href="/dashboard" className=" hover:text-green-100 transition">Dashboard</NavLink>


      </div>
      <div className="flex items-center">
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-lg font-koho">{session.user?.name?.split(" ")[0]}</span>
            <button
              className="flex items-center justify-center bg-white text-green-600 p-2 rounded-full hover:bg-green-200"
              onClick={handleLogout}
            >
              <CgProfile size={30} />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="py-2 px-4 bg-green-500 hover:bg-green-400 text-white rounded-lg text-lg">Login/Signup</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
