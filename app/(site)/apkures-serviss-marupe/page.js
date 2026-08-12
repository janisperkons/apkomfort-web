import { getTown } from '../../../lib/towns'
import TownPage from '../../../components/TownPage'

const town = getTown('marupe')

export const metadata = {
  title: `Apkures katlu apkope un serviss ${town.locative} — AP Komforts`,
  description: `Apkures katlu apkope un serviss ${town.locative}. Sertificēts inženieris, skaidrs apkopes plāns, cenas aprēķins tiešsaistē.`,
}

export default function Page() {
  return <TownPage town={town} />
}
