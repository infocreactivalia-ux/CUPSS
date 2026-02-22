import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EscandallosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: local } = await supabase.from('locales').select('id').eq('owner_id', user.id).single()
  const { data: recetas } = await supabase.from('recetas').select('*').eq('local_id', local?.id||'').order('created_at',{ascending:false})
  const { data: mermas } = await supabase.from('mermas').select('*').eq('local_id', local?.id||'').order('fecha',{ascending:false}).limit(10)
  const totalMermas = mermas?.reduce((acc,m) => acc + (m.coste||0), 0) || 0

  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>🍳 Smart Escandallos</h1>
      <p style={{color:'#9090a8',fontSize:'13px',marginBottom:'24px'}}>Controla márgenes y registra mermas de tus platos</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'24px'}}>
        {[
          {label:'Platos',value:String(recetas?.length||0),color:'#4d9fff'},
          {label:'Mermas Mes',value:totalMermas.toFixed(0)+'€',color:'#ff4d6d'},
          {label:'Margen Objetivo',value:'65%',color:'#2dd4a0'},
        ].map(k => (
          <div key={k.label} style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'16px',borderTop:`2px solid ${k.color}`}}>
            <div style={{fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'6px'}}>{k.label}</div>
            <div style={{fontSize:'24px',fontWeight:'700',color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <h2 style={{fontSize:'14px',fontWeight:'700'}}>Análisis de Márgenes</h2>
          </div>
          {!recetas||recetas.length===0 ? (
            <div style={{padding:'32px',textAlign:'center',color:'#5a5a72',fontSize:'13px'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>🍳</div>
              No hay platos registrados aún
            </div>
          ) : (
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  {['Plato','PVP','Margen','Estado'].map(h => (
                    <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'500'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recetas.map((r:any) => (
                  <tr key={r.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <td style={{padding:'12px 16px',fontWeight:'500',color:'#f0f0f5'}}>{r.nombre}</td>
                    <td style={{padding:'12px 16px',color:'#f0c14b',fontWeight:'700'}}>{r.precio_venta}€</td>
                    <td style={{padding:'12px 16px',color:'#9090a8'}}>{r.margen_objetivo}%</td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{background:'rgba(45,212,160,0.1)',color:'#2dd4a0',padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>Activo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
            <h2 style={{fontSize:'14px',fontWeight:'700'}}>🗑️ Registro de Mermas</h2>
          </div>
          {!mermas||mermas.length===0 ? (
            <div style={{padding:'32px',textAlign:'center',color:'#5a5a72',fontSize:'13px'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>✅</div>
              Sin mermas registradas
            </div>
          ) : (
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  {['Producto','Coste','Causa'].map(h => (
                    <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'500'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mermas.map((m:any) => (
                  <tr key={m.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <td style={{padding:'12px 16px',color:'#f0f0f5'}}>{m.producto_nombre}</td>
                    <td style={{padding:'12px 16px',color:'#ff4d6d',fontWeight:'700'}}>{m.coste}€</td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{background:'rgba(240,193,75,0.1)',color:'#f0c14b',padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',textTransform:'capitalize'}}>{m.causa}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
