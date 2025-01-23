import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function HomePage() {
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState([]);
  const [nfcId, setNfcId] = useState("");
  const [nfcError, setNfcError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [nfcModal, setnfcModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [isStudentIdMode, setIsStudentIdMode] = useState(false);

  const nfcInputRef = useRef(null);

  const router = useRouter();

  const user = [
    {
      id: 1,
      fname: "Kenneth",
      lname: "manuel",
      mname: "C.",
      grade: "11",
      strand: "humss",
      section: "mactan",
      nfc_id: "12345",
      student_id: "S12345",
      current_balance: 500,
    },
    {
      id: 2,
      fname: "Paula Marie",
      lname: "Mendoza",
      mname: "B.",
      grade: "12",
      strand: "stem",
      section: "luna",
      nfc_id: "54321",
      student_id: "S54321",
      current_balance: 800,
    },
  ];

  const product = [
    { product: "Ulam w/ rice", price: 60 },
    { product: "Rice", price: 15 },
    { product: "Ulam", price: 50 },
    { product: "Water (small)", price: 15 },
    { product: "Water (big)", price: 25 },
    { product: "Softdrinks mismo", price: 25 },
    { product: "shabu", price: 150 },
  ];

  useEffect(() => {
    if (nfcModal && nfcInputRef.current) {
      nfcInputRef.current.focus();
    }
  }, [nfcModal]);

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleInputSubmit = () => {
    if (amount) {
      setEntries((prevEntries) => [
        ...prevEntries,
        { type: "Amount", value: Number(amount) },
      ]);
      setAmount("");
    }
  };

  const clearTotal = () => {
    setEntries([]);
  };

  const total = entries.reduce((acc, entry) => {
    if (entry.type === "Amount") {
      return acc + entry.value;
    } else if (entry.type === "Product") {
      return acc + entry.price;
    }
    return acc;
  }, 0);

  const handleAmountChange = (value) => {
    setEntries((prev) => [...prev, { type: "Amount", value }]);
  };

  const handleProductSelect = (product) => {
    setEntries((prevEntries) => [
      ...prevEntries,
      { type: "Product", product: product.product, price: product.price },
    ]);
  };

  const handleNfcIdChange = (e) => {
    const enteredId = e.target.value;
    setNfcId(enteredId);

    const foundUser = user.find(
      (user) =>
        (isStudentIdMode && user.student_id === enteredId) ||
        (!isStudentIdMode && user.nfc_id === enteredId)
    );

    if (enteredId && !foundUser) {
      setNfcError(isStudentIdMode ? "Invalid Student ID" : "Invalid NFC ID");
      setShowModal(false);
    } else if (foundUser) {
      setNfcError("");
      setUserInfo(foundUser);

      if (foundUser.current_balance < total) {
        setModalMessage("Insufficient Balance");
      } else {
        setModalMessage("");
      }

      setShowModal(true);
    } else {
      setUserInfo(null);
      setShowModal(false);
    }
  };

  const handleModeSwitch = () => {
    setIsStudentIdMode((prevMode) => {
      setNfcId("");
      return !prevMode;
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setNfcId("");
  };

  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <React.Fragment>
      <Head>
        <title>CMI Canteen</title>
      </Head>
      <main className="flex flex-row gap-x-4 w-screen h-screen bg-[#E4EFFF] p-4">
        <div className="w-[70%] bg-white rounded-xl h-full p-4">
          <div className=" h-[90%] w-full">
            <h2 className="text-2xl font-semibold text-[#002147]">
              Order List
            </h2>
            <ul className="mt-4 space-y-2">
              {entries.map((entry, index) => (
                <li key={index} className="text-lg text-[#002147]">
                  {entry.type === "Amount" ? (
                    <>Others: ₱ {entry.value}</>
                  ) : (
                    <>
                      {entry.product}: ₱ {entry.price}
                    </>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xl font-semibold text-[#002147]">
              <p>Total: ₱ {total}</p>
            </div>
          </div>
          {total > 0 && (
            <div className=" h-[10%] flex flex-row w-full gap-x-4">
              <button
                onClick={() => setnfcModal(true)}
                className=" bg-[#002147] w-[80%] p-3 text-white rounded-xl flex justify-center items-center"
              >
                Pay Now
              </button>
              <button
                onClick={clearTotal}
                className=" bg-[#f00] w-[20%] p-3 rounded-xl text-white flex justify-center items-center"
              >
                Clear Total
              </button>
            </div>
          )}

          {nfcModal && (
            <div className=" h-full w-full fixed bg-white bg-opacity-40 inset-0 flex justify-center items-center">
              <div className=" relative rounded-xl w-[80%] h-[80%] bg-[#002147] text-center flex flex-col justify-center items-center">
                <input
                  ref={nfcInputRef}
                  type="text"
                  value={nfcId}
                  onChange={handleNfcIdChange}
                  placeholder={
                    isStudentIdMode ? "Enter Student ID" : "Tap NFC ID"
                  }
                  className=" w-[80%] h-24 border rounded-xl p-3 outline-none text-center"
                />
                <button
                  className="w-[50%] text-white rounded-xl p-4"
                  onClick={handleModeSwitch}
                >
                  {isStudentIdMode
                    ? "Switch to NFC ID"
                    : "Switch to Student ID"}
                </button>
                {nfcError && <p className=" text-[#f00] mt-2">{nfcError}</p>}
                <button
                  onClick={() => setnfcModal(false)}
                  className=" text-white absolute top-4 right-6 text-4xl"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-[30%] h-full flex flex-col gap-y-4 bg-white rounded-xl p-4">
          <div className="w-full h-full bg-white rounded-xl">
            <h1 className="text-lg mb-4">Enter Amount: </h1>
            <div className="w-full">
              <input
                type="number"
                value={amount}
                onChange={handleInputChange}
                className="p-3 w-full border border-[#002147] rounded-lg outline-none"
                placeholder="Enter a custom amount"
              />
            </div>
            <button
              onClick={handleInputSubmit}
              className="w-full mt-4 bg-[#002147] p-3 rounded-xl text-white"
            >
              Add Amount
            </button>
            <div className="grid grid-cols-2 mt-4 gap-2">
              {[20, 50, 100, 200, 500, 1000].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAmountChange(value)}
                  className="rounded-xl bg-[#002147] p-3 text-white"
                >
                  ₱{value}
                </button>
              ))}
            </div>

            <button
              onClick={() => setProductModal(true)}
              className="bg-[#002147] w-full p-4 text-white rounded-xl mt-4"
            >
              Products
            </button>

            <button
              type="button"
              onClick={() => router.push("./login")}
              className=" bg-red-400 w-full p-4 text-white rounded-xl mt-4"
            >
              Logout
            </button>

            {productModal && (
              <div className=" w-screen h-screen fixed inset-0 flex flex-col items-center justify-center bg-[#000] bg-opacity-50">
                <div className=" bg-white p-6 rounded-xl w-[80%] h-[80%]">
                  <div className=" overflow-y-scroll h-[90%] py-2">
                    <div className=" grid grid-cols-3 gap-4">
                      {product.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleProductSelect(item)}
                          className=" flex flex-col justify-center items-center bg-[#002147] h-20 text-center rounded-xl text-white"
                        >
                          {item.product}
                          <span className=" text-sm">₱ {item.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className=" h-[10%] w-full flex justify-end">
                    <button
                      onClick={() => setProductModal(false)}
                      className=" bg-[#002147] rounded-xl text-white h-full w-[20%]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className=" w-screen h-screen fixed inset-0 flex items-center justify-center bg-[#000] bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-[80%] h-[80%]">
            {modalMessage ? (
              <div className=" w-full h-full">
                <div className="w-full flex justify-end">
                  <button onClick={closeModal} className=" text-3xl">
                    X
                  </button>
                </div>
                <div className="w-full h-[80%] flex flex-col justify-center items-center">
                  <p className="mt-4 text-3xl text-[#f00]">{modalMessage}</p>
                  <p className=" text-gray-400">
                    You're Current Balance is:{" "}
                    <span className=" font-bold">
                      ₱ {userInfo.current_balance}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className=" w-full h-full">
                <div className=" w-full h-[80%] flex flex-col justify-center items-center text-[#002147]">
                  <p className=" text-3xl font-semibold capitalize ">
                    {userInfo.lname}, {userInfo.fname} {userInfo.mname}
                  </p>
                  <p className=" text-2xl capitalize font-semibold">
                    {userInfo.strand} {userInfo.grade} - {userInfo.section}
                  </p>
                  <p className=" text-lg opacity-50">
                    Your Current Balance is:{" "}
                    <span className=" font-bold text-2xl">
                      ₱ {userInfo.current_balance}
                    </span>
                  </p>

                  <p className=" mt-6 text-3xl font-extrabold">
                    Amount to pay: ₱{total}
                  </p>
                </div>
                <div className=" w-full h-[20%] flex flex-col items-center gap-y-2">
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className=" w-[60%] h-[50%] bg-[#002147] flex justify-center items-center py-8 rounded-xl text-white"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={closeModal}
                    className=" w-[60%] h-[50%] flex justify-center items-center p-4 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
