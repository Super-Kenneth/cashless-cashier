import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";

export default function Login() {
  console.log("HI FROM LOGIN FOLDER");
  const router = useRouter();

  return (
    <div className="h-screen w-screen  bg-red-50">
      {/* <div className="h-[50%] w-[50%] bg-red-500"></div> */}
      <div>HI HAHAHAHA</div>
      <div className="bg-red-400"></div>
      <button type="button" onClick={() => router.push("./home")}>
        Dashboard
      </button>
    </div>
  );
}
