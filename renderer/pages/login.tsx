import React from "react";
import { useRouter } from "next/router"; // Changed import to next/router
import Image from "next/image";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios"; // Import axios
import Head from "next/head";
import Cookies from "js-cookie"; // Import js-cookie

const validationSchema = Yup.object({
  canteenId: Yup.mixed().required("Canteen ID is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {

      const response = await axios.post(
        "https://attendance-backend-app.up.railway.app/login/cashier_log",
        {
          username: values.canteenId,
          password: values.password,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        console.log("Authentication successful, setting cookie...");

        // Save token or any relevant data to cookies
        Cookies.set("authToken", response.data.token, { expires: 1 }); // 1 day expiration

        // If login is successful, redirect to the home page
        console.log("Redirecting to home...");
        router.push("/home"); // Or try window.location.href = "/home";
      } else {
        // Handle login failure (e.g., show an error message)
        console.log("Login failed:", response.data.message);

        // Assuming the API sends a message when the password is incorrect
        if (
          response.data.message &&
          response.data.message.toLowerCase().includes("password")
        ) {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Login failed: " + response.data.message);
        }
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Invalid Account. Please try again.");
    }
  };

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

          <Formik
            initialValues={{ canteenId: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="w-full flex flex-col items-center gap-y-4">
                <div className="w-[50%]">
                  <Field
                    type="text"
                    name="canteenId"
                    placeholder="Canteen ID"
                    className={`outline-none rounded-xl p-2 w-full ${
                      errors.canteenId && touched.canteenId
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.canteenId && touched.canteenId && (
                    <div className="text-red-500 text-sm">
                      {String(errors.canteenId)}
                    </div>
                  )}
                </div>

                <div className="w-[50%]">
                  <Field
                    type="password" // Change the type to password
                    name="password" // Make sure the name is "password" here
                    placeholder="Password"
                    autoComplete="off" // Disable autofill
                    className={`outline-none rounded-xl p-2 w-full ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm">
                      {String(errors.password)}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#002147] text-white rounded-xl p-2 w-[20%] mt-4"
                >
                  Log in
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
