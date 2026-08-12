export const TIER = { apkope: 'Apkope', komforts: 'Komforts', komforts_pilns: 'Komforts Pilns' }
export const STATUS = {
  active: ['Aktīvs', 'p-active'], enquiry: ['Pieteikums', 'p-pending'],
  pending_first_service: ['Gaida 1. apkopi', 'p-pending'], lapsed: ['Beidzies', 'p-declined'],
  cancelled: ['Atcelts', 'p-declined'], declined: ['Atteikts', 'p-declined'],
}
export const KIND = {
  gas_combi: 'Gāzes katls — combi', gas_system: 'Gāzes katls — sistēmas', electric_boiler: 'Elektriskais katls',
  pellet_solid: 'Granulu / cietā kurināmā', hp_air_air: 'Siltumsūknis gaiss–gaiss',
  hp_air_water: 'Siltumsūknis gaiss–ūdens', hp_ground: 'Zemes siltumsūknis', cylinder: 'Karstā ūdens boileris', other: 'Cits',
}
export const DISTRIBUTION = {
  radiators: 'Radiatori', forced_air: 'Gaisa apkure', underfloor: 'Grīdas apkure', other: 'Cits',
}
export const JOB = {
  first_service: 'Pirmā apkope', annual_service: 'Gadskārtējā apkope', callout: 'Izsaukums',
  repair: 'Remonts', installation: 'Uzstādīšana', quote_visit: 'Tāmes vizīte',
}
export const JOB_STATUS = {
  enquiry: ['Pieteikts', 'p-pending'], scheduled: ['Ieplānots', 'p-active'],
  in_progress: ['Norisinās', 'p-active'], completed: ['Pabeigts', 'p-done'], cancelled: ['Atcelts', 'p-declined'],
}
export const COND = { good: 'Labs', fair: 'Apmierinošs', poor: 'Slikts', beyond_economic_repair: 'Nav remontējams' }
export const INVOICE_STATUS = {
  draft: ['Melnraksts', 'p-pending'], sent: ['Nosūtīts', 'p-active'],
  paid: ['Apmaksāts', 'p-active'], cancelled: ['Atcelts', 'p-declined'],
}
export const QUOTE_STATUS = {
  draft: ['Melnraksts', 'p-pending'], sent: ['Nosūtīts', 'p-active'],
  accepted: ['Pieņemts', 'p-active'], declined: ['Noraidīts', 'p-declined'], expired: ['Beidzies', 'p-declined'],
}
export const d = v => v ? new Date(v).toLocaleDateString('lv-LV', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
export const dt = v => v ? new Date(v).toLocaleString('lv-LV', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
export const eur = v => (v === null || v === undefined) ? '—' : '€' + Number(v).toFixed(2).replace('.', ',')
