import React, { useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { postSignIn, postVerify } from "../util/api";

enum Status {
  Initial,
  WaitingToSend,
  Sent,
  WaitingToVerify,
}

const Registration = () => {
  const [status, setStatus] = useState<Status>(Status.Initial);
  const emailInput = useRef(null);
  const nameInput = useRef(null);
  const usernameInput = useRef(null);
  const otpInput = useRef(null);
  const router = useRouter();

  const backButtonOnClick = () => {
    setStatus(Status.Initial);
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch(status) {
      case Status.Sent: {
        setStatus(Status.WaitingToVerify);
        const email: string = emailInput.current.value;
        const code: number = parseInt(otpInput.current.value);
        postVerify({
          email,
          code
        }).then(({ data: response }) => {
          setCookie("token", response.data, {
            maxAge: 31536000
          });
          router.push("/");
        }).catch(err => {
          console.log(err.response.data);
          toast.error("Please try again");
        }).finally(() => {
          setStatus(Status.Sent);
        })
        break;
      }
      default: {
        setStatus(Status.WaitingToSend);
        const email: string = emailInput.current.value;
        const name: string = nameInput.current.value;
        const username: string = usernameInput.current.value;
        postSignIn({
          email,
          name,
          username
        })
          .then(() => {
            setStatus(Status.Sent);
            toast.success("Please check your inbox");
          })
          .catch(err => {
            setStatus(Status.Initial);
            toast.error("An error occurred")
          })
        break;
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="card bg-neutral w-96 mx-8">
        <div className="card-body w-full items-center">
          { status === Status.Sent && <div className="btn btn-ghost btn-square absolute left-8 top-6" onClick={backButtonOnClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div> }
          <h2 className="card-title">
            { (status === Status.Sent || status === Status.WaitingToVerify ) ? 'Enter OTP' : 'Enter Your Information'}
          </h2>
          <form className="mt-8 w-full" onSubmit={onSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="input input-primary w-full"
              ref={emailInput}
              disabled={!(status === Status.Initial)}
            />
            { (status === Status.Initial || status === Status.WaitingToSend) && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-primary mt-4 w-full"
                  ref={nameInput}
                  disabled={!(status === Status.Initial)}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-primary mt-4 w-full"
                  ref={usernameInput}
                  disabled={!(status === Status.Initial)}
                />
              </>
            )}
            { (status === Status.Sent || status === Status.WaitingToVerify ) && (
              <input
                type="number"
                placeholder="OTP"
                className="input input-primary mt-4 w-full"
                ref={otpInput}
                disabled={!(status === Status.Sent)}
              />
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
