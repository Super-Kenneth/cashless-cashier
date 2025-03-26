import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function HomePage() {
  const [state, setState] = useState({
    orders: [],
    nfcId: "",
    reference_no: "",
    userDetails: null,
    errorMessage: "",
    modalOpen: false,
    productModalOpen: false,
    accModalOpen: false,
    paymentSuccess: false,
    countdown: 3,
  });

  const nfcInputRef = useRef(null);
  const debounceTimeout = useRef(null);
  const router = useRouter();

  const token = Cookies.get("authToken");
  const full_name = Cookies.get("fullName");
  console.log(full_name);

  // const subs = jwtDecode(token);
  // console.log("token", subs);

  const handleNfcIdChange = async (e) => {
    const enteredId = e.target.value;

    setState((prev) => ({ ...prev, nfcId: enteredId, errorMessage: "" }));

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      // console.log(typeof enteredId);

      try {
        const res = await axios.get(
          `http://localhost:5500/users/cards/${enteredId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
    }, 500);
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

  const handleConfirmPayment = async () => {
    console.log(state.nfcId);
    console.log(totalAmount);
    const token = Cookies.get("authToken");
    const full_name = Cookies.get("fullName");
    const sub = jwtDecode(token);

    try {
      const response = await axios.post(
        "http://localhost:5500/cashier",
        // const response = await axios.post(
        //   "https://attendance-backend-app.up.railway.app/cashier",
        {
          amount: totalAmount,
          sender_id: state.nfcId,
          receiver_id: sub.nfc_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.cashier);

      try {
        await axios.post("http://localhost:7890/receipts", {
          // await axios.post(
          //   "https://attendance-backend-app.up.railway.app/receipts",
          //   {
          amount: totalAmount,
          store_name: "CMI Canteen",
          ref_no: response.data.cashier.reference_no,
          full_name: full_name
        });
      } catch (error) {
        console.log(error);
        console.log("ERROR: Receipt printer not found.");
      }

      setState((prevState) => ({
        ...prevState,
        reference_no: response.data.cashier.reference_no,
        paymentSuccess: true,
      }));
    } catch (error) {
      console.log(error);
    }

    console.log("SUCCESS PAYMENT WHEN PRESS");

    const timer = setInterval(() => {
      setState((prevState) => {
        const countdown = prevState.countdown;
        if (countdown <= 1) {
          clearInterval(timer);
          // window.location.reload();
        }

        return {
          ...prevState,
          countdown: countdown - 1,
          userDetails: null,
          nfcId: "",
          modalOpen: false,
          paymentSuccess: false,
          orders: [],
        };
      });
    }, 3000);
  };

  const testPrint = async () => {
    try {
      await axios.post("http://localhost:7890/receipts/test", {
        amount: 10000,
        store_name: "CMI Canteen",
        full_name: full_name,
      });
    } catch (error) {
      console.log(error);
      console.log("ERROR: Receipt printer not found.");
    }
  };

  const product = [
    { product: "Ulam w/ rice", price: 60 },
    { product: "Rice", price: 15 },
    { product: "Ulam", price: 50 },
    { product: "Water (small)", price: 15 },
    { product: "Water (big)", price: 25 },
    { product: "Softdrinks mismo", price: 25 },
    { product: "Shabu", price: 150 },
  ];

  const handleProductSelect = (item) => {
    setState((prevState) => ({
      ...prevState,
      orders: [
        ...prevState.orders,
        { product: item.product, amount: item.price },
      ],
    }));
  };

  useEffect(() => {
    if (state.modalOpen && nfcInputRef.current) {
      nfcInputRef.current.focus();
    }
  }, [state.modalOpen]);

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("fullName");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>CMI Canteen</title>
      </Head>
      <main className="flex gap-x-4 w-screen h-screen bg-[#E4EFFF] p-4">
        {/* Order List */}
        <div className="w-[70%] h-full bg-white rounded-xl p-4">
          <div className="w-full h-[90%]">
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
            <div className="w-full h-[10%] flex flex-row gap-x-4 ">
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, modalOpen: true }))
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
          {state.modalOpen && (
            <div className="h-full w-full fixed bg-white bg-opacity-50 inset-0 flex justify-center items-center">
              <div className="relative rounded-xl w-[80%] h-[80%] bg-[#002147] text-center flex flex-col justify-center items-center">
                <Image
                  priority={true}
                  src="/images/close.svg"
                  alt=""
                  width={0}
                  height={0}
                  className="h-[4vw] w-auto absolute top-4 right-4 cursor-pointer"
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      modalOpen: false,
                      nfcId: "",
                      userDetails: null,
                    }));
                    setState((prevState) => ({
                      ...prevState,
                      paymentSuccess: false,
                    }));
                    // window.location.reload();
                  }}
                />

                {!state.userDetails && !state.paymentSuccess && (
                  <input
                    ref={nfcInputRef}
                    type="password"
                    placeholder="Tap NFC ID"
                    value={state.nfcId}
                    onChange={handleNfcIdChange}
                    className=" h-[10vw] w-[80%] rounded-xl text-center text-[#002147] text-[2.5vw] outline-none"
                  />
                )}
                {state.errorMessage && !state.paymentSuccess && (
                  <p className="text-red-500 mt-4">{state.errorMessage}</p>
                )}
                {state.userDetails &&
                  !state.paymentSuccess &&
                  state.userDetails.total_amount < totalAmount && (
                    <p className="text-red-500 mt-4 font-bold text-[3vw]">
                      Insufficient Balance
                    </p>
                  )}

                {/* info ng user */}
                {state.userDetails &&
                  !state.paymentSuccess &&
                  state.userDetails.total_amount >= totalAmount && (
                    <div className="mt-4 text-[#000] text-left bg-white p-4 rounded-xl">
                      <p className="text-[2vw]">
                        User ID: {state.userDetails.user_id}
                      </p>
                      <p className="text-[2vw]">
                        Username: {state.userDetails.username}
                      </p>
                      <p className="text-[2vw]">
                        Full Name: {state.userDetails.full_name}
                      </p>
                      <p className="font-bold text-[2vw]">
                        Balance: ₱{state.userDetails.total_amount}
                      </p>
                      <div className="w-full border-b-2 border-[#002147] border-dashed my-2" />
                      <p className="font-bold text-[2vw]">
                        Amount to Pay: ₱{totalAmount}
                      </p>
                      <div className="w-full flex justify-center items-center mt-4">
                        <button
                          onClick={handleConfirmPayment}
                          className=" bg-[#002147] text-white text-[2vw] rounded-xl p-4 w-full"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                {/* Payment Success */}
                {state.paymentSuccess && (
                  <div className="bg-white p-4 rounded-xl text-center flex flex-col items-center justify-center">
                    <Image
                      src="/images/success.svg"
                      alt=""
                      width={0}
                      height={0}
                      className=" h-[5vw] w-auto"
                    />
                    <p className="text-[1.5vw] text-[#002147]">
                      Payment Success
                    </p>
                    <div className=" border-b-2 mt-2 border-[#002147] border-dashed w-full" />
                    <div className="text-left text-[1.2vw] text-gray-500 mt-2">
                      <p>Receipt No: {state.reference_no}</p>
                      <p>Date & Time: {date}</p>
                      <p>Name: {state.userDetails.full_name}</p>
                      <p className=" mt-2">Total Amount: ₱{totalAmount}</p>
                    </div>

                    <button
                      onClick={() => {
                        setState((prevState) => ({
                          ...prevState,
                          modalOpen: false,
                          nfcId: "",
                          userDetails: null,
                        }));
                        setState((prevState) => ({
                          ...prevState,
                          paymentSuccess: false,
                        }));
                        window.location.reload();
                      }}
                      className="mt-4 w-full p-4 bg-[#002147] text-white rounded-full flex flex-row items-center justify-center"
                    >
                      OK
                      <span className="text-[1.5vw] ml-2">
                        ({state.countdown}s)
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* div ng Amount and Product */}
        <div className="w-[30%] h-full bg-white rounded-xl">
          <div className=" relative w-full flex justify-end p-1">
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, accModalOpen: true }))
              }
            >
              <Image
                src="/images/account.svg"
                alt=""
                width={0}
                height={0}
                className=" w-auto h-[4vw]"
              />
            </button>
            {state.accModalOpen && (
              <div className="bg-[#002147] absolute top-0 right-0 rounded-xl">
                <div className=" w-full flex justify-end px-1 pt-1">
                  <Image
                    priority={true}
                    src="/images/close.svg"
                    alt=""
                    width={0}
                    height={0}
                    className=" w-auto h-[2vw] cursor-pointer"
                    onClick={() =>
                      setState((prev) => ({ ...prev, accModalOpen: false }))
                    }
                  />
                </div>
                <div className=" px-2 pb-2">
                  <p className=" text-white text-[1.5vw]">Joedel's Canteen</p>
                  <button
                    onClick={handleLogout}
                    className=" text-white w-full rounded p-1 flex flex-row gap-2 items-center text-[1.5vw] hover:bg-gray-500"
                  >
                    Log out
                    <Image
                      priority={true}
                      src="/images/logout.svg"
                      alt=""
                      width={0}
                      height={0}
                      className=" w-auto h-[1.5vw]"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleAddAmount} className=" mb-4 px-4">
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

          <div className="grid grid-cols-2 gap-2 px-4">
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
          <div className=" px-4">
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, productModalOpen: true }))
              }
              className="w-full p-3 bg-[#002147] text-white rounded-xl mt-4 text-[1.5vw]"
            >
              Products
            </button>
          </div>
          <div className=" px-4">
            <button
              onClick={testPrint}
              className="w-full p-3 bg-[#002147] text-white rounded-xl mt-4 text-[1.5vw]"
            >
              Test Print
            </button>
          </div>
        </div>

        {/* Product Modal */}
        {state.productModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000] bg-opacity-50">
            <div className="bg-white p-6 rounded-xl w-[80%] h-[80%]">
              <div className="overflow-y-scroll h-[90%] py-2">
                <div className="grid grid-cols-3 gap-4">
                  {product.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleProductSelect(item)}
                      className="flex flex-col justify-center items-center bg-[#002147] h-20 text-center rounded-xl text-white"
                    >
                      {item.product}
                      <span className="text-sm">₱ {item.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[10%] w-full flex justify-end">
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, productModalOpen: false }))
                  }
                  className="bg-[#002147] rounded-xl text-white w-[20%]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
