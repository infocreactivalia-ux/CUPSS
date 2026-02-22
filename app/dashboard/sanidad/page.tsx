import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SanidadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: local } = await supabase.from('locales').select('id').eq('owner_id', user.id).single()
  const { data: docs } = await supabase.from('documentos_legales').select('*').eq('local_id', local?.id||'').order('fecha_vencimiento',{ascending:true})
  const { data: temps } = await supabase.from('registros_temperatura').select('*').eq('local_id', local?.id||'').order('fecha_hora',{ascending:false}).limit(10)
  const { data: checklist } = await supabase.from('checklist_appcc').select('*').eq('local_id', local?.id||'').eq('activo',true).order('orden')

  const today = new Date()
  const getDocColor = (fecha: string) => {
    if (!fecha) return '#2dd4a0'
    const days = Math.floor((new Date(fecha).getTime() - today.getTime()) / (1000*60*60*24))
    if (days <= 10) return '#ff4d6d'
    if (days <= 30) return '#f0c14b'
    return '#2dd4a0'
  }

  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>📋 Legal & Sanidad</h1>
      <p style={{color:'#9090a8',fontSize:'13px',marginBottom:'24px'}}>APPCC, temperaturas y documentos legales</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'20px'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700',marginBottom:'16px'}}>✅ Checklist APPCC</h2>
          {!checklist||checklist.length===0 ? (
            <div style={{textAlign:'center',padding:'24px 0',color:'#5a5a72',fontSize:'13px'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>📋</div>
              No hay tareas configuradas
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {checklist.map((t:any) => (
                <div key={t.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'#18181f',borderRadius:'8px'}}>
                  <div style={{width:'16px',height:'16px',borderRadius:'4px',border:'2px solid rgba(255,255,255,0.15)',flexShrink:0}}></div>
                  <span style={{fontSize:'12px',color:'#9090a8',flex:1}}>{t.tarea}</span>
                  <span style={{fontSize:'10px',color:'#5a5a72',textTransform:'capitalize'}}>{t.turno}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'20px'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700',marginBottom:'16px'}}>📁 Documentos Legales</h2>
          {!docs||docs.length===0 ? (
            <div style={{textAlign:'center',padding:'24px 0',color:'#5a5a72',fontSize:'13px'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>📄</div>
              No hay documentos registrados
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {docs.map((d:any) => {
                const color = getDocColor(d.fecha_vencimiento)
                const days = d.fecha_vencimiento ? Math.floor((new Date(d.fecha_vencimiento).getTime() - today.getTime()) / (1000*60*60*24)) : null
                return (
                  <div key={d.id} style={{padding:'11px 13px',background:'#18181f',borderRadius:'8px',borderLeft:`3px solid ${color}`}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'3px'}}>
                      <span style={{fontSize:'12px',fontWeight:'500',color:'#f0f0f5'}}>{d.nombre}</span>
                      {days !== null && (
                        <span style={{fontSize:'10px',background:`${color}20`,color,padding:'2px 7px',borderRadius:'20px',fontWeight:'600'}}>
                          {days <= 0 ? 'Vencido' : `${days}d`}
                        </span>
                      )}
                    </div>
                    {d.fecha_vencimiento && <div style={{fontSize:'10px',color:'#5a5a72'}}>Vence: {new Date(d.fecha_vencimiento).toLocaleDateString('es-ES')}</div>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700'}}>🌡️ Control de Temperaturas</h2>
        </div>
        {!temps||temps.length===0 ? (
          <div style={{padding:'32px',textAlign:'center',color:'#5a5a72',fontSize:'13px'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>🌡️</div>
            No hay registros de temperatura
          </div>
        ) : (
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                {['Zona','Temperatura','Rango','Estado','Fecha'].map(h => (
                  <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'500'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {temps.map((t:any) => (
                <tr key={t.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'12px 16px',color:'#f0f0f5',textTransform:'capitalize'}}>{t.zona?.replace('_',' ')}</td>
                  <td style={{padding:'12px 16px',fontWeight:'700',color: t.dentro_rango===false ? '#ff4d6d' : '#f0f0f5'}}>{t.temperatura}°C</td>
                  <td style={{padding:'12px 16px',color:'#9090a8'}}>{t.temp_min}°C – {t.temp_max}°C</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{background: t.dentro_rango===false ? 'rgba(255,77,109,0.1)' : 'rgba(45,212,160,0.1)', color: t.dentro_rango===false ? '#ff4d6d' : '#2dd4a0', padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>
                      {t.dentro_rango===false ? '⚠ Fuera' : '✓ OK'}
                    </span>
                  </td>
                  <td style={{padding:'12px 16px',color:'#9090a8',fontSize:'11px'}}>{new Date(t.fecha_hora).toLocaleString('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
