import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'

export const metadata = {
  title: 'Privātuma politika — AP Komforts',
  description:
    'Kā SIA "AP KOMFORTS" apstrādā klientu personas datus: nolūki, tiesiskais pamats, glabāšanas termiņi un jūsu tiesības saskaņā ar VDAR.',
}

const S = { marginTop: 28 }

export default function PrivatumsPage() {
  return (
    <>
      <PageIntro eyebrow="Privātums" h1="Privātuma politika" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 760, fontSize: 15, lineHeight: 1.7 }}>
          <p style={{ color: 'var(--muted)' }}>Spēkā no 2026. gada 3. septembra.</p>

          <h2 style={S}>1. Pārzinis</h2>
          <p>
            Jūsu personas datu pārzinis ir SIA &quot;AP KOMFORTS&quot;, vienotais reģistrācijas
            Nr. 43603024222, Rīga, Latvija. Tālrunis: <a href="tel:+37126275983">+371 26 275 983</a>.
          </p>

          <h2 style={S}>2. Kādus datus apstrādājam un kāpēc</h2>
          <ul>
            <li>
              <strong>Konta un līguma dati</strong> — vārds, tālrunis, e-pasts, īpašuma adrese un
              iekārtu informācija, pieteikumi, tāmes un rēķini. Nolūks: pakalpojumu sniegšana un
              līguma izpilde (VDAR 6. panta 1. punkta b) apakšpunkts).
            </li>
            <li>
              <strong>Grāmatvedības dati</strong> — rēķini un maksājumu informācija. Nolūks: juridisko
              pienākumu izpilde grāmatvedības jomā (VDAR 6. panta 1. punkta c) apakšpunkts).
            </li>
            <li>
              <strong>Saziņas dati</strong> — jautājumi un pieteikumi, ko iesniedzat vietnes formās.
              Nolūks: atbildēšana uz jūsu pieprasījumu (VDAR 6. panta 1. punkta b) un f) apakšpunkts).
            </li>
            <li>
              <strong>Mārketinga paziņojumi</strong> — tikai ar jūsu piekrišanu, no kuras jebkurā
              brīdī varat atteikties ar saiti e-pastā vai sazinoties ar mums (VDAR 6. panta 1. punkta
              a) apakšpunkts).
            </li>
            <li>
              <strong>Vietnes statistika</strong> — apmeklētās lapas, ierīces veids, pārlūks un
              aptuvena valsts, bez sīkdatnēm un bez personas identificēšanas. Nolūks: vietnes
              uzlabošana (leģitīmā interese, VDAR 6. panta 1. punkta f) apakšpunkts).
            </li>
          </ul>

          <h2 style={S}>3. Sīkdatnes</h2>
          <p>
            Vietnes publiskajā daļā mārketinga vai izsekošanas sīkdatnes neizmantojam. Pieslēdzoties
            klienta kontam, tiek izmantotas tikai darbībai nepieciešamās sesijas sīkdatnes, bez kurām
            pieslēgšanās nav iespējama.
          </p>

          <h2 style={S}>4. Kam datus nododam</h2>
          <p>
            Datus apstrādājam paši un nododam tikai uzticamiem apstrādātājiem, kas nodrošina mūsu
            infrastruktūru (datu mitināšana, e-pasta piegāde), kā arī normatīvajos aktos noteiktajos
            gadījumos — piemēram, grāmatvedības un nodokļu vajadzībām. Datus nepārdodam un
            nenododam trešajām personām mārketinga nolūkiem.
          </p>

          <h2 style={S}>5. Cik ilgi datus glabājam</h2>
          <p>
            Konta datus glabājam, kamēr konts ir aktīvs. Grāmatvedības attaisnojuma dokumentus
            glabājam normatīvajos aktos noteikto termiņu. Saziņas pieteikumus glabājam tik ilgi, cik
            nepieciešams jautājuma atrisināšanai. Pēc konta dzēšanas dati tiek dzēsti vai
            anonimizēti, izņemot tos, kuru glabāšanu pieprasa likums.
          </p>

          <h2 style={S}>6. Jūsu tiesības</h2>
          <p>
            Jums ir tiesības piekļūt saviem datiem, tos labot, dzēst, ierobežot apstrādi, iebilst
            pret apstrādi, saņemt datus pārnesamā formātā un atsaukt piekrišanu. Lielāko daļu konta
            datu varat apskatīt un labot pats sava konta sadaļā <Link href="/pieslegties/">Mans konts</Link>;
            pārējos jautājumos sazinieties ar mums pa tālruni +371 26 275 983. Ja uzskatāt, ka jūsu
            datu apstrāde pārkāpj normatīvos aktus, jums ir tiesības iesniegt sūdzību Datu valsts
            inspekcijā (www.dvi.gov.lv).
          </p>

          <h2 style={S}>7. Izmaiņas</h2>
          <p>
            Aktuālā privātuma politikas redakcija vienmēr ir pieejama šajā lapā. Par būtiskām izmaiņām
            informēsim portālā vai e-pastā.
          </p>
        </div>
      </section>
    </>
  )
}
