'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      navigate.push("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col gap-4 items-center justify-center min-h-screen'>
      <h1 className='text-2xl text-center'>Register here to get started</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-2xl w-full px-10'>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='outline-none border border-gray-600 rounded-md px-4 py-2'/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='outline-none border border-gray-600 rounded-md px-4 py-2'/>
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='outline-none border border-gray-600 rounded-md px-4 py-2'/>
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-all duration-300 w-32 self-center'>Register</button>
      </form>

      <div className='flex justify-center'>
        <p className='text-sm flex gap-1'>Already have an account? <p className='text-blue-500 cursor-pointer hover:underline' onClick={() => navigate.push("/login")}>Login</p></p>
      </div>
    </div>
  )
}

export default page
