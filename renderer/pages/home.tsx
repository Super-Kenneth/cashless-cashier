import React, { useState } from "react";
import Head from "next/head";
import moment from "moment";

export default function HomePage() {
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);
  const date = moment().utcOffset("+08:00").format("ddd, MMMM DD YYYY");
  const time = moment().format("LT");

  const handleButtonClick = (value) => {
    setEntries((prevEntries) => [...prevEntries, value]);
  };

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleInputSubmit = () => {
    if (amount) {
      setEntries((prevEntries) => [...prevEntries, Number(amount)]);
      setAmount("");
    }
  };

  const total = entries.reduce((acc, curr) => acc + curr, 0);

  return (
    <React.Fragment>
      <Head>
        <title>CMI Canteen</title>
      </Head>
      <main className="flex flex-row gap-x-4 w-screen h-screen bg-[#E4EFFF] p-4">
        <div className="w-[70%] bg-white rounded-xl h-full p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-[#002147]">
              Amount List
            </h2>
            <ul className="mt-4 space-y-2">
              {entries.map((entry, index) => (
                <li key={index} className="text-lg text-[#002147]">
                  {entry}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xl font-semibold text-[#002147]">
              <p>Total: ₱ {total}</p>
            </div>
          </div>
        </div>

        <div className="w-[30%] h-full flex flex-col gap-y-4">
          <div className="w-full h-[30%] bg-white rounded-xl text-center flex flex-col gap-y-2 justify-center items-center">
            <p className="font-semibold text-3xl text-[#002147]">{date}</p>
            <p className="font-semibold text-2xl text-[#002147]">{time}</p>
          </div>

          <div className="w-full h-[70%] bg-white rounded-xl p-4 pt-10">
            <h1 className="text-lg mb-4">Enter Amount: </h1>
            <div className="w-full">
                <input
                  type="number"
                  value={amount}
                  onChange={handleInputChange}
                  className="p-4 w-full border border-[#002147] rounded-lg outline-none"
                  placeholder="Enter a custom amount"
                />
            </div>

            <div className="w-full grid grid-cols-2 mt-4 gap-4">
              <button
                onClick={() => handleButtonClick(20)}
                className="rounded-xl bg-[#002147] p-4 text-white"
              >
                20
              </button>
              <button
                onClick={() => handleButtonClick(50)}
                className="rounded-xl bg-[#002147] p-4 text-white"
              >
                50
              </button>
              <button
                onClick={() => handleButtonClick(100)}
                className="rounded-xl bg-[#002147] p-4 text-white"
              >
                100
              </button>
              <button
                onClick={() => handleButtonClick(200)}
                className="rounded-xl bg-[#002147] p-4 text-white"
              >
                200
              </button>
              <button
                onClick={() => handleButtonClick(500)}
                className="rounded-xl bg-[#002147] p-4 text-white"
              >
                500
              </button>
              <button
                onClick={() => handleButtonClick(1000)}
                className="rounded-xl bg-[#002147] p-4 text-white"
              >
                1000
              </button>
            </div>
            <button
              onClick={handleInputSubmit}
              className="w-full mt-4 bg-[#002147] p-4 rounded-xl text-white"
            >
              Add Amount
            </button>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
