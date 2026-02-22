import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const planes = [
  {
    id:'basico', nombre:'BÁSICO', precio:0, color:'#9090a8',
    features:['Marketplace 3 comparaciones/mes','Sin permanencia'],
    noFeatures:['CUPSS Energía','CUPSS Talento','Smart Escandallos','Legal & Sanidad']
  },
  {
    id:'pro', nombre:'PRO', precio:9, color:'#f0c14b', popular:true,
    features:['Marketplace ilimitado','CUPSS Energía + OCR','CUPSS Talento','Smart Escandallos','Legal & Sanidad + APPCC','Alertas inteligentes'],
    noFeatures:[]
  },
  {
    id:'enterprise', nombre:'ENTERPRISE', precio:29, color:'#a78bfa',
    features:['Todo lo de Pro','Hasta 10 locales','API personalizada','Account Manager dedicado','White label'],
    noFeatures:[]
  },
]

export default async function FintechPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: local } = await supabase.from('locales').select('*').eq('owner_id', user.id).single()
  const { data: pagos } = await supabase.from('pagos').select('*').eq('local_id', local?.id||'').order('created_at',{ascending:false}).limit(10)

  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>💳 Suscripción & Pagos</h1>
      <p style={{color:'#9090a8',fontSize:'13px',marginBottom:'24px'}}>Gestiona tu plan y consulta el historial de pagos</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'24px'}}>
        {planes.map(p => (
          <div key={p.id} style={{
            background: local?.plan===p.id ? 'rgba(240,193,75,0.02)' : '#111118',
            border: local?.plan===p.id ? `2px solid ${p.color}` : '1px solid rgba(255,255,255,0.07)',
            borderRadius:'14px',padding:'22px'
          }}>
            {p.popular && <div style={{fontSize:'9px',color:p.color,textTransform:'uppercase',letterSpacing:'2px',marginBottom:'6px'}}>★ Más Popular</div>}
            <div style={{fontSize:'13px',fontWeight:'600',color:p.color,marginBottom:'10px'}}>{p.nombre}</div>
            <div style={{fontSize:'36px',fontWeight:'800',color:p.color,lineHeight:1,marginBottom:'4px'}}>
              {p.precio}€<span style={{fontSize:'13px',fontWeight:'400',color:'#5a5a72'}}>/mes</span>
            </div>
            <div style={{height:'1px',background:'rgba(255,255,255,0.07)',margin:'16px 0'}}></div>
            {p.features.map(f => (
              <div key={f} style={{display:'flex',gap:'7px',marginBottom:'7px',fontSize:'12px',color:'#9090a8'}}>
                <span style={{color:'#2dd4a0',flexShrink:0}}>✓</span>{f}
              </div>
            ))}
            {p.noFeatures.map(f => (
              <div key={f} style={{display:'flex',gap:'7px',marginBottom:'7px',fontSize:'12px',color:'#3a3a52'}}>
                <span style={{flexShrink:0}}>✗</span>{f}
              </div>
            ))}
            <div style={{marginTop:'16px'}}>
              {local?.plan===p.id ? (
                <button style={{width:'100%',background:'rgba(240,193,75,0.1)',color:'#f0c14b',border:'1px solid rgba(240,193,75,0.3)',borderRadius:'8px',padding:'10px',fontSize:'12px',fontWeight:'600',cursor:'default'}}>
                  Plan Activo ✓
                </button>
              ) : (
                <button style={{width:'100%',background: p.id==='basico' ? '#18181f' : p.color,color: p.id==='basico' ? '#9090a8' : '#000',border:'none',borderRadius:'8px',padding:'10px',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>
                  {p.id==='basico' ? 'Plan Básico' : p.id==='enterprise' ? 'Contactar' : 'Actualizar →'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700'}}>Historial de Pagos</h2>
        </div>
        {!pagos||pagos.length===0 ? (
          <div style={{padding:'32px',textAlign:'center',color:'#5a5a72',fontSize:'13px'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>💳</div>
            No hay pagos registrados
          </div>
        ) : (
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                {['Fecha','Concepto','Importe','Estado'].map(h => (
                  <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'500'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagos.map((p:any) => (
                <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'12px 16px',color:'#9090a8'}}>{new Date(p.created_at).toLocaleDateString('es-ES')}</td>
                  <td style={{padding:'12px 16px',color:'#f0f0f5'}}>{p.descripcion||p.tipo}</td>
                  <td style={{padding:'12px 16px',fontWeight:'700',color:'#f0f0f5'}}>{p.importe}€</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{background: p.estado==='completado' ? 'rgba(45,212,160,0.1)' : 'rgba(240,193,75,0.1)', color: p.estado==='completado' ? '#2dd4a0' : '#f0c14b', padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',textTransform:'capitalize'}}>{p.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
