import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0f',color:'#f0f0f5',fontFamily:'sans-serif'}}>
      <nav style={{width:'200px',height:'100vh',background:'#111118',borderRight:'1px solid rgba(255,255,255,0.07)',position:'fixed',top:0,left:0,display:'flex',flexDirection:'column',padding:'20px 0'}}>
        <div style={{padding:'0 20px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',marginBottom:'10px'}}>
          <div style={{fontSize:'24px',fontWeight:'900',color:'#f0c14b'}}>CUPSS</div>
        </div>
        {[
          {href:'/dashboard',label:'Dashboard',icon:'⊞'},
          {href:'/dashboard/compras',label:'Marketplace',icon:'🛒'},
          {href:'/dashboard/energia',label:'Energía',icon:'⚡'},
          {href:'/dashboard/talento',label:'Talento',icon:'👥'},
          {href:'/dashboard/escandallos',label:'Escandallos',icon:'🍳'},
          {href:'/dashboard/sanidad',label:'Sanidad',icon:'📋'},
          {href:'/dashboard/fintech',label:'Suscripción',icon:'💳'},
        ].map(item => (
          <a key={item.href} href={item.href}
            style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 20px',color:'#9090a8',textDecoration:'none',fontSize:'13px'}}
          >
            <span>{item.icon}</span>{item.label}
          </a>
        ))}
      </nav>
      <main style={{marginLeft:'200px',padding:'28px'}}>
        {children}
      </main>
    </div>
  )
}