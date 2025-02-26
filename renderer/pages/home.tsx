import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";

export default function HomePage() {
  const [state, setState] = useState({
    orders: [],
    modal: false,
    nfcId: "",
    userDetails: null,
    errorMessage: "",
  });

  const nfcInputRef = useRef(null);

  const handleNfcIdChange = async (e) => {
    const enteredId = e.target.value;
    setState((prev) => ({ ...prev, nfcId: enteredId, errorMessage: "" }));

    try {
      const res = await axios.get(
        `https://attendance-backend-app.up.railway.app/users/cards/${enteredId}`
      );
      if (res.data && res.data.data) {
        setState((prev) => ({ ...prev, userDetails: res.data.data }));
      } else {
        setState((prev) => ({
          ...prev,
          errorMessage: "Invalid ID",
          userDetails: null,
        }));
      }
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        errorMessage: "Invalid ID",
        userDetails: null,
      }));
    }
  };

  const handleAmountClick = (value) => {
    setState((prevState) => ({
      ...prevState,
      orders: [...prevState.orders, { product: "Others", amount: value }],
    }));
  };

  const handleAddAmount = (e) => {
    e.preventDefault();
    const inputAmount = e.target.amount.value;
    if (inputAmount) {
      setState((prevState) => ({
        ...prevState,
        orders: [
          ...prevState.orders,
          { product: "Others", amount: inputAmount },
        ],
      }));
      e.target.amount.value = "";
    }
  };

  const handleClear = () => {
    setState((prevState) => ({
      ...prevState,
      orders: [],
    }));
  };

  const totalAmount = state.orders.reduce(
    (acc, order) => acc + parseFloat(order.amount),
    0
  );

  useEffect(() => {
    if (state.modal && nfcInputRef.current) {
      nfcInputRef.current.focus();
    }
  }, [state.modal]);

  return (
    <>
      <Head>
        <title>CMI Canteen</title>
      </Head>
      <main className="flex gap-x-4 w-screen h-screen bg-[#E4EFFF] p-4">
        {/* div ng Order List */}
        <div className="w-[70%] h-full bg-white rounded-xl p-4">
          <div className=" w-full h-[90%]">
            <h1 className="font-bold text-[2vw] text-[#002147]">Order List:</h1>
            <ul className="mt-2">
              {state.orders.map((order, index) => (
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
                onClick={() =>
                  setState((prevState) => ({ ...prevState, modal: true }))
                }
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

          {/* NFC Modal */}
          {state.modal && (
            <div className=" h-full w-full fixed bg-white bg-opacity-50 inset-0 flex justify-center items-center">
              <div className=" relative rounded-xl w-[80%] h-[80%] bg-[#002147] text-center flex flex-col justify-center items-center">
                <Image
                  priority={true}
                  src="/images/close.svg"
                  alt=""
                  width={0}
                  height={0}
                  className=" h-[4vw] w-auto absolute top-4 right-4 cursor-pointer"
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      modal: false,
                      nfcId: "",
                      userDetails: null,
                    }));
                  }}
                />

                {!state.userDetails && (
                  <input
                    ref={nfcInputRef}
                    type="text"
                    placeholder="Tap NFC ID"
                    value={state.nfcId}
                    onChange={handleNfcIdChange}
                    className=" h-[10vw] w-[80%] rounded-xl text-center text-[#002147] text-[2.5vw] outline-none"
                  />
                )}
                {state.errorMessage && (
                  <p className="text-red-500 mt-4">{state.errorMessage}</p>
                )}
                {state.userDetails &&
                  state.userDetails.total_amount < totalAmount && (
                    <p className="text-red-500 mt-4 font-bold text-[3vw]">
                      Insufficient Balance
                    </p>
                  )}
                {state.userDetails &&
                  state.userDetails.total_amount >= totalAmount && (
                    <div className="mt-4 text-[#000] text-left bg-white p-4 rounded-xl">
                      <p className=" text-[2vw]">
                        User ID: {state.userDetails.user_id}
                      </p>
                      <p className=" text-[2vw]">
                        Username: {state.userDetails.username}
                      </p>
                      <p className=" text-[2vw]">
                        Full Name: {state.userDetails.full_name}
                      </p>
                      <p className=" font-bold text-[2vw]">
                        Balance: ₱{state.userDetails.total_amount}
                      </p>
                      <div className=" w-full border-b-2 border-[#002147] border-dashed my-2" />
                      <p className=" font-bold text-[2vw]">
                        Amount to Pay: ₱{totalAmount}
                      </p>
                      <div className=" w-full flex justify-center items-center mt-4">
                        <button className=" bg-[#002147] text-white text-[2vw] rounded-xl p-4 w-full">
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* div para sa Amount and Products */}
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
