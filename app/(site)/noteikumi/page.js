import Link from 'next/link'
import PageIntro from '../../../components/PageIntro'

export const metadata = {
  title: 'Lietošanas noteikumi un distances līgums — AP Komforts',
  description:
    'SIA "AP KOMFORTS" klientu portāla lietošanas noteikumi un distances līguma nosacījumi: pakalpojumi, cenas, atteikuma tiesības un strīdu risināšana.',
}

const S = { marginTop: 28 }

export default function NoteikumiPage() {
  return (
    <>
      <PageIntro eyebrow="Noteikumi" h1="Lietošanas noteikumi un distances līgums" />
      <section className="block">
        <div className="wrap" style={{ maxWidth: 760, fontSize: 15, lineHeight: 1.7 }}>
          <p style={{ color: 'var(--muted)' }}>Spēkā no 2026. gada 3. septembra.</p>

          <h2 style={S}>1. Pakalpojuma sniedzējs</h2>
          <p>
            SIA &quot;AP KOMFORTS&quot;, vienotais reģistrācijas Nr. 43603024222, Rīga, Latvija
            (turpmāk — <strong>AP Komforts</strong> vai <strong>mēs</strong>).
            Tālrunis: <a href="tel:+37126275983">+371 26 275 983</a>. Saziņai izmantojams arī{' '}
            <Link href="/kontakti/">kontaktu formas</Link> risinājums vietnē.
          </p>

          <h2 style={S}>2. Kam šie noteikumi piemērojami</h2>
          <p>
            Noteikumi attiecas uz vietnes apkomforts.lv un tās klientu konta (turpmāk — <strong>portāls</strong>)
            lietošanu, kā arī uz pakalpojumu pieteikšanu distances veidā. Reģistrējoties portālā un
            atzīmējot piekrišanu šiem noteikumiem, starp jums un AP Komforts tiek noslēgts distances
            līgums Ministru kabineta 2014. gada 20. maija noteikumu Nr. 255 &quot;Noteikumi par distances
            līgumu&quot; izpratnē.
          </p>

          <h2 style={S}>3. Pakalpojumu apraksts</h2>
          <p>
            Portāls ļauj izveidot klienta kontu, reģistrēt savu īpašumu un tā iekārtas, pieteikt
            speciālista vizīti, saņemt un apstiprināt cenas piedāvājumus (tāmes), kā arī saņemt rēķinus
            un sekot to apmaksai. Paši darbi — apkures, ūdensapgādes, kanalizācijas un santehnikas
            sistēmu izbūve, apkope un remonts — vienmēr tiek saskaņoti individuāli: pirms darbu sākuma
            jūs saņemat piedāvājumu ar cenu un darbu aprakstu, un darbi sākas tikai pēc jūsu
            apstiprinājuma.
          </p>
          <p>
            Konta izveide un portāla lietošana ir bez maksas. Vizītes pieteikums portālā nav
            automātiska rezervācija — laiku vienmēr apstiprinām, sazinoties ar jums.
          </p>

          <h2 style={S}>4. Cenas un apmaksa</h2>
          <p>
            Pakalpojumu cenas tiek norādītas cenas piedāvājumā (tāmē) vai apkopes plāna piedāvājumā
            pirms darbu sākuma. Vietnē norādītās cenas ir orientējošas, un galīgā cena tiek
            apstiprināta piedāvājumā. Apmaksa notiek saskaņā ar rēķinā norādīto termiņu un
            nosacījumiem. Ja pirms darbu sākuma nepieciešama daļēja priekšapmaksa, tas tiek norādīts
            rēķinā.
          </p>

          <h2 style={S}>5. Atteikuma tiesības</h2>
          <p>
            Ja esat patērētājs un līgums noslēgts distances veidā, jums ir tiesības 14 dienu laikā no
            līguma noslēgšanas dienas atteikties no tā, nesniedzot pamatojumu — nosūtot mums skaidru
            paziņojumu (piemēram, zvanot vai rakstot caur portālu). Pēc pieprasījuma nosūtīsim
            atteikuma veidlapas paraugu.
          </p>
          <p>Lūdzam ņemt vērā normatīvajos aktos noteiktos izņēmumus:</p>
          <ul>
            <li>
              ja piekrītat, ka pakalpojumu sākam sniegt atteikuma termiņa laikā, un pakalpojums tiek
              pilnībā izpildīts, atteikuma tiesības uz pilnībā izpildīto pakalpojumu zūd;
            </li>
            <li>
              atteikuma tiesības neattiecas uz steidzamiem remonta vai apkopes darbiem, kurus
              pieprasāt veikt nekavējoties;
            </li>
            <li>
              ja atteikuma termiņā pakalpojums izpildīts daļēji, jums ir pienākums samaksāt par
              faktiski paveikto daļu.
            </li>
          </ul>

          <h2 style={S}>6. Jūsu konts</h2>
          <p>
            Jūs atbildat par sava konta piekļuves datu drošību un par to, lai kontā norādītā
            informācija (kontakti, īpašuma dati) būtu patiesa un aktuāla. Mēs varam slēgt kontu, ja
            tas tiek izmantots ļaunprātīgi vai pretēji šiem noteikumiem. Jūs jebkurā brīdī varat lūgt
            sava konta dzēšanu, sazinoties ar mums.
          </p>

          <h2 style={S}>7. Personas dati</h2>
          <p>
            Personas datu apstrādi aprakstām <Link href="/privatums/">privātuma politikā</Link>, kas ir
            šo noteikumu neatņemama daļa.
          </p>

          <h2 style={S}>8. Strīdu risināšana</h2>
          <p>
            Domstarpības vispirms centīsimies atrisināt sarunu ceļā — sazinieties ar mums pa tālruni
            vai caur portālu. Ja vienoties neizdodas, patērētājam ir tiesības vērsties Patērētāju
            tiesību aizsardzības centrā (www.ptac.gov.lv) vai Patērētāju strīdu risināšanas komisijā,
            kā arī Latvijas Republikas tiesā normatīvajos aktos noteiktajā kārtībā.
          </p>

          <h2 style={S}>9. Noteikumu grozījumi</h2>
          <p>
            Mēs varam laiku pa laikam atjaunināt šos noteikumus, publicējot aktuālo redakciju šajā
            lapā. Uz jau noslēgtiem līgumiem attiecas tā redakcija, kas bija spēkā līguma noslēgšanas
            brīdī.
          </p>
        </div>
      </section>
    </>
  )
}
