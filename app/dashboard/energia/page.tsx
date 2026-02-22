import { createClient } from '@/lib/supabase/server'

export default async function EnergiaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: local } = await supabase.from('locales').select('id').eq('owner_id', user!.id).single()
  const { data: tarifas } = await supabase.from('tarifas_energia').select('*').order('precio_kwh', {ascending:true})
  const { data: facturas } = await supabase.from('facturas_energia').select('*').eq('local_id', local?.id||'').order('created_at',{ascending:false}).limit(5)

  const mejorTarifa = tarifas?.[0]

  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>⚡ CUPSS Energía</h1>
      <p style={{color:'#9090a8',fontSize:'13px',marginBottom:'24px'}}>Analiza tu factura con OCR y encuentra la mejor tarifa</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'20px'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700',marginBottom:'16px'}}>📄 Subir Factura — OCR Automático</h2>
          <div style={{border:'2px dashed rgba(255,255,255,0.1)',borderRadius:'12px',padding:'32px',textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>⚡</div>
            <div style={{fontSize:'13px',color:'#9090a8',marginBottom:'4px'}}>Arrastra tu factura aquí</div>
            <div style={{fontSize:'11px',color:'#5a5a72',marginBottom:'16px'}}>PDF, JPG o PNG · Máx. 10MB</div>
            <div style={{fontSize:'11px',color:'#2dd4a0'}}>✓ Extracción automática de datos con IA</div>
          </div>
          {facturas && facturas.length > 0 && (
            <div style={{marginTop:'16px'}}>
              <div style={{fontSize:'11px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>Última factura analizada</div>
              {facturas.slice(0,1).map((f:any) => (
                <div key={f.id} style={{background:'#18181f',borderRadius:'8px',padding:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                    <span style={{fontSize:'12px',color:'#9090a8'}}>{f.comercializadora}</span>
                    <span style={{fontSize:'14px',fontWeight:'700',color:'#ff4d6d'}}>{f.importe_total}€</span>
                  </div>
                  <div style={{fontSize:'11px',color:'#5a5a72'}}>{f.consumo_kwh} kWh · {f.precio_kwh}€/kWh</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'20px'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700',marginBottom:'16px'}}>⚖️ Comparador de Tarifas</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {tarifas?.map((t:any) => {
              const isBest = t.id === mejorTarifa?.id
              return (
                <div key={t.id} style={{
                  padding:'13px',borderRadius:'10px',
                  background: isBest ? 'rgba(45,212,160,0.04)' : '#18181f',
                  border: isBest ? '2px solid #2dd4a0' : '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
                    <span style={{fontSize:'12px',fontWeight:'600'}}>{t.nombre_tarifa}</span>
                    {isBest && <span style={{fontSize:'10px',background:'rgba(45,212,160,0.15)',color:'#2dd4a0',padding:'2px 7px',borderRadius:'20px',fontWeight:'600'}}>⭐ Mejor precio</span>}
                  </div>
                  <div style={{fontSize:'20px',fontWeight:'700',color: isBest ? '#2dd4a0' : '#f0f0f5'}}>
                    {t.precio_kwh}€<span style={{fontSize:'11px',fontWeight:'400',color:'#9090a8'}}>/kWh</span>
                  </div>
                  <div style={{fontSize:'10px',color:'#5a5a72',marginTop:'2px'}}>{t.tipo} · {t.descripcion}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
