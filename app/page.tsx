'use client'
import { useState } from 'react'
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn } = useAuth()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  const generateEmail = async () => {
    if (!isSignedIn) return alert('Sign in first')
    if (!name.trim() || !company.trim()) return alert('Please fill in name and company')
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ name, company }),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      if (!res.ok) return alert(data.error || 'Failed to generate email')
      setEmail(data.body)
      setCount(c => c + 1)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{maxWidth:'600px', margin:'0 auto', padding:'20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
        <h1 style={{color:'#3730A3'}}>NicheMail AI</h1>
        {!isSignedIn ? <SignInButton mode="modal"><button style={{background:'#3730A3', color:'white', padding:'8px 16px', border:'none', borderRadius:'8px'}}>Sign In</button></SignInButton> : <UserButton />}
      </div>
      {isSignedIn && <p>⚡ {10 - count} free generations left</p>}
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', border:'1px solid #ccc', borderRadius:'8px'}} />
      <input placeholder="Company" value={company} onChange={e=>setCompany(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', border:'1px solid #ccc', borderRadius:'8px'}} />
      <button onClick={generateEmail} disabled={loading} style={{width:'100%', background:'#3730A3', color:'white', padding:'12px', border:'none', borderRadius:'8px'}}>{loading ? 'Writing...' : 'Generate Cold Email'}</button>
      {email && <div style={{marginTop:'20px', padding:'15px', background:'#f5f5f5', borderRadius:'8px'}}><p>{email}</p><button onClick={()=>navigator.clipboard.writeText(email)}>Copy</button></div>}
    </div>
  )
}
