'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0f',padding:'20px'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{fontSize:'48px',fontWeight:'900',color:'#f0c14b',fontFamily:'sans-serif'}}>CUPSS</div>
          <div style={{fontSize:'12px',color:'#5a5a72',letterSpacing:'3px',marginTop:'4px'}}>PLATAFORMA HOSTELERÍA</div>
        </div>
        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'32px'}}>
          <h1 style={{fontSize:'18px',fontWeight:'700',marginBottom:'24px',color:'#f0f0f5'}}>Acceder</h1>
          {error && <div style={{background:'rgba(255,77,109,0.1)',border:'1px solid rgba(255,77,109,0.3)',borderRadius:'8px',padding:'10px 14px',marginBottom:'16px',fontSize:'13px',color:'#ff4d6d'}}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'11px',color:'#9090a8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="tu@restaurante.com"
                style={{width:'100%',background:'#18181f',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'8px',padding:'10px 14px',color:'#f0f0f5',fontSize:'13px',outline:'none',boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:'24px'}}>
              <label style={{display:'block',fontSize:'11px',color:'#9090a8',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Contraseña</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"
                style={{width:'100%',background:'#18181f',border:'1px solid rgba(255,255,255,0.11)',borderRadius:'8px',padding:'10px 14px',color:'#f0f0f5',fontSize:'13px',outline:'none',boxSizing:'border-box'}} />
            </div>
            <button type="submit" disabled={loading}
              style={{width:'100%',background:'#f0c14b',color:'#000',fontWeight:'600',padding:'12px',borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'14px'}}>
              {loading ? 'Accediendo...' : 'Entrar →'}
            </button>
          </form>
          <div style={{marginTop:'24px',paddingTop:'24px',borderTop:'1px solid rgba(255,255,255,0.07)',textAlign:'center',fontSize:'13px',color:'#9090a8'}}>
            ¿No tienes cuenta? <Link href="/auth/register" style={{color:'#f0c14b'}}>Regístrate gratis</Link>
          </div>
        </div>
      </div>
    </div>
  )
}