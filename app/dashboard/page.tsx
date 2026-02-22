export default function DashboardPage() {
  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'20px'}}>Dashboard 360°</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        {[
          {href:'/dashboard/compras',icon:'🛒',label:'Marketplace'},
          {href:'/dashboard/energia',icon:'⚡',label:'Energía'},
          {href:'/dashboard/talento',icon:'👥',label:'Talento'},
          {href:'/dashboard/escandallos',icon:'🍳',label:'Escandallos'},
          {href:'/dashboard/sanidad',icon:'📋',label:'Sanidad'},
          {href:'/dashboard/fintech',icon:'💳',label:'Pagos'},
        ].map(m => (
          <a key={m.href} href={m.href} style={{display:'flex',alignItems:'center',gap:'10px',padding:'20px',background:'#111118',borderRadius:'14px',color:'#9090a8',textDecoration:'none',fontSize:'14px',border:'1px solid rgba(255,255,255,0.07)'}}>
            <span style={{fontSize:'24px'}}>{m.icon}</span>{m.label}
          </a>
        ))}
      </div>
    </div>
  )
}