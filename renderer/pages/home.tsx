import React, { useState } from "react";
import Head from "next/head";

export default function HomePage() {
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);

  const handleAmountClick = (value) => {
    setOrders((prevOrders) => [
      ...prevOrders,
      { product: "Others", amount: value },
    ]);
  };

  const handleAddAmount = (e) => {
    e.preventDefault();
    const inputAmount = e.target.amount.value;
    if (inputAmount) {
      setOrders((prevOrders) => [
        ...prevOrders,
        { product: "Others", amount: inputAmount },
      ]);
      e.target.amount.value = "";
    }
  };

  const handleClear = () => {
    setOrders([]);
  };

  const totalAmount = orders.reduce(
    (acc, order) => acc + parseFloat(order.amount),
    0
  );

  return (
    <>
      <Head>
        <title>CMI Canteen</title>
      </Head>
      <main className="flex gap-x-4 w-screen h-screen bg-[#E4EFFF] p-4">
        {/* dito yung div ng order list */}
        <div className="w-[70%] h-full bg-white rounded-xl p-4">
          <div className=" w-full h-[90%]">
            <h1 className="font-bold text-[2vw] text-[#002147]">Order List:</h1>
            <ul className="mt-2">
              {orders.map((order, index) => (
                <li key={index} className="text-[#002147] text-[1.5vw]">
                  {order.product}: ₱{order.amount}
                </li>
              ))}
            </ul>

            <div className="mt-2 font-bold text-[#002147] text-[1.5vw]">
              Total Orders: ₱{totalAmount}
            </div>
          </div>

          {totalAmount > 0 && (
            <div className=" w-full h-[10%] flex flex-row gap-x-4 ">
              <button
                onClick={() => setModal(true)}
                className=" bg-[#002147] w-[80%] text-white text-center flex justify-center items-center text-[1.5vw] rounded-xl p-4"
              >
                Pay Now
              </button>
              <button
                className=" bg-red-500 w-[20%] text-[1.5vw] rounded-xl text-white text-center flex justify-center items-center"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          )}

          {modal && (
            <div className=" h-full w-full fixed bg-white bg-opacity-50 inset-0 flex justify-center items-center">
              <div className=" relative rounded-xl w-[80%] h-[80%] bg-[#002147] text-center flex flex-col justify-center items-center">
                
              </div>
            </div>
          )}
        </div>

        {/* div ng amount and products */}
        <div className="w-[30%] h-full bg-white rounded-xl p-4">
          <form onSubmit={handleAddAmount}>
            <input
              type="number"
              name="amount"
              placeholder="Enter Amount"
              className="border border-[#002147] w-full h-8 md:h-12 rounded-xl p-4 text-[1.5vw] text-center text-[#002147] outline-none"
            />
            <button
              type="submit"
              className="w-full p-3 bg-[#002147] text-white rounded-xl mt-4 text-[1.5vw]"
            >
              Add Amount
            </button>
          </form>

          <div className="grid grid-cols-2 mt-4 gap-2">
            {[20, 50, 100, 200, 500, 1000].map((value) => (
              <button
                key={value}
                className="rounded-xl bg-[#002147] text-[2vw] p-2 text-white"
                onClick={() => handleAmountClick(value)}
              >
                ₱{value}
              </button>
            ))}
          </div>

          <button className="w-full p-3 bg-[#002147] text-white rounded-xl mt-4 text-[1.5vw]">
            Products
          </button>
        </div>
      </main>
    </>
  );
}
