'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      console.log(res.error)
    } else {
      router.push("/")
    }
  }
  return (
    <div className='flex flex-col gap-4 items-center justify-center min-h-screen'>
      <h1 className='text-2xl text-center'>Login</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-2xl w-full px-10'>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='outline-none border border-gray-600 rounded-md px-4 py-2' />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='outline-none border border-gray-600 rounded-md px-4 py-2' />
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-all duration-300 w-32 self-center'>Login</button>
      </form>

      <div className='flex justify-center'>
        <p className='text-sm flex gap-1'>Don't have an account? <p className='text-blue-500 cursor-pointer hover:underline' onClick={() => router.push("/register")}>Register</p></p>
      </div>
    </div>
  )
}

export default page
