import { createClient } from '@/lib/supabase/server'

export default async function ComprasPage() {
  const supabase = await createClient()
  const { data: productos } = await supabase
    .from('productos')
    .select('*, proveedores(nombre, valoracion, ciudad)')
    .order('precio', { ascending: true })

  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>🛒 Marketplace de Compras</h1>
      <p style={{color:'#9090a8',fontSize:'13px',marginBottom:'24px'}}>Compara precios de proveedores y ahorra en cada pedido</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px',marginBottom:'24px'}}>
        {[
          {label:'Proveedores',value:'5',color:'#f0c14b'},
          {label:'Productos',value:String(productos?.length||0),color:'#2dd4a0'},
          {label:'Comisión CUPSS',value:'2%',color:'#4d9fff'},
        ].map(k => (
          <div key={k.label} style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'16px',borderTop:`2px solid ${k.color}`}}>
            <div style={{fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'6px'}}>{k.label}</div>
            <div style={{fontSize:'24px',fontWeight:'700',color:k.color}}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{background:'#111118',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <h2 style={{fontSize:'14px',fontWeight:'700'}}>Catálogo de Productos</h2>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                {['Producto','Categoría','Proveedor','Ciudad','Precio','Stock','Valoración'].map(h => (
                  <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'10px',color:'#5a5a72',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'500',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos?.map((p:any) => (
                <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'13px 16px',fontWeight:'500',color:'#f0f0f5'}}>{p.nombre}</td>
                  <td style={{padding:'13px 16px'}}>
                    <span style={{background:'rgba(77,159,255,0.1)',color:'#4d9fff',padding:'2px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',textTransform:'capitalize'}}>{p.categoria}</span>
                  </td>
                  <td style={{padding:'13px 16px',color:'#9090a8'}}>{p.proveedores?.nombre}</td>
                  <td style={{padding:'13px 16px',color:'#9090a8'}}>{p.proveedores?.ciudad}</td>
                  <td style={{padding:'13px 16px',color:'#f0c14b',fontWeight:'700',fontSize:'15px'}}>{p.precio}€</td>
                  <td style={{padding:'13px 16px'}}>
                    <span style={{background:p.stock_disponible?'rgba(45,212,160,0.1)':'rgba(255,77,109,0.1)',color:p.stock_disponible?'#2dd4a0':'#ff4d6d',padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>
                      {p.stock_disponible ? 'Disponible' : 'Sin stock'}
                    </span>
                  </td>
                  <td style={{padding:'13px 16px',color:'#9090a8'}}>⭐ {p.proveedores?.valoracion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
