"use client"

import "./landing.css"
import { useRouter } from "next/navigation"

export default function Home(){

const router = useRouter()

function goLogin(){
router.push("/login")
}

return(

<div>

{/* NAVBAR */}
<nav className="navbar">
<div className="nav-container">

<a className="logo">
MoneyPilot
</a>

<ul className="nav-links">
<li><a href="#home">Home</a></li>
<li><a href="#features">Features</a></li>
<li><a href="#about">About</a></li>
<li><a href="#contact">Contact</a></li>
</ul>

<button className="btn btn-primary" onClick={goLogin}>
Log In
</button>

</div>
</nav>


{/* HERO */}
<header className="hero" id="home">

<div className="hero-image-col">
<img
src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
alt="finance dashboard"
/>
</div>

<div className="hero-text-col">

<span className="badge">
Smart Personal Finance Tool
</span>

<h1 className="hero-title">
Take Control of Your Money
</h1>

<p className="hero-desc">
MoneyPilot helps you track expenses,
manage budgets, and plan savings goals.
</p>

<div className="hero-buttons">

<button
className="btn btn-primary"
onClick={goLogin}
>
Log in
</button>

<a href="#features" className="btn btn-outline">
Get Started
</a>

</div>

</div>

</header>


{/* ABOUT */}
<section className="about-section" id="about">

<div className="section-container">

<h2 className="section-title">
Why MoneyPilot?
</h2>

<p className="section-desc">
MoneyPilot helps students and young professionals
break down financial goals into manageable savings plans.
</p>

</div>

</section>


{/* FEATURES */}
<section className="features-section" id="features">

<div style={{textAlign:"center"}}>

<span className="badge">
Features
</span>

<h2 className="section-title">
Everything you need
</h2>

</div>


<div className="features-grid">

<div className="feature-card">
<h3 className="feature-title">
Expense Tracking
</h3>
<p className="feature-text">
Log expenses and see where your money goes.
</p>
</div>

<div className="feature-card">
<h3 className="feature-title">
Budget Management
</h3>
<p className="feature-text">
Set budgets and avoid overspending.
</p>
</div>

<div className="feature-card">
<h3 className="feature-title">
Savings Goals
</h3>
<p className="feature-text">
Set targets like buying gadgets or emergency funds.
</p>
</div>

<div className="feature-card">
<h3 className="feature-title">
Financial Charts
</h3>
<p className="feature-text">
Visualize balance trends over time.
</p>
</div>

<div className="feature-card">
<h3 className="feature-title">
AI Insights
</h3>
<p className="feature-text">
Get AI suggestions to improve spending.
</p>
</div>

<div className="feature-card">
<h3 className="feature-title">
Secure Data
</h3>
<p className="feature-text">
Your financial information stays private.
</p>
</div>

</div>

</section>


{/* CONTACT SECTION */}
<section className="contact-section" id="contact">

<div className="section-container">

<h2 className="section-title">
Contact Us
</h2>

<p className="section-desc">
Have questions about MoneyPilot?  
Send us a message and we will respond soon.
</p>

<form style={{marginTop:"30px"}}>

<input
placeholder="Your Email"
style={{
padding:"12px",
width:"300px",
marginRight:"10px"
}}
/>

<input
placeholder="Message"
style={{
padding:"12px",
width:"300px"
}}
/>

<br/><br/>

<button
className="btn btn-primary"
type="button"
onClick={()=>alert("Message sent!")}
>
Send Message
</button>

</form>

</div>

</section>


{/* FOOTER */}
<footer className="footer">

<div className="footer-content">

<div className="footer-brand">
<h3>MoneyPilot</h3>
<p className="footer-tagline">
Plan smarter. Spend better.
</p>
</div>

</div>

<div className="copyright">
© 2026 MoneyPilot
</div>

</footer>

</div>

)

}