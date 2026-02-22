import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TalentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: local } = await supabase.from('locales').select('id').eq('owner_id', user.id).single()
  const { data: ofertas } = await supabase.from('ofertas_trabajo').select('*, candidaturas(count)').eq('local_id', local?.id||'').order('created_at',{ascending:false})

  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>👥 CUPSS Talento</h1>
      <p style={{color:'#9090a8',fontSize:'13px',marginBottom:'24px'}}>Encuentra candidatos cercanos con matching por geolocalización</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'24px'}}>
        {[
          {label:'Ofertas Activas',value:String(ofertas?.filter((o:any)=>o.activa).length||0),color:'#f0c14b'},
          {label:'Algoritmo',value:'PostGIS',color:'#2dd4a0'},
          {label:'Radio Máx.',value:'50 km',color:'#4d9fff'},
        ].map(k => (
          <div key={k.label} style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'16px',borderTop:`2px solid ${k.color}`}}>
            <div style={{fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'6px'}}>{k.label}</div>
            <div style={{fontSize:'24px',fontWeight:'700',color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'20px'}}>
        <h2 style={{fontSize:'14px',fontWeight:'700',marginBottom:'16px'}}>Puestos de Trabajo</h2>
        {!ofertas||ofertas.length===0 ? (
          <div style={{textAlign:'center',padding:'40px 0',color:'#5a5a72',fontSize:'13px'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>👥</div>
            <div style={{marginBottom:'4px'}}>No hay puestos publicados</div>
            <div style={{fontSize:'12px'}}>Crea tu primera oferta para encontrar candidatos cercanos</div>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {ofertas.map((o:any) => (
              <div key={o.id} style={{background:'#18181f',borderRadius:'10px',padding:'16px',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'8px'}}>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:'600',color:'#f0f0f5',marginBottom:'2px'}}>{o.puesto}</div>
                    <div style={{fontSize:'12px',color:'#9090a8'}}>{o.tipo_jornada} · {o.salario_min && o.salario_max ? `${o.salario_min}–${o.salario_max}€/mes` : 'Salario a convenir'}</div>
                  </div>
                  <span style={{background: o.activa ? 'rgba(45,212,160,0.1)' : 'rgba(255,77,109,0.1)', color: o.activa ? '#2dd4a0' : '#ff4d6d', padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>
                    {o.activa ? 'Activa' : 'Cerrada'}
                  </span>
                </div>
                <div style={{display:'flex',gap:'16px',fontSize:'11px',color:'#5a5a72'}}>
                  <span>📍 Radio: {o.radio_km} km</span>
                  <span>⏰ {o.disponibilidad}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
