import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Login() {
  console.log("HI FROM LOGIN FOLDER");
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-[url('/images/bg.svg')] bg-cover">
      <div className="absolute h-screen w-full bg-white bg-opacity-40 flex justify-center items-center">
        <div className="bg-blue-200 bg-opacity-60 rounded-xl py-6 max-h-[80%] w-[50%] flex flex-col justify-center items-center gap-y-4">
          <Image
            priority={true}
            src="/images/logo.png"
            alt="logo"
            width={0}
            height={0}
            className=" max-h-[80px] w-auto"
          />
          <input
            type="number"
            placeholder="Canteen ID"
            className=" outline-none rounded-xl p-2 w-[50%]"
          />
          <input
            type="password"
            placeholder="Password"
            className=" outline-none rounded-xl p-2 w-[50%]"
          />
          <button
            type="button"
            onClick={() => router.push("./home")}
            className=" bg-[#002147] text-white rounded-xl p-2 w-[20%]"
          >
            Log in
          </button>
        </div>
      </div>

      {/* <button type="button" onClick={() => router.push("./home")}>
        Dashboard
      </button> */}
    </div>
  );
}
