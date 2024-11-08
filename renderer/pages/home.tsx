import React from "react";
import Head from "next/head";
import moment from "moment";

export default function HomePage() {
  const date = moment().utcOffset("+08:00").format("ddd, MMMM DD YYYY");
  const time = moment().format("LT");

  return (
    <React.Fragment>
      <Head>
        <title>CMI Canteen</title>
      </Head>
      <main className=" flex flex-row gap-x-4 w-sceen h-screen bg-[#E4EFFF] p-4">
        <div className=" w-[70%] bg-white rounded-xl h-full p-4"></div>

        <div className=" w-[30%] h-full flex flex-col gap-y-4">
          <div className=" w-full h-[30%] bg-white rounded-xl text-center flex flex-col gap-y-2 justify-center items-center">
            <p className=" font-semibold text-3xl text-[#002147]">{date}</p>
            <p className=" font-semibold text-2xl text-[#002147]">{time}</p>
          </div>
          <div className=" w-full h-[70%] bg-white rounded-xl p-4 pt-10">
            <h1 className=" text-lg mb-4">Enter Amount: </h1>
            <div className=" w-full">
              <input
                type="number"
                className=" p-4 w-full border border-[#002147] rounded-lg outline-none"
              />
            </div>
            <div className=" w-full grid grid-cols-2 mt-4 gap-4">
              <button className=" rounded-xl bg-[#002147] p-4 text-white">20</button>
              <button className=" rounded-xl bg-[#002147] p-4 text-white">50</button>
              <button className=" rounded-xl bg-[#002147] p-4 text-white">100</button>
              <button className=" rounded-xl bg-[#002147] p-4 text-white">200</button>
              <button className=" rounded-xl bg-[#002147] p-4 text-white">500</button>
              <button className=" rounded-xl bg-[#002147] p-4 text-white">1000</button>

            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
