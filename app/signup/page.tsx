'use client'
import React, { FormEvent, useState } from 'react'
import { redirect } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { signIn } from 'next-auth/react'
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from "next/link";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const SignUpPage = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [register,setRegister] = useState(false);

  const handleClick = () => {
    const loading = toast.loading("Signing up")
      try {
        toast.dismiss(loading);
        signIn("google", { callbackUrl: "/" })
      } catch (error) {
        console.log(error);
        toast.dismiss(loading)
        toast.error("Failed to sign up, please try again!")
      }

  }

  const changeShowStatus = () => {
      setShowPass(!showPass);
  }
  const handleSubmit1 = async (e: FormEvent<HTMLFormElement>) => {
    const loading = toast.loading("Signing up")
    e.preventDefault()
    if (otp.length < 6 || error !== '') {
      setError("Wrong Inputs! make sure the input is exaclty six digits.")
      return
    }
    try{
      await axios.post("/api/auth/otp-verification",{email,otp})
      await signIn(
        "credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: true
    }
    )
    toast.dismiss(loading);
    toast.success("Signed up successfully")
    }catch(e){
      toast.dismiss(loading);
      toast.error("Failed to sign up, please try again!")
      console.log(e);
    }

    console.log(otp);
    return;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (email === '' || password === '' || confirmPassword === '' || username === '') {
          setError("Fill all fields!")
          return;
      }
      if (!email.includes("@") || email.length < 5 || !email.includes(".") || email.length > 100) {
          setError("Invalid email, must include @ and domain part!")
          return;
      }
      if (password !== confirmPassword) {
          setError("Confirmed Password doesn't match with password!")
          return;
      }
      console.log("name" + name)
      console.log("email" + email)
      console.log("password" + password)
      console.log('confirmPassword' + confirmPassword)

      try {
          const response = await axios.post("/api/auth/register", { username, email, password });
          console.log("signup success", response.data);
        if(response){
          setRegister(true);
        }else {
          toast.error("Signup Failed")
        }
      } catch (error) {
          console.log(error);
          setRegister(false);
      }finally{
        setRegister(true);
      }
      return;
  }

  const handleResend= async() => {
try {
  const response = await axios.post("/api/auth/resend-otp",{email});
  console.log(response.data);
  toast.success("Resend OTP successfully");
} catch (error) {
  console.log(error);
}
  }


  return (
    !register?
    <>
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className='custom-shadow bg-[#404040] w-[320px] md:w-[400px] mt-16 py-5 h-fit border rounded-lg flex flex-col items-center justify-around font-sans font-light'>
          <h1 className='text-2xl  tracking-wide'>SIGN UP</h1>
          <h3 className='text-sm mb-5'>to continue</h3>
          <form onSubmit={handleSubmit} className='w-[80%] flex flex-col items-center justify-center gap-4'>
              <CustomInput type='text' placeholder='Name' onChange={(e) => {
                  setError('');
                  setUsername(e.target.value)
              }} value={username} />
              <CustomInput type='email' placeholder='email' onChange={(e) => {
                  setError('');
                  setEmail(e.target.value)
              }} value={email} />
              <CustomInput isPassVisible={showPass} onClick={changeShowStatus} type={showPass ? "text" : 'password'} placeholder='Password' onChange={(e) => {
                  setError('');
                  setPassword(e.target.value)
              }} value={password} />
              <CustomInput type='password' placeholder='Confirm Password' onChange={(e) => {
                  setError('');
                  setConfirmPassword(e.target.value)
              }} value={confirmPassword} />
              {
                  error !== "" && <p className='w-full text-start text-sm text-red-500 my-[-12px]'>{error}</p>
              }
              <CustomButton  title={"SIGN UP"} type='submit' />
              <div className='w-full'>
                  <p className='w-full text-sm flex justify-center text-custom-neon items-center'>{"Already Have an account ? "}<span onClick={() => {
                      return redirect("/login")
                  }} className='text-custom-neon ml-1 cursor-pointer'>{"log in"}</span></p>
              </div>
          </form>
          <div className='w-[90%] h-[1px] bg-white mt-2'></div>
          <div className='flex flex-col justify-center items-center gap-2'>
              <div className='w-full text-center'>or</div>
              <div className='w-full flex justify-center items-center'>
                  <div className='cursor-pointer size-8 rounded-full flex justify-center items-center bg-white'>
                      <FcGoogle onClick={handleClick} className='size-6' />
                  </div>
              </div>
          </div>
      </div>
      </div>
      </>
      :

<>
<div className='h-screen w-screen flex justify-center items-center '>

<div className='custom-shadow  w-[320px] md:w-[420px] mt-16 py-7 h-fit border rounded-lg flex flex-col bg-custom-bg text-light-gray items-center justify-around font-sans font-light'>
  <h1 className='text-2xl tracking-wide text-custom-neon'>{"SIGN IN"}</h1>
  <h3 className='text-sm mb-5'>to continue</h3>
  <form onSubmit={handleSubmit1} className='w-[80%] flex flex-col items-center justify-center gap-7'>
    <div className="flex flex-col text-sm md:text-base text-center justify-center items-start w-full">
      <div>OTP for one time verification sent to</div>
      <div>{email} </div>
    </div>
    <InputOTP maxLength={6} onChange={(value) => {
      if (/^\d*$/.test(value)) {
        setOtp(value);
        setError(''); // Clear error if input is valid
      } else {
        setError("Only numeric digits are allowed.");
      }
    }}>
      <InputOTPGroup className="gap-[3px] md:gap-3" >
        <InputOTPSlot index={0} className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white" />
        <InputOTPSlot index={1} className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white" />
        <InputOTPSlot index={2} className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white" />
        <InputOTPSlot index={3} className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white" />
        <InputOTPSlot index={4} className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white" />
        <InputOTPSlot index={5} className="text-lg md:size-10 text-black bg-[#d9d9d9] outline-none border-[2px] border-white" />
      </InputOTPGroup>
    </InputOTP>
    <div className="flex justify-start items-start w-full text-sm md:text-base gap-1">
      <div>Didn't recieve OTP?  </div><button onClick={handleResend} className="font-aria text-custom-neon cursor-pointer">Send Again</button>
    </div>
    {
      error && <p className='w-full text-start text-sm text-red-500 my-[-12px]'>{error}</p>
    }
    <CustomButton title={"SIGN IN"} type='submit' />
    <div className='w-full'>
      <div className='flex'>
  
      <button onClick= {()=>{
setRegister(false);
      }} className='w-full text-sm text-custom-neon flex justify-center items-center cursor-pointer'>Change email address
      </button>
      </div>
    </div>
  </form>
</div>
</div>
</>



  )

}

export default SignUpPage