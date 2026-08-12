import Link from 'next/link'
import '../../../account.css'
import { supabaseServer } from '../../../../lib/server'

export const metadata = {
  title: 'Atteikšanās no e-pastiem — AP Komforts',
}

export default async function AtteiktiesPage({ params }) {
  const { id } = await params
  const sb = await supabaseServer()
  const { error } = await sb.rpc('unsubscribe_customer', { p_customer_id: id })

  return (
    <section className="block tight acct" style={{ minHeight: 'auto' }}>
      <div className="wrap" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: 400, padding: '34px 32px', textAlign: 'center' }}>
          {error ? (
            <>
              <h2 style={{ fontSize: 17, marginBottom: 10 }}>Kaut kas nogāja greizi</h2>
              <p className="small muted">
                Neizdevās apstrādāt jūsu pieprasījumu. Lūdzu, sazinieties ar mums, lai atteiktos no e-pastiem.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 17, marginBottom: 10 }}>Jūs esat atteicies</h2>
              <p className="small muted">
                Jūs esat veiksmīgi atteicies no mārketinga e-pastiem. Vairs nesaņemsiet šādus paziņojumus.
              </p>
            </>
          )}
          <p className="small muted" style={{ marginTop: 16 }}>
            <Link href="/" style={{ color: 'var(--ink)', fontWeight: 600 }}>← Uz sākumu</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
