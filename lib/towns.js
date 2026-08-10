// One entry per town page. Content is genuinely differentiated per DEC (town pages must not be
// the same page with the name swapped) — each intro reflects real geography and housing stock.

export const TOWNS = [
  {
    slug: 'marupe',
    locative: 'Mārupē',
    nominative: 'Mārupe',
    intro:
      'Mārupe robežojas ar Rīgu un lidostu “Rīga” un pēdējos piecpadsmit gados ir viena no straujāk augošajām pašvaldībām Latvijā. Lielākā daļa māju ir jaunbūves privātmājas un rindu mājas ar gāzes vai siltumsūkņu apkuri — modernas sistēmas, kurām tomēr nepieciešama regulāra, plānota apkope, lai garantija un ražotāja noteikumi paliktu spēkā.',
    focus: 'Visbiežāk apkalpojam gāzes katlus un gaiss-ūdens siltumsūkņus jaunbūvēs — sistēmas, kas prasa precīzu ikgadēju regulēšanu, nevis tikai avārijas remontu.',
  },
  {
    slug: 'adazi',
    locative: 'Ādažos',
    nominative: 'Ādaži',
    intro:
      'Ādaži atrodas uz ziemeļiem no Rīgas gar Vidzemes šoseju, Gaujas tuvumā. Novadā mijas gan jaunas privātmājas, gan vecāka apbūve — tas nozīmē, ka blakus modernam siltumsūknim bieži strādā arī desmit un vairāk gadus vecs gāzes vai cietā kurināmā katls, kuram efektivitāte un drošība jāpārbauda ik gadu.',
    focus: 'Apkalpojam gan jaunāku māju siltumsūkņus, gan vecāku privātmāju gāzes un cietā kurināmā katlus — bieži vienā un tajā pašā ielā.',
  },
  {
    slug: 'kekava',
    locative: 'Ķekavā',
    nominative: 'Ķekava',
    intro:
      'Ķekava atrodas uz dienvidiem no Rīgas gar Bauskas šoseju un pēdējos gados strauji aug — jaunu privātmāju rajoni mijas ar ilggadējiem ciematiem. Daudzās mājās apkures sistēma vēl ir sākotnējā stāvoklī no ievešanas brīža, bez ikgadējas apkopes vēstures.',
    focus: 'Bieži pirmā apkope, ko māja piedzīvo kopš uzstādīšanas — sākam ar pilnu sistēmas apskati un servisa vēstures izveidi.',
  },
  {
    slug: 'ropazi',
    locative: 'Ropažos',
    nominative: 'Ropaži',
    intro:
      'Ropažu novads atrodas uz austrumiem no Rīgas un ir mazāk blīvi apdzīvots nekā Mārupe vai Ķekava — pārsvarā privātmājas lielākos zemes gabalos, bieži ar malkas, granulu vai cietā kurināmā apkuri. Šādām sistēmām ikgadēja skursteņa un katla pārbaude ir gan drošības, gan efektivitātes jautājums.',
    focus: 'Specializējamies granulu un cietā kurināmā katlu apkopē — kurināmā veids, kas Ropažos sastopams biežāk nekā vidēji Pierīgā.',
  },
  {
    slug: 'salaspils',
    locative: 'Salaspilī',
    nominative: 'Salaspils',
    intro:
      'Salaspils atrodas pie Daugavas uz dienvidaustrumiem no Rīgas un apvieno padomju laika daudzdzīvokļu māju rajonus ar privātmāju ciematiem. Daudzdzīvokļu mājās apkure bieži ir centralizēta, taču privātmājās un rindu mājās sastopami visu veidu individuālie katli — no vecākiem gāzes modeļiem līdz jaunākiem siltumsūkņiem.',
    focus: 'Pazīstam gan Salaspils privātmāju rajonu individuālos katlus, gan jaunāku ēku siltumsūkņu sistēmas.',
  },
  {
    slug: 'jurmala',
    locative: 'Jūrmalā',
    nominative: 'Jūrmala',
    intro:
      'Jūrmala stiepjas gar Rīgas jūras līci no Lielupes līdz Ķemeriem un apvieno vairākus rajonus — no Bulduriem un Majoriem līdz Vaivariem un Slokai. Daudzas mājas tiek izmantotas sezonāli, tāpēc apkures sistēmai bieži nepieciešama pārbaude tieši pirms sezonas sākuma vai pēc ilgākas dīkstāves, kad iespējami bojājumi, kas ziemā palikuši nepamanīti.',
    focus: 'Bieži veicam pirmssezonas pārbaudes vasarnīcām un sezonas mājām, kur apkure vairākus mēnešus nav darbojusies.',
  },
  {
    slug: 'olaine',
    locative: 'Olainē',
    nominative: 'Olaine',
    intro:
      'Olaine atrodas uz dienvidrietumiem no Rīgas gar ceļu uz Jelgavu un vēsturiski ir rūpniecības pilsēta. Dzīvojamajā fondā mijas padomju laika daudzdzīvokļu mājas ar jaunākiem privātmāju rajoniem pilsētas nomalē — līdz ar to arī apkures sistēmu vecums un tips ievērojami atšķiras no mājas uz māju.',
    focus: 'Apkalpojam gan vecāku dzīvojamo fondu ar individuālajiem katliem, gan jaunāku privātmāju siltumsūkņus Olaines nomalē.',
  },
  {
    slug: 'babite',
    locative: 'Babītē',
    nominative: 'Babīte',
    intro:
      'Babītes novads atrodas uz rietumiem no Rīgas, Babītes ezera tuvumā, uz ceļa virzienā uz Jūrmalu. Apbūvi veido galvenokārt privātmājas — daudzas no tām ar individuālu gāzes vai siltumsūkņa apkuri, kur regulāra apkope ir vienīgais veids, kā izvairīties no negaidītiem izsaukumiem aukstajā sezonā.',
    focus: 'Pārsvarā privātmāju gāzes katli un siltumsūkņi — sistēmas, kur ikgadēja apkope tieši samazina avārijas izsaukumu skaitu ziemā.',
  },
]

export function getTown(slug) {
  return TOWNS.find((t) => t.slug === slug) ?? null
}
