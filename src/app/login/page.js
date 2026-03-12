"use client"

import "./login.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

async function handleLogin(e){

e.preventDefault()

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

if(error){
setError(error.message)
return
}

router.push("/dashboard")

}

return(

<div className="login-page">

<div className="login-card">

<h2 className="login-title">
Login to MoneyPilot
</h2>

<form onSubmit={handleLogin}>

<input
className="login-input"
type="email"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="login-input"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="login-btn" type="submit">
Login
</button>

</form>

<p className="login-error">{error}</p>

</div>

</div>

)

}