import React, { useRef, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { FetchAPI } from "../util/FetchAPI";

enum Status {
  WaitingToSend,
  Sent,
  WaitingToVerify,
}

const Registration = () => {

  const [status, setStatus] = useState<Status>(null);
  const emailInput = useRef(null);
  const otpInput = useRef(null);
  const router = useRouter();
  const fetchAPI = new FetchAPI();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch(status) {
      case Status.Sent: {
        setStatus(Status.WaitingToVerify);
        const email: string = emailInput.current.value;
        const code: string = otpInput.current.value;
        fetchAPI.post<string>({
          endPoint: "auth/verify",
          body: {
            email,
            code
          }
        }).then(response => {
          if (response.code === 200) {
            setCookie("jwt", response.data);
            toast.success("Logged in.");
          }
          else {
            toast.error(response.message);
          }
        }).finally(() => {
          setStatus(Status.Sent);
        })
        break;
      }
      default: {
        setStatus(Status.WaitingToSend);
        const email: string = emailInput.current.value;
        fetchAPI.post<string>({
          endPoint: "auth",
          body: {
            email
          }
        }).then(response => {
          if (response.code === 200) {
            setStatus(Status.Sent);
            toast.success("Please check your inbox");
          }
        })
        break;
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="card bg-neutral w-96 mx-8">
        <div className="card-body w-full items-center">
          <h2 className="card-title">
            { (status === Status.Sent || status === Status.WaitingToVerify ) ? 'Enter OTP' : 'Enter Your Email'}
          </h2>
          <form className="mt-8 w-full" onSubmit={onSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="input input-primary w-full"
              ref={emailInput}
            />
            { (status === Status.Sent || status === Status.WaitingToVerify ) && (
              <input
                type="number"
                placeholder="OTP"
                className="input input-primary mt-4 w-full"
                ref={otpInput}
              ></input>
            ) }
            <button
              className={`btn ${
                (status === Status.WaitingToSend ||
                  status === Status.WaitingToVerify) &&
                'loading'
              } w-full btn-primary mt-8 text-white`}
            >
              {status === Status.WaitingToSend ||
              status === Status.WaitingToVerify
                ? 'Please Wait'
                : 'Submit'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Registration;
