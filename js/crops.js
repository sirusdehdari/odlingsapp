// Grödbank för odlingsappen. zone: 'skugga' | 'sol' | 'valfri'. maintenance: 'latt' | 'medel' | 'krav'.
// perioder-index motsvarar kolumnerna: [Apr-Maj, Jun, Jul, Aug, Sep-Okt, Nov-Mar]
// effectRadius: hur många meter bort companionGood/companionBad räknas som "nära nog"
// för att slå ut en varning mot en annan låda (avstånd mäts mellan lådornas rutor).
// Utelämnad = standard 1 m (bara direkt intilliggande lådor). Höjs bara för ett fåtal
// väletablerade fall (doftstarka pollinerar-lockare) - ingen exakt vetenskap.
const CROPS = {

  // ---------- SKUGGZON (7 lådor vid häcken) ----------

  spenat: {
    name: 'Spenat', sub: 'Låg kalori · Järn · Folat · K-vitamin',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [5, 10], harvestDays: [40, 50] },
    family: 'spenatvaxt', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'vila', label: 'Vila (för varmt)' },
      { cls: 'så', label: 'Så igen' },
      { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså i rader med ca 15 cm mellanrum. Lägg fröna grunt, max 1–2 cm djupt, med 5 cm mellan fröna i raden. Täck lätt med jord och vattna försiktigt. Gror på 5–10 dagar. Behöver inte gallras – trivs tätt.' },
    sorter: [{ namn: 'Matador', beskrivning: 'klassisk svensk sort, stor och smakrik' }, { namn: 'Emilia', beskrivning: 'savoytyp, tålig' }],
    skotsel: ['Håll jorden jämnt fuktig men inte blöt.', 'Behöver ingen gödning under säsongen.', 'Trivs i halvskugga – din odlingsplats passar utmärkt.', 'Går snabbt i frö vid värme. Skörda tidigt och så igen i slutet av juli.'],
    skörd: 'Skörda de yttersta bladen löpande när de är minst handstora, och låt mitten fortsätta växa. Nyp bort blomknoppar direkt du ser dem - när plantan väl gått i blom blir bladen bittra och det är dags att så om.',
    tips: 'Bäst sådd i april och igen i slutet av juli för fin höstskörd.',
    companionGood: ['jordgubbar', 'lok'], companionBad: [],
    vattning: 'Håll jorden jämnt fuktig, särskilt i varmt väder - spenat har grunt rotsystem och torkar ut snabbt. Vattna 2–3 gånger i veckan i normalt väder, varannan dag vid värmebölja. Vattna helst på morgonen så bladen hinner torka innan kvällen - kvarstående fukt över natten ökar risken för svampangrepp.',
    problem: [
      { symptom: 'Plantan skjuter snabbt i höjden och blommar istället för att bilda blad.', orsak: '"Går i blom" (bolting) - spenat är extremt känslig för värme och långa dagar, vanligt i juni–juli.', atgard: 'Så tidigt på våren och igen sent i juli–augusti för höstskörd, undvik att så mitt i högsommaren. Sorten Emilia tål värme lite bättre än de flesta.' },
      { symptom: 'Gulaktiga, ojämna fläckar på bladen, ibland med ett gråaktigt dun på undersidan.', orsak: 'Mjöldagg/bladmögel (peronospora) - vanligt vid fuktigt väder och tät plantering.', atgard: 'Ge plantorna mer utrymme för luftcirkulation, undvik att vattna direkt på bladen, och ta bort de värst drabbade bladen.' },
      { symptom: 'Små hål eller silverglänsande slemspår på bladen.', orsak: 'Sniglar - särskilt vanligt i fuktig, skuggig miljö, vilket passar spenatens föredragna växtplats.', atgard: 'Plocka bort sniglar för hand kvällstid, eller lägg ut ölfällor. Kaffesump eller krossade äggskal runt plantorna kan avskräcka något.' }
    ]
  },

  ruccola: {
    name: 'Ruccola', sub: 'Låg kalori · K-vitamin · Antioxidanter · C-vitamin',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [3, 5], harvestDays: [25, 35] },
    family: 'kal', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Strö fröna längs en rad, max 5 mm djupt. Rader med 15 cm mellanrum. Gror på bara 3–5 dagar. Så om varannan vecka för löpande skörd.' },
    skotsel: ['Håll fuktigt de första 5 dagarna tills groddar syns.', 'Ingen gödning behövs.', 'Nyp bort blomknoppar direkt.'],
    skörd: 'Klipp ytterbladen med sax när de är 5–10 cm långa och låt mitten växa vidare. Smaken blir mildare hos unga blad och skarpare ju äldre och större plantan blir.',
    tips: 'Hål i bladen = jordloppor, ofarligt. Täck med fiberduk om det stör.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna jämnt, gärna varannan dag i torrt väder - ruccola växer snabbt och har grunda rötter som torkar ut lätt. Låt aldrig jorden bli helt uttorkad, det gör bladen skarpare och mer bittra.',
    problem: [
      { symptom: 'Många små runda hål i bladen, ser ut som fint hagel.', orsak: 'Jordloppor - mycket vanliga på ruccola och andra korsblommiga växter, särskilt i soligt och torrt väder.', atgard: 'Påverkar sällan skörden allvarligt, bladen går fint att äta runt hålen. Täck med fiberduk direkt efter sådd vid kraftigt angrepp, och håll jorden fuktig - jordloppor trivs bäst när det är torrt.' },
      { symptom: 'Bladen smakar mycket starkt eller bittert.', orsak: 'Plantan är på väg att gå i blom, oftast utlöst av värme eller torka.', atgard: 'Skörda oftare och yngre blad, och så om i omgångar var 2–3 vecka istället för att låta en sådd stå länge.' }
    ]
  },

  sallat: {
    name: 'Sallat / Klippsallat', sub: 'Låg kalori · Folat · Fibrer · K-vitamin',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [7, 10], harvestDays: [45, 60] },
    family: 'korgblommig', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså grunt, ca 1 cm djupt, 20 cm mellan raderna. Gallra till 15–20 cm avstånd. Köp gärna färdiga plantor för snabbare start.' },
    skotsel: ['Vattna regelbundet, jämn fukt.', 'Trivs i halvskugga, särskilt i sommarvärmen.', 'Gödsla lätt varannan vecka.', 'Så en ny omgång var 3:e vecka.'],
    skörd: 'Klippsallat: klipp ytterbladen med sax när de är minst handstora, låt mitten växa vidare. Huvudsallat: skörda hela plantan när huvudet känns fast och fyllt när du trycker lätt på det.',
    tips: 'Kan gå i frö snabbt i juli–augusti. Välj värmetåliga sorter som "Batavia".',
    companionGood: ['morotter', 'radisor'], companionBad: [],
    vattning: 'Vattna regelbundet så jorden hålls jämnt fuktig, aldrig helt torr - sallat har grunda rötter och stressas snabbt av torka, vilket gör den bitter och får den att gå i blom fortare. Räkna med vattning varannan till var tredje dag i normalt väder, dagligen vid värmebölja.',
    problem: [
      { symptom: 'Bladen smakar bittert.', orsak: 'Värmestress eller torka - sallat trivs bäst i svalare väder och blir bitter av påfrestning.', atgard: 'Vattna mer regelbundet och välj värmetåliga sorter som Batavia för sommarsådd. Din halvskuggiga odlingsplats hjälper redan här genom att undvika den värsta middagshettan.' },
      { symptom: 'Hål i bladen, ofta med blanka slemspår.', orsak: 'Sniglar - ett av de vanligaste problemen med sallat, särskilt i fuktig väderlek.', atgard: 'Plocka bort sniglar för hand kvällstid eller tidig morgon, använd ölfällor, eller strö ut skalgrus/kaffesump runt plantorna som barriär.' },
      { symptom: 'Plantan skjuter upp en hög stjälk och blommar.', orsak: '"Går i blom" - utlöses av värme och långa dagar, snabbare hos huvudsallat än klippsallat.', atgard: 'Så nya omgångar var 3:e vecka så du alltid har yngre plantor på gång, och skörda i tid innan stjälken börjar sträcka sig.' }
    ]
  },

  radisor: {
    name: 'Rädisor', sub: 'Låg kalori · Fibrer · C-vitamin · Folat',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [3, 7], harvestDays: [21, 28] },
    family: 'kal', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'vila', label: 'Vila' },
      { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså i rader, 15 cm mellanrum. 1–2 cm djupt, 3 cm i raden. Gallra till 5 cm när grott. Gror på 3–7 dagar.' },
    sorter: [{ namn: 'Saxa', beskrivning: 'klassisk, pålitlig' }, { namn: 'Flamboyant', beskrivning: 'avlång, som French Breakfast' }, { namn: 'Riesenbutter', beskrivning: 'stor, håller sig länge' }, { namn: 'Zlata', beskrivning: 'gul, mild' }],
    skotsel: ['Vattna jämnt – ojämn vattning ger sprickor.', 'Ingen gödning behövs.', 'Så om varannan vecka.'],
    skörd: 'Redo på 3–4 veckor efter sådd, vid 2–3 cm diameter - toppen av roten syns ofta titta upp ur jorden när den är mogen. Dra försiktigt upp en för att kontrollera storleken. Vänta inte för länge: äldre rädisor blir ihåliga och skarpa i smaken.',
    tips: 'Cherry Belle håller sig fin i jorden lite längre utan att bli ihålig.',
    companionGood: ['sallat', 'gurka'], companionBad: [],
    vattning: 'Håll jorden jämnt fuktig hela tiden - hellre lite och ofta än sällan och rikligt. Kolla genom att sticka ner ett finger 1–2 cm: känns det torrt, vattna. I varmt, torrt väder kan det behövas vattning varannan dag eller dagligen i sandig jord; annars räcker oftast 2–3 gånger i veckan. Ojämn vattning (torrt–blött–torrt) är den vanligaste orsaken till sprickor och dålig smak.',
    problem: [
      { symptom: 'Stora hål i bladen.', orsak: 'Jordloppor - små, snabbt hoppande skalbaggar som är mycket vanliga på rädisor och andra korsblommiga växter, särskilt i varmt och torrt väder tidigt på säsongen.', atgard: 'Oftast bara kosmetiskt - roten under jorden klarar sig fint och går bra att äta. Vid kraftigt angrepp: täck raden med fiberduk direkt efter sådd, och vattna mer (jordloppor trivs i torr jord).' },
      { symptom: 'Rädisan är ihålig när du skär upp den.', orsak: 'Har stått kvar i jorden för länge efter att den blivit mogen, eller har vuxit för snabbt på grund av ojämn vattning eller för varmt väder.', atgard: 'Skörda i tid (3–4 veckor, vid 2–3 cm diameter) och håll vattningen jämn. Sorten Riesenbutter håller sig fin lite längre om du missar den perfekta tidpunkten.' },
      { symptom: 'Rädisan har sprickor i skalet.', orsak: 'Ojämn vattning - en torr period följt av mycket vatten på en gång får roten att växa ryckigt och spricka.', atgard: 'Vattna jämnare och oftare i mindre mängd istället för sällan och rikligt.' },
      { symptom: 'Plantan blir bara blast och skjuter i höjden utan att bilda någon rot.', orsak: '"Går i blom" (bolting) - vanligast vid för tät sådd (för lite ljus når varje planta) eller ihållande värme.', atgard: 'Gallra tidigt till rätt avstånd (5 cm) och så en ny omgång om vädret blir för varmt - rädisor trivs bäst i svalare väderlek vår och höst.' }
    ]
  },

  sockerartor: {
    name: 'Sockerärtor', sub: 'Protein · Fibrer · C-vitamin · B-vitamin',
    zone: 'skugga', maintenance: 'medel',
    growth: { germinateDays: [8, 12], harvestDays: [60, 70] },
    family: 'baljvaxt', feederType: 'builder',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 3–4 cm djupt, 8–10 cm mellanrum. Behöver stöd – pinnar eller nät. Häcken bakom lådorna är perfekt att luta dem mot.' },
    skotsel: ['Vattna regelbundet, extra viktigt vid blomning.', 'Ingen gödning – fixerar eget kväve.', 'Se till att stöd finns tidigt.'],
    skörd: 'Skörda löpande när baljorna är fyllda men fortfarande gröna, blanka och krispiga - innan de börjar bli sega eller gulaktiga.',
    tips: 'Tidig sådd i april ger kraftiga plantor.',
    companionGood: ['morotter', 'radisor'], companionBad: ['lok', 'vitlok'],
    vattning: 'Vattna regelbundet, och extra rikligt när plantorna blommar och sätter baljor - det är då de är känsligast för torka, och vattenbrist ger färre och mindre baljor. I normalt väder räcker 2–3 gånger i veckan, oftare vid långvarig torka.',
    problem: [
      { symptom: 'Unga skott och blad är avbitna, ibland hela plantor nedbetade.', orsak: 'Rådjur - särskilt tidigt på säsongen innan plantorna hunnit bli kraftiga och mindre attraktiva.', atgard: 'Sätt upp ett enkelt nät eller staket runt lådan under uppstartsfasen, ta bort det när plantorna blivit kraftigare.' },
      { symptom: 'Täta kluster av små löss längst upp på skotten.', orsak: 'Bladlöss - dras ofta till unga, mjuka skott.', atgard: 'Spola bort med en vattenstråle, eller nyp av toppskotten där lössen samlas (fungerar ofta bra på ärtväxter). Dill eller ringblomma i närheten lockar till sig nyckelpigor och blomflugor som äter upp bladlössen.' },
      { symptom: 'Vita, mjöliga fläckar på bladen sent på säsongen.', orsak: 'Mjöldagg - vanligt i augusti när nätterna blir svalare och fuktigare samtidigt som dagarna fortfarande är varma.', atgard: 'Ge plantorna gott om luft mellan sig och undvik att vattna direkt på bladen. Sent på säsongen är det sällan värt att behandla mer aktivt - skörda det du kan innan angreppet tar över.' }
    ]
  },

  bondbona: {
    name: 'Bondböna', sub: 'Protein · Fibrer · Järn · Folat',
    zone: 'skugga', maintenance: 'medel',
    growth: { germinateDays: [10, 14], harvestDays: [85, 100] },
    family: 'baljvaxt', feederType: 'builder',
    perioder: [
      { cls: 'så', label: 'Så (apr)' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april, 5 cm djupt, 20 cm mellanrum. Tål kyla och lätt frost. Gror på 10–14 dagar. Behöver stöd när den blir stor.' },
    sorter: [{ namn: 'Witkiem', beskrivning: 'tidig, tålig, bra förstaval' }, { namn: 'Superaguadulce', beskrivning: 'klassiker, stor böna' }, { namn: 'Extra precoce a grano violetto', beskrivning: 'extra tidig, violetta bönor' }, { namn: 'Karmazyn', beskrivning: 'röda bönor, ovanlig' }],
    skotsel: ['Torktålig – vattna när ytan torkat.', 'Ingen gödning behövs.', 'Nyp av toppskotten när första baljorna syns (frivilligt, hämmar bladlöss).'],
    skörd: 'Skörda baljorna när de är fyllda men ännu mjuka, innan de gulnar och blir sega - klämmer du lätt på en balja ska bönorna kännas fasta men inte hårda.',
    tips: 'Massor av svarta bladlöss på topparna? Nyp bort toppskotten.',
    companionGood: ['potatis'], companionBad: ['lok', 'vitlok'],
    vattning: 'Ganska torktålig jämfört med de flesta grönsaker - vattna när jordytan känns torr, inte efter ett fast schema. Viktigast att hålla jämn fukt är under blomning och tidig baljsättning, då torka ger färre baljor.',
    problem: [
      { symptom: 'Unga plantor är avbitna eller kraftigt nedätna.', orsak: 'Rådjur - tycker särskilt om unga, mjuka bondbönsplantor.', atgard: 'Skydda med nät tills plantorna är stadiga och lite kraftigare, ta sedan bort nätet.' },
      { symptom: 'Tjocka, svarta kluster av löss längst upp på stjälkarna.', orsak: 'Svart bönlus - samlas nästan alltid på just toppskotten hos bondböna, sällan någon annanstans på plantan.', atgard: 'Nyp bort toppskotten så fort första baljorna satt sig - det är där lössen sitter, och plantan mognar sina baljor fint ändå. Ringblomma eller dill i närheten drar till sig nyckelpigor som äter bladlöss.' }
    ]
  },

  pakchoi: {
    name: 'Pak choi', sub: 'Låg kalori · K-vitamin · Kalcium · C-vitamin',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [4, 7], harvestDays: [30, 45] },
    family: 'kal', feederType: 'light',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' },
      { cls: 'så', label: 'Så' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså från juli, 1 cm djupt, 25 cm mellanrum. Bra som eftergröda efter t.ex. vitlök eller rädisor.' },
    sorter: [{ namn: 'Joi Choi', beskrivning: 'robust och populär' }],
    skotsel: ['Vattna regelbundet – torka kan driva den i frö.', 'Gödsla lätt en gång i veckan.', 'Trivs i halvskugga under augustihettan.'],
    skörd: 'Skörda hela plantan vid roten när den är fyllig och kompakt (efter ca 4–6 veckor), eller plocka ytterblad löpande under tiden.',
    tips: 'Perfekt att så direkt efter vitlöksskörden – lådan utnyttjas maximalt.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna regelbundet och jämnt, gärna 3–4 gånger i veckan i augustivärmen - pak choi går lätt i blom vid torkstress, vilket helt stoppar bladtillväxten.',
    problem: [
      { symptom: 'Många små hål i bladen.', orsak: 'Jordloppor - vanliga på alla korsblommiga växter (samma familj som kål och rädisa), extra aktiva i varmt, torrt väder.', atgard: 'Täck med fiberduk direkt efter sådd om angreppet är kraftigt. Håll jorden fuktig, jordloppor trivs sämre då.' },
      { symptom: 'Plantan skjuter en hög stjälk med blomknoppar istället för att bilda ett fylligt huvud.', orsak: '"Går i blom" - utlöst av torka, värme eller kyla i tidigt stadium.', atgard: 'Håll jämn vattning och så inte för tidigt på våren när nätterna fortfarande är kalla - juli är bättre timing än maj för pak choi.' }
    ]
  },

  hostrattika: {
    name: 'Hösträttika', sub: 'Låg kalori · C-vitamin · Fibrer · Folat',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [5, 10], harvestDays: [56, 70] },
    family: 'kal', feederType: 'light',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' },
      { cls: 'så', label: 'Så (jul)' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså juli–tidig augusti, 1–2 cm djupt, 20–25 cm mellanrum (gallra). Juli är perfekt timing.' },
    sorter: [{ namn: 'China Rose', beskrivning: 'rosa/röd, pålitlig' }, { namn: 'Minowase', beskrivning: 'daikon-typ, lång och produktiv' }],
    skotsel: ['Vattna jämnt – ojämnt ger sprickor.', 'Ingen gödning behövs.', 'Tål lite frost.'],
    skörd: 'Redo efter 8–10 veckor, ofta oktober–november. Dra upp en för att kolla storlek - bra skördestorlek är ca 10–15 cm i diameter beroende på sort. Förvara svalt och mörkt, håller sig länge.',
    tips: 'Bra eftergröda till vitlök i samma låda.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna jämnt hela säsongen - precis som rädisor är hösträttika känslig för ojämn vattning, som ger sprickor och en skarpare, obehagligare smak. Räkna med 2–3 gånger i veckan i normalt väder.',
    problem: [
      { symptom: 'Rättikan har djupa sprickor.', orsak: 'Ojämn vattning - en torr period följt av rikligt vatten på en gång får roten att växa ryckigt.', atgard: 'Vattna jämnare och oftare i mindre mängd. Skörda gärna innan de blir alltför stora, mindre rötter spricker mer sällan.' },
      { symptom: 'Hål i bladen.', orsak: 'Jordloppor - samma korsblommiga familj som kål och rädisa, drabbas av samma skadedjur.', atgard: 'Påverkar sällan roten under jorden. Täck med fiberduk vid kraftigt angrepp.' }
    ]
  },

  gronkal: {
    name: 'Grönkål', sub: 'Mycket näringstät · K-vitamin · C-vitamin · Kalcium',
    zone: 'skugga', maintenance: 'latt',
    growth: { harvestDays: [60, 80] },
    family: 'kal', feederType: 'heavy',
    perioder: [
      { cls: 'så', label: 'Så inne / plantera' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Så inne eller köp planta', text: 'Så inomhus i april eller köp färdig planta, plantera ut i maj–juni med 40 cm mellanrum. Klarar halvskugga bra.' },
    skotsel: ['Vattna regelbundet.', 'Gödsla lätt en gång i månaden.', 'Sätt upp insektsnät mot kålfjärilar direkt vid plantering (engångsåtgärd, inte löpande skötsel).'],
    skörd: 'Plocka de nedre, äldre bladen löpande - nya blad bildas hela tiden i toppen. Smakar som bäst och blir sötare efter första frosten, då plantan bildar mer socker som frostskydd.',
    tips: 'En av de mest näringstäta grödorna du kan odla – och den blir godare av kyla.',
    companionGood: ['dill'], companionBad: ['jordgubbar', 'tomat'],
    vattning: 'Vattna regelbundet, ca 2–3 gånger i veckan - grönkål klarar kortare torrperioder bättre än de flesta kålsorter men växer långsammare och blir segare i bladen om den får torka ut ofta.',
    problem: [
      { symptom: 'Bladen är fulla av hål, ibland bara bladnerverna kvar.', orsak: 'Kålfjärilslarver (kålmask) - de gröna larverna äter effektivt av bladen under sommaren, äggen läggs av vita och kålfjärilar.', atgard: 'Insektsnät direkt vid plantering är det mest pålitliga skyddet och stoppar fjärilarna från att lägga ägg överhuvudtaget. Upptäcker du redan larver: plocka bort dem för hand, titta särskilt på undersidan av bladen.' },
      { symptom: 'Kålblad är avbitna eller hela plantor nedätna.', orsak: 'Rådjur - äter gärna kålblad om de kommer åt.', atgard: 'Ett nät eller staket runt lådan är det mest pålitliga skyddet.' },
      { symptom: 'Små, runda hål, plantan verkar "skjuten med hagel".', orsak: 'Jordloppor - vanliga tidigt på säsongen på unga kålplantor.', atgard: 'Insektsnätet som skyddar mot kålfjärilar hjälper ofta även här. Äldre, mer etablerade plantor klarar sig oftast bra ändå.' }
    ]
  },

  mangold: {
    name: 'Mangold', sub: 'Näringstät · K-vitamin · Magnesium · Järn',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [7, 10], harvestDays: [50, 60] },
    family: 'spenatvaxt', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 2 cm djupt, 30 cm mellanrum. Klarar halvskugga bra.' },
    skotsel: ['Vattna regelbundet.', 'Gödsla lätt varannan månad.', 'Väldigt lättskött rent generellt.'],
    skörd: 'Skörda ytterbladen löpande när de är minst 15–20 cm långa, låt mitten växa vidare – ger skörd kontinuerligt hela säsongen ända in på hösten.',
    tips: 'En av de mest produktiva bladgrönsakerna – en planta räcker länge.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna regelbundet, 2–3 gånger i veckan - mangold är förlåtande och klarar kortare torka bättre än de flesta bladgrönsaker, men jämn vattning ger mörkare, saftigare blad.',
    problem: [
      { symptom: 'Vita eller ljusa, slingrande gångar inuti bladen.', orsak: 'Minerarflugans larver - gräver sig fram mellan bladets ytskikt och lämnar synliga "tunnlar".', atgard: 'Klipp bort och släng de drabbade bladen, nya friska blad kommer. Sällan ett stort problem eftersom mangold ständigt bildar nya blad.' },
      { symptom: 'Hål i bladen med blanka slemspår.', orsak: 'Sniglar.', atgard: 'Plocka bort för hand kvällstid, eller använd ölfällor runt plantorna.' }
    ]
  },

  purjolok: {
    name: 'Purjolök', sub: 'Lagrar bra · K-vitamin · Folat',
    zone: 'skugga', maintenance: 'latt',
    growth: { harvestDays: [90, 120] },
    family: 'lok', feederType: 'heavy',
    perioder: [
      { cls: 'så', label: 'Plantera' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Plantera små plantor', text: 'Köp små plantor eller så inomhus i mars, plantera ut i maj i 15 cm djupa fåror, 15 cm mellanrum. Fyll på jord runt stjälken över säsongen för mer vitt skaft (frivilligt).' },
    skotsel: ['Vattna regelbundet.', 'Gödsla lätt en gång i månaden.', 'Kan stå kvar i jorden och skördas efter behov, även efter frost.'],
    skörd: 'Dra upp vid behov från augusti och framåt, när skaftet är minst 2 cm tjockt. Kan lämnas kvar i jorden och skördas löpande hela hösten och vintern - en naturlig "jordkällare". Lagrar även bra uppdragen, i kyl eller jordkällare.',
    tips: 'En av de mest lättskötta lagringsgrödorna – bara plantera och vänta.',
    companionGood: ['morotter'], companionBad: ['bondbona'],
    vattning: 'Vattna regelbundet, 2 gånger i veckan i normalt väder - purjolök har grunda rötter och gynnas av jämn fukt, särskilt under den aktiva växtperioden juni–augusti.',
    problem: [
      { symptom: 'Bladen har långa, ljusa/vita ränder eller fläckar.', orsak: 'Purjolöksmal eller purjolöksrost (svampsjukdom) - rost är vanligast i fuktiga somrar.', atgard: 'Ta bort värst angripna blad. Rost är sällan farligt för hela plantan - det underjordiska skaftet klarar sig oftast fint ändå.' },
      { symptom: 'Skaftet är mjukt eller ruttet vid basen.', orsak: 'Lökröta - gynnas av för blöt, dåligt dränerad jord.', atgard: 'Undvik övervattning och se till att jorden dränerar bra. Ta bort drabbade plantor för att undvika spridning.' }
    ]
  },

  jordartskocka: {
    name: 'Jordärtskocka', sub: 'Mycket hög avkastning · Fibrer (inulin) · Kalium',
    zone: 'skugga', maintenance: 'latt',
    growth: { harvestDays: [150, 180] },
    family: 'korgblommig', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Plantera knölar' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vila (mognar)' }, { cls: 'skörda', label: 'Skörda hela vintern' }
    ],
    plantering: { titel: 'Plantera knölar', text: 'Plantera knölar i april, 10 cm djupt, 40 cm mellanrum. Extremt lättodlad – växer nästan som ogräs.' },
    skotsel: ['Vattna vid långvarig torka, annars sköter den sig själv.', 'Ingen gödning behövs.', 'Kan bli hög (2–3 m) – plantera där den inte skuggar annat.'],
    skörd: 'Gräv upp knölar vid behov från oktober och hela vintern, direkt när du vill använda dem – de lagrar bäst kvar i jorden snarare än uppgrävda.',
    tips: 'Sprider sig lätt – plantera i en avgränsad låda om du inte vill ha den överallt nästa år.',
    companionGood: [], companionBad: [],
    vattning: 'En av de mest torktåliga grödorna i banken - klarar sig utan extra vattning i normalt svenskt sommarväder. Vattna bara vid långvarig, svår torka (flera veckor utan regn).',
    problem: [
      { symptom: 'Plantan har spridit sig långt utanför lådan nästa säsong.', orsak: 'Jordärtskocka sprider sig aggressivt via kvarlämnade knölbitar i jorden - i princip omöjligt att skörda upp varenda knöl.', atgard: 'Gräv upp så mycket som möjligt av det du inte vill ha kvar på våren innan nya skott kommer upp. Bäst att förebygga genom att plantera i en tydligt avgränsad låda från början.' }
    ]
  },

  vitlok: {
    name: 'Vitlök', sub: 'Prebiotika · Allicin · Immunförsvar · Antioxidanter',
    zone: 'skugga', maintenance: 'latt',
    growth: { harvestDays: [270, 300] },
    family: 'lok', feederType: 'light',
    perioder: [
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda (jul)' }, { cls: 'vila', label: 'Vila' },
      { cls: 'så', label: 'Plantera klyftor (sep)' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Plantera klyftor i september', text: 'Dela ett vitlökshuvud i klyftor. Plantera september–oktober, spets uppåt, 5 cm djupt, 10–15 cm mellanrum. Övervintrar utan skötsel.' },
    skotsel: ['Minimal skötsel – vattna vid torka.', 'Lätt kvävegödning på våren när bladen syns.', 'Lämnar välmående jord efter sig – bra förväxt.'],
    skörd: 'Skörda i juli när bladen gulnar och böjer sig ner mot marken - det är då huvudena är mogna. Låt torka i solen några dagar (eller inomhus vid regn) innan förvaring.',
    tips: 'Lådan frigörs i juli – perfekt timing för hösträttika eller pak choi som eftergröda.',
    companionGood: ['morotter'], companionBad: ['bondbona', 'sockerartor'],
    vattning: 'Minimal vattning behövs - vitlök klarar sig bra på naturlig nederbörd i Uppland de flesta år. Vattna bara vid längre torrperioder under våren, och sluta helt med vattning ca 3–4 veckor innan skörd så huvudena hinner torka och lagra bättre.',
    problem: [
      { symptom: 'Bladen gulnar och vissnar redan i juni, tidigare än förväntat.', orsak: 'Kan vara helt normalt (tidig sort) eller tecken på vitlöksröta/svampangrepp om det sker mycket tidigt och ojämnt.', atgard: 'Gräv försiktigt upp en planta och kolla - om huvudet ser friskt och format ut kan du skörda tidigt. Ser klyftorna missfärgade eller mjuka ut, ta bort och kasta plantan (inte i komposten) för att undvika spridning.' },
      { symptom: 'Huvudet är löst eller klyftorna har redan börjat separera i jorden.', orsak: 'Har stått för länge efter mognad, eller för ojämn vattning under tillväxten.', atgard: 'Skörda direkt när bladen böjer sig ner - vänta inte för länge efter det tecknet.' }
    ]
  },

  // ---------- SOL-ZON (4 lådor, sol hela dagen) ----------

  potatis: {
    name: 'Potatis', sub: 'Mycket hög avkastning · Kalium · C-vitamin · Fibrer',
    zone: 'sol', maintenance: 'latt',
    growth: { harvestDays: [70, 110] },
    family: 'nattskatta', feederType: 'heavy',
    perioder: [
      { cls: 'så', label: 'Sätt sättpotatis' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Sätt sättpotatis', text: 'Förgro sättpotatis ljust och svalt i april. Sätt ut i maj, 10 cm djupt, 30 cm mellanrum.' },
    skotsel: ['Vattna regelbundet, mer vid knölbildning.', 'Kupa jord runt stjälkarna 1–2 gånger (frivilligt, ger mer skörd men inte ett krav).', 'Annars bara vänta.'],
    skörd: 'Förstaskörd (färskpotatis) när plantan blommar, ca juli - gräv försiktigt fram några knölar vid roten som ett test. Lagringspotatis: gräv upp i augusti–september när hela blasten vissnat och gulnat, låt torka i skugga en dag innan förvaring i mörkt och svalt.',
    tips: 'En av de mest skötselfria grödorna som ändå ger enorm skörd per kvadratmeter.',
    companionGood: ['bondbona'], companionBad: ['tomat', 'gurka', 'squash'],
    vattning: 'Vattna regelbundet, särskilt viktigt när knölarna börjar bildas (från blomning och framåt) - torka under den här perioden ger färre och mindre knölar. Räkna med 2–3 gånger i veckan i normalt väder.',
    problem: [
      { symptom: 'Bruna, snabbt växande fläckar på bladen, ofta efter en fuktig period, hela plantan kan vissna ner på några dagar.', orsak: 'Potatisbladmögel - den allvarligaste potatissjukdomen i svenskt klimat, gynnas kraftigt av fukt och sprids snabbt mellan plantor.', atgard: 'Ta bort och kasta (inte kompostera) angripna blad/plantor så fort du ser det. Ge plantorna gott om utrymme för luftcirkulation och undvik att vattna på bladen. Om blasten är angripen men knölarna verkar friska: skörda tidigt hellre än att vänta.' },
      { symptom: 'Gröna partier på potatisen.', orsak: 'Knölen har fått ljus, vilket bildar solanin - giftigt i större mängder.', atgard: 'Kupa jord runt stjälkarna så knölarna hålls täckta, och skär bort gröna partier helt innan tillagning.' },
      { symptom: 'Hål i knölarna, ibland med små larver inuti.', orsak: 'Potatisbagge (Coloradoskalbagge, ovanlig men förekommer) eller trådmask.', atgard: 'Kolla undersidan av blad efter gula/orange äggkluster och plocka bort för hand. Växelbruk (byt låda för potatis år från år) minskar trådmaskproblem.' }
    ]
  },

  morotter: {
    name: 'Morötter', sub: 'Mycket bra lagring · Betakaroten · Fibrer',
    zone: 'sol', maintenance: 'latt',
    growth: { germinateDays: [14, 21], harvestDays: [65, 80] },
    family: 'flockblommig', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 1 cm djupt, rader 20 cm mellanrum. Gallra en gång till 3–5 cm när de grott (enda ingreppet utöver vattning).' },
    skotsel: ['Vattna jämnt – ojämn vattning ger delade rötter.', 'Ingen gödning behövs.'],
    skörd: 'Redo från augusti, ca 65–80 dagar efter sådd. Dra försiktigt upp en morot för att kolla storlek - full längd och en tydlig orange färg är tecken på mogen morot. Kan lämnas i jorden till första frosten (smaken blir sötare av kylan), eller lagras i kyl/jordkällare i månader.',
    tips: 'En av de bästa grödorna för lagring – smaken blir ofta bättre efter lätt frost.',
    companionGood: ['lok', 'salladslok', 'sallat', 'purjolok', 'vitlok'], companionBad: ['dill'],
    vattning: 'Vattna jämnt och regelbundet, 2 gånger i veckan i normalt väder - ojämn vattning (torrt följt av mycket vatten) är den vanligaste orsaken till delade eller deformerade rötter. Extra viktigt att hålla jämnt fuktigt under groningen (de första 2–3 veckorna).',
    problem: [
      { symptom: 'Roten har delat sig i flera "ben" istället för att växa som en rak morot.', orsak: 'Ojämn vattning, eller stenar/kompakt jord som roten stött på och tvingats växa runt.', atgard: 'Vattna jämnare, och sikta bort de största stenarna ur jorden innan sådd nästa gång. Smakmässigt påverkas inte moroten - bara utseendet.' },
      { symptom: 'Bruna, inkurvade gångar/tunnlar i själva roten när du skär upp den.', orsak: 'Morotsfluga - flugans larver gräver sig in i roten, ett av de vanligaste morotsproblemen.', atgard: 'Täck raden med fiberduk direkt efter sådd - det är i princip det enda pålitliga skyddet. Lök i närheten (redan en av dina kompanjoner) kan enligt tradition hjälpa maskera doften som lockar flugan, men fiberduk är det som faktiskt är bevisat pålitligt.' },
      { symptom: 'De grönaktiga topparna på rötterna som sticker upp ur jorden.', orsak: 'Roten har fått ljus, precis som hos potatis - ofarligt men kan smaka bittrare.', atgard: 'Kupa lite jord över de exponerade topparna när du ser dem.' }
    ]
  },

  rodbetor: {
    name: 'Rödbetor', sub: 'Utmärkt lagring · Folat · Nitrat · Antioxidanter',
    zone: 'sol', maintenance: 'latt',
    growth: { germinateDays: [7, 14], harvestDays: [55, 70] },
    family: 'spenatvaxt', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså maj, 2 cm djupt, 30 cm mellan rader. Gallra till 10 cm mellanrum när de grott.' },
    skotsel: ['Vattna jämnt.', 'Ingen gödning behövs.'],
    skörd: 'Redo på 8–10 veckor, vid ca 5–8 cm diameter för bäst smak (större blir träigare). Dra upp en för att kolla. Lagrar utmärkt i kyl eller jordkällare hela vintern.',
    tips: 'Bladen är också ätbara – som mangold.',
    companionGood: ['lok'], companionBad: ['bondbona'],
    vattning: 'Vattna jämnt, 2 gånger i veckan i normalt väder - liksom morötter ger ojämn vattning sämre resultat, här i form av träiga eller sprickiga rötter snarare än delade.',
    problem: [
      { symptom: 'Roten känns träig och seg när den tillagas.', orsak: 'Har blivit för stor/gammal, eller har fått för lite vatten under tillväxten.', atgard: 'Skörda vid 5–8 cm istället för att låta dem bli stora, och håll jämnare vattning.' },
      { symptom: 'Hål i bladen.', orsak: 'Sniglar eller jordloppor, båda vanliga men sällan allvarliga för rödbetor eftersom det är roten och inte bladen du är ute efter.', atgard: 'Ingen åtgärd oftast nödvändig om bara bladen är drabbade - roten växer opåverkad under jorden.' }
    ]
  },

  lok: {
    name: 'Gul lök (sättlök)', sub: 'Lagrar mycket länge · Antioxidanter · Prebiotika',
    zone: 'sol', maintenance: 'latt',
    growth: { harvestDays: [90, 110] },
    family: 'lok', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Sätt sättlök' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Sätt sättlök', text: 'Sätt sättlök i april, spets uppåt, precis under jordytan, 10 cm mellanrum. Förmodligen den enklaste grödan av alla.' },
    skotsel: ['Vattna vid torka.', 'Ingen gödning behövs.', 'Sluta vattna någon vecka innan skörd.'],
    skörd: 'Skörda i augusti när minst hälften av blasten fallit ihop och börjat gulna av sig själv - dra inte upp löken för tidigt, låt den mogna klart i jorden. Låt sedan torka i solen några dagar (skal vänds utåt). Lagrar i månader svalt och torrt.',
    tips: 'Mycket få saker kan gå fel med sättlök – ett tryggt förstaval.',
    companionGood: ['morotter', 'jordgubbar', 'rodbetor'], companionBad: ['bondbona', 'sockerartor'],
    vattning: 'Vattna vid torka, ca 1–2 gånger i veckan under tillväxten. Sluta vattna helt 2–3 veckor innan förväntad skörd så löken hinner torka av och lagrar bättre - fortsatt vattning nära skörd kan ge mjukare lök som ruttnar snabbare i förvaring.',
    problem: [
      { symptom: 'Löken är mjuk eller ruttnar redan i jorden.', orsak: 'För mycket fukt, ofta pga dåligt dränerad jord eller fortsatt vattning för nära skörd.', atgard: 'Sluta vattna i god tid innan skörd, och undvik att plantera i lågt liggande, blöta delar av lådan.' },
      { symptom: 'Blomstjälk skjuter upp mitt i löken.', orsak: '"Går i blom" - kan hända om sättlöken utsatts för kyla tidigt (kallchock) eller är av dålig kvalitet.', atgard: 'Skörda den löken direkt, den slutar växa på bredden när den gått i blom. Förvara sättlök torrt och svalt (inte i kylskåp) innan plantering för att undvika kallchock.' }
    ]
  },

  palsternacka: {
    name: 'Palsternacka', sub: 'Mycket bra lagring · Fibrer · Folat · Kalium',
    zone: 'sol', maintenance: 'latt',
    growth: { germinateDays: [14, 21], harvestDays: [100, 120] },
    family: 'flockblommig', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vila', label: 'Mognar' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 2 cm djupt, 20 cm mellanrum. Långsam grodd (2–3 veckor) – ha tålamod.' },
    skotsel: ['Vattna jämnt de första veckorna.', 'Ingen gödning behövs.', 'I princip skötselfri efter groning.'],
    skörd: 'Kan lämnas i jorden till efter första frosten – smaken blir tydligt sötare av kylan (samma princip som palsternackans släkting, morötter). Skörda oktober–november, eller lämna kvar och gräv upp under vintern när marken inte är helt frusen.',
    tips: 'En ofta förbisedd men extremt lättskött och näringsrik lagringsgröda.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna jämnt de första 3–4 veckorna medan groddarna etablerar sig (grodden är långsam, ha tålamod). Därefter i princip skötselfri - vattna bara vid långvarig torka.',
    problem: [
      { symptom: 'Fröna gror inte alls eller väldigt ojämnt.', orsak: 'Palsternackfrö har kort grobarhet och gror ovanligt långsamt (2–3 veckor) jämfört med de flesta andra grödor - lätt att tro att sådden misslyckats.', atgard: 'Använd alltid färska frön (helst samma säsong de köptes) och ha tålamod - vänta minst 3 veckor innan du drar slutsatsen att sådden misslyckats.' },
      { symptom: 'Roten har delat sig i flera grenar.', orsak: 'Stenar eller kompakt jord som roten vuxit runt, eller ojämn vattning.', atgard: 'Sikta bort stora stenar ur jorden innan sådd. Påverkar bara utseendet, inte smaken.' }
    ]
  },

  vitkal: {
    name: 'Vitkål', sub: 'Mycket bra lagring · C-vitamin · Fibrer',
    zone: 'sol', maintenance: 'latt',
    growth: { harvestDays: [70, 90] },
    family: 'kal', feederType: 'heavy',
    perioder: [
      { cls: 'så', label: 'Så inne / plantera' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta eller så inne', text: 'Så inomhus i april eller köp planta, sätt ut i juni med 40–50 cm mellanrum – kräver full sol och gott om plats.' },
    skotsel: ['Vattna rikligt och jämnt.', 'Gödsla en gång i månaden.', 'Sätt upp insektsnät mot kålfjärilar direkt vid plantering (engångsåtgärd).'],
    skörd: 'Skörda när huvudet känns fast och tungt när du trycker på det och klämmer lätt runt om - inte längre mjukt eller "luftigt". Ofta september–oktober. Lagrar i veckor till månader svalt och mörkt.',
    tips: 'Kräver mer plats än de flesta grödor men lönar sig i lagringsvärde.',
    companionGood: ['dill'], companionBad: ['jordgubbar', 'tomat'],
    vattning: 'Vattna rikligt och jämnt, gärna 3 gånger i veckan - vitkål bildar stora, vattenrika huvuden och är känsligare för torka än de flesta kålsorter. Ojämn vattning (särskilt en lång torrperiod följt av kraftigt regn) kan få huvuden att spricka.',
    problem: [
      { symptom: 'Bladen är fulla av hål, ibland bara nerverna kvar.', orsak: 'Kålfjärilslarver (kålmask) - äter effektivt av bladen under sommaren.', atgard: 'Insektsnät direkt vid plantering är det mest pålitliga skyddet. Upptäcker du redan larver: plocka bort dem för hand, titta på undersidan av bladen.' },
      { symptom: 'Kålhuvudet har spruckit.', orsak: 'Kraftigt regn eller vattning efter en längre torrperiod - huvudet suger upp vatten snabbare än det yttre skalet hinner växa.', atgard: 'Vattna jämnare över säsongen. Ett spruckit huvud går fortfarande bra att äta, men skörda det direkt innan det ruttnar i sprickan.' },
      { symptom: 'Kålblad avbitna eller hela plantor nedätna.', orsak: 'Rådjur - mycket förtjusta i kål.', atgard: 'Ett nät eller staket runt lådan rekommenderas starkt om du har rådjur i närheten.' }
    ]
  },

  tomat: {
    name: 'Tomat', sub: 'Näringsrik · Lykopen · C-vitamin · Kalium',
    zone: 'sol', maintenance: 'krav',
    growth: { harvestDays: [60, 80] },
    family: 'nattskatta', feederType: 'heavy',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Slut' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp färdig planta, plantera på varmaste platsen efter frostrisken passerat (ca juni). Sätt upp stöd/pinne direkt vid plantering.' },
    skotsel: ['Vattna jämnt vid roten, aldrig på bladen.', 'Gödsla med tomatnäring varannan vecka.', 'Nyp bort sidoskott ("amputera") löpande genom säsongen – detta är den skötsel du tyckte var jobbig.', 'Bind upp stammen mot stödet allt eftersom den växer.'],
    skörd: 'Plocka när frukterna är helt genomfärgade (röda, gula etc. beroende på sort) och lossnar lätt med ett litet ryck. I slutet av säsongen (september): plocka gröna frukter innan första frosten och eftermogna dem inomhus i fönsterkarmen, gärna bredvid ett moget äpple som påskyndar mognaden.',
    tips: 'Den mest skötselkrävande grödan i den här banken – flaggas medvetet som krävande. Bladmögel/torrfläcksjuka är vanligt i fuktiga somrar.',
    companionGood: ['basilika', 'morotter'], companionBad: ['potatis', 'gurka', 'vitkal', 'gronkal'],
    vattning: 'Vattna djupt och jämnt vid roten 2–3 gånger i veckan snarare än lite varje dag - djup, regelbunden vattning ger starkare rötter och jämnare fruktsättning. Ojämn vattning (torrt i flera dagar, sedan mycket vatten) är den vanligaste orsaken till både spruckna frukter och blomändröta (se nedan). Vattna aldrig på bladen - det ökar risken för svampsjukdomar kraftigt.',
    problem: [
      { symptom: 'Bruna, snabbt växande fläckar på blad och stjälk, ofta efter en fuktig period - hela plantan kan vissna på några dagar.', orsak: 'Potatisbladmögel (samma sjukdom som drabbar potatis, eftersom de är samma växtfamilj) - den allvarligaste risken för utomhusodlad tomat i svenskt klimat, gynnas kraftigt av fukt och sval väderlek.', atgard: 'Plantera inte tomat och potatis nära varandra. Ge plantorna gott om utrymme för luftcirkulation, vattna aldrig på bladen, och ta bort angripna blad/plantor direkt (kasta, kompostera inte). Överväg tak/skydd mot regn om problemet återkommer år efter år.' },
      { symptom: 'Bruna fläckar med tydliga koncentriska ringar (som en pilskiva), börjar på de äldsta, nedersta bladen.', orsak: 'Torrfläcksjuka (Alternaria) - vanlig svampsjukdom, mindre akut än bladmögel men sprider sig uppåt i plantan över tid.', atgard: 'Ta bort angripna blad löpande. Undvik att vattna på bladen och se till att de nedersta bladen inte ligger an mot fuktig jord.' },
      { symptom: 'Ett läderartat, insjunket, brunsvart parti i botten av frukten (motsatt stjälken).', orsak: 'Blomändröta - orsakas av kalciumbrist i just den frukten, men den bakomliggande orsaken är nästan alltid ojämn vattning snarare än brist på kalcium i jorden.', atgard: 'Vattna jämnare och mer regelbundet. De drabbade frukterna går inte att rädda, men plocka bort dem så plantan lägger energi på nya frukter istället.' },
      { symptom: 'Frukterna spricker, ofta i cirklar runt stjälkänden.', orsak: 'Snabb vattenupptagning efter en torr period - frukten växer fortare än skalet hinner följa med.', atgard: 'Vattna jämnare över hela säsongen istället för sällan och rikligt.' }
    ]
  },

  gurka: {
    name: 'Gurka', sub: 'Vätskerik · K-vitamin · Kalium',
    zone: 'sol', maintenance: 'medel',
    growth: { harvestDays: [50, 70] },
    family: 'gurkvaxt', feederType: 'heavy',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Slut' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp planta, plantera i varmaste läget i juni. Vill du slippa spaljé/stöd, välj en "buskgurka"-sort som klarar sig utan klätterstöd.' },
    skotsel: ['Vattna rikligt och jämnt, gärna varje dag i värme.', 'Gödsla med tomatnäring varannan vecka.', 'Vinsorter vill ha spaljé att klättra på – buskgurka klarar sig utan.'],
    skörd: 'Plocka löpande vid önskad storlek – ju mer du skördar desto mer producerar plantan. Vänta inte för länge: överstora gurkor blir vattniga och tappar smak, och plantan lägger mindre energi på nya frukter om gamla får hänga kvar.',
    tips: 'Mjöldagg i augustivärme: spraya med utspädd mjölk (1:9) eller ta bort drabbade blad.',
    companionGood: ['dill', 'radisor'], companionBad: ['potatis', 'tomat'],
    vattning: 'Gurka behöver mycket och jämn vatten - den består till största delen av vatten och stressas snabbt av torka. Vattna rikligt vid roten, gärna dagligen i varmt väder, mer sällan (varannan dag) i svalare perioder. Ojämn vattning är den vanligaste orsaken till bitter smak.',
    problem: [
      { symptom: 'Gurkorna smakar beskt/bittert, särskilt vid stjälkänden.', orsak: 'Stress hos plantan, oftast torka eller stora temperaturväxlingar - gurkan bildar då mer av det bittra ämnet cucurbitacin.', atgard: 'Håll vattningen jämnare och rikligare, särskilt i värmeböljor. Skär bort den bittraste biten (närmast stjälken) om det redan hänt.' },
      { symptom: 'Vita, mjöliga fläckar som breder ut sig över bladen, ofta i augusti.', orsak: 'Mjöldagg - mycket vanligt sent på säsongen när nätterna blir svalare och fuktigare.', atgard: 'Spraya med utspädd mjölk (1 del mjölk, 9 delar vatten) på bladen, eller ta bort de värst drabbade bladen. Sällan värt att bekämpa hårt sent på säsongen - skörda det du kan.' },
      { symptom: 'Bladen är gulfläckiga/mosaikmönstrade och plantan växer svagt.', orsak: 'Gurkmosaikvirus - sprids av bladlöss, finns ingen bot.', atgard: 'Ta bort och kasta den angripna plantan för att undvika spridning till andra gurk- och squashplantor. Håll koll på bladlöss tidigt (se kompanjon-tipset för dill) för att minska risken.' }
    ]
  },

  paprika: {
    name: 'Paprika / Chili', sub: 'C-vitamin · Antioxidanter · Capsaicin (chili)',
    zone: 'sol', maintenance: 'krav',
    growth: { harvestDays: [70, 90] },
    family: 'nattskatta', feederType: 'heavy',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp planta, plantera på det allra varmaste och mest lä-skyddade läget. Behöver mer värme än vad Uppland vanligtvis ger.' },
    skotsel: ['Vattna jämnt, undvik stående blöt jord.', 'Gödsla med tomatnäring en gång i veckan.', 'Kan behöva bindas upp när frukterna blir tunga.'],
    skörd: 'Plocka gröna för mildare smak, eller vänta tills de fått sin fulla färg (röd, gul eller orange beroende på sort) för sötare och mer utvecklad smak - paprikan slutar inte mogna efter plockning som tomat, så vänta tills den är precis som du vill ha den.',
    tips: 'Experimentgröda i svenskt klimat, som Padrón – förvänta dig en mindre skörd.',
    companionGood: ['basilika'], companionBad: ['bondbona'],
    vattning: 'Vattna jämnt, låt jordytan torka upp lite mellan vattningarna - paprika ogillar stående blöt jord mer än de flesta av grödorna här. Ungefär 2 gånger i veckan i normalt väder, mer i värme.',
    problem: [
      { symptom: 'Blommorna faller av utan att bilda frukt.', orsak: 'För kalla nätter - paprika är extra känslig och sätter sällan frukt om nattemperaturen upprepat går under ca 15°C, vilket händer även svenska sommarnätter.', atgard: 'Ge plantan den varmaste, mest lä-skyddade platsen du har, gärna nära en vägg som lagrar värme. Förvänta dig en mer varierande skörd år till år beroende på sommarens väder - detta är en gräns för vad som är rimligt i Uppland, inte ett skötselfel.' },
      { symptom: 'Vita eller ljusa, papperslika, insjunkna fläckar på frukten.', orsak: 'Solskador - uppstår när frukten exponeras för stark, direkt sol, ofta efter att skyddande blad tagits bort eller fallit av.', atgard: 'Undvik att beskära bort för mycket bladverk runt frukterna. Redan drabbade frukter går att äta, skär bara bort den skadade biten.' },
      { symptom: 'Klasar av små löss på undersidan av bladen och nya skott.', orsak: 'Bladlöss - vanliga på paprika och chili.', atgard: 'Spola bort med vattenstråle, eller plantera basilika (redan en bra kompanjon) i närheten - dess doft avskräcker en del skadedjur samtidigt som blommande örter lockar nyckelpigor.' }
    ]
  },

  squash: {
    name: 'Squash / Sommarsquash', sub: 'Låg kalori · Fibrer · B-vitamin · Kalium',
    zone: 'sol', maintenance: 'medel', fillsBox: true,
    growth: { harvestDays: [45, 60] },
    family: 'gurkvaxt', feederType: 'heavy',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Slut' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp färdig planta i slutet av maj eller juni. En planta per låda – de blir enorma. Plantera mitt i lådan, vattna rejält direkt efter.' },
    skotsel: ['Vattna rikligt varje dag vid roten, aldrig på bladen.', 'Gödsla med tomatnäring varannan vecka.', 'Om ingen frukt bildas: pollinera för hand med en pensel mellan blommorna.'],
    skörd: 'Plocka vid 15–20 cm längd, medan skalet fortfarande är blankt och mjukt att trycka på. Skörda tidigt och ofta – mer skörd ju mer du plockar, och plantan slutar nästan producera om en frukt får bli jättestor.',
    tips: 'En planta räcker gott och väl - squash är extremt produktiv när den väl kommer igång.',
    companionGood: [], companionBad: ['potatis'],
    vattning: 'Vattna rikligt varje dag i varmt väder, vid roten - squash har stora blad och förlorar mycket vatten genom avdunstning. Minska något vid svalare väderlek men låt aldrig jorden torka ut helt.',
    problem: [
      { symptom: 'Frukten börjar ruttna/bli mjuk och svart i blomänden medan resten fortfarande verkar växa.', orsak: 'Ofullständig pollinering - squash behöver bin eller humlor besöka både han- och honblommor; blir pollineringen ofullständig utvecklas inte hela frukten och änden ruttnar.', atgard: 'Pollinera för hand med en mjuk pensel: för pollen från hanblomman (rak stjälk, ingen liten frukt bakom) till honblomman (har en liten frukt-ansats bakom kronbladen redan innan pollinering).' },
      { symptom: 'Vita, mjöliga fläckar som breder ut sig över bladen.', orsak: 'Mjöldagg - mycket vanligt på squash och andra gurkväxter, särskilt sent på säsongen.', atgard: 'Spraya med utspädd mjölk (1 del mjölk, 9 delar vatten) på bladen, eller ta bort de värst drabbade bladen. Påverkar sällan redan bildade frukter.' }
    ]
  },

  padron: {
    name: 'Pimiento de Padrón', sub: 'Låg kalori · C-vitamin · Capsaicin · Antioxidanter',
    zone: 'sol', maintenance: 'krav',
    growth: { harvestDays: [60, 80] },
    family: 'nattskatta', feederType: 'heavy',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp färdig planta, plantera på varmaste möjliga plats. Padrón är värmekrävande och gynnas av lä.' },
    skotsel: ['Vattna när jorden torkat 2–3 cm ned, inte varje dag.', 'Gödsla med tomatnäring en gång i veckan.', 'Ge den varmaste och solrikaste platsen.'],
    skörd: 'Plocka frukterna gröna och små (3–5 cm) – det är då de har den klassiska milda smaken med en (slumpmässig) stark frukt ibland. Låter du dem bli röda tappar de sin karaktär och blir bara söta.',
    tips: 'Experimentgröda i svenskt klimat – förvänta dig ingen stor skörd, men en av tio är stark!',
    companionGood: [], companionBad: [],
    vattning: 'Vattna måttligt - låt jorden torka ut 2–3 cm ner mellan vattningarna snarare än att hålla den jämnt fuktig. Padrón är mer torktålig än paprika men ogillar stående blöt jord.',
    problem: [
      { symptom: 'Blommorna faller av utan att bilda frukt.', orsak: 'Precis som paprika (samma växtfamilj) är Padrón känslig för kalla nätter och sätter sämre frukt om temperaturen faller mycket under natten.', atgard: 'Ge den varmaste och mest vindskyddade platsen i din odling. En del år ger helt enkelt mindre skörd på grund av sommarens väder - detta är förväntat i vårt klimat, inte ett tecken på att något gjorts fel.' },
      { symptom: 'Frukterna är alla milda, ingen enda är stark.', orsak: 'Slumpen - hur stark en Padrón-frukt blir varierar naturligt även på samma planta, och stress (torka, värme) tenderar att ge fler starka frukter.', atgard: 'Inget att åtgärda - det är själva charmen med grödan. Lite vattenstress kan öka andelen starka frukter om du vill experimentera.' }
    ]
  },

  // ---------- ÖRTER ----------

  basilika: {
    name: 'Basilika', sub: 'Aromatisk · Antioxidanter · K-vitamin',
    zone: 'sol', maintenance: 'medel', effectRadius: 2,
    growth: { harvestDays: [30, 45] },
    family: 'kransblommig', feederType: 'light',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut (efter frost)' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Slut (känslig för kyla)' }
    ],
    plantering: { titel: 'Köp planta eller så inne', text: 'Mycket köldkänslig – plantera ut först i juni när nattfrosten är helt över. Trivs bäst i kruka nära köket eller i den soligaste lådan.' },
    skotsel: ['Vattna jämnt, ogillar att stå blött.', 'Nyp bort blomställningar löpande för att hålla plantan buskig.', 'Klarar inte kyla under +10°C särskilt bra.'],
    skörd: 'Plocka blad löpande, gärna hela toppskott istället för enstaka blad – ju mer du klipper desto buskigare och mer produktiv blir plantan.',
    tips: 'Trivs extra bra tillsammans med tomat, både i jorden och på tallriken.',
    companionGood: ['tomat', 'paprika'], companionBad: [],
    vattning: 'Vattna jämnt vid roten, låt jordytan torka lätt mellan vattningarna - basilika ogillar både uttorkning och stående blöt jord. Räkna med 2–3 gånger i veckan i normalt väder.',
    problem: [
      { symptom: 'Bladen blir svarta eller mörka och sladdriga, ofta efter en kall natt.', orsak: 'Köldskada - basilika är mycket köldkänslig och tar skada redan under ca +10°C, långt innan frost.', atgard: 'Skörda drabbade blad direkt (de går fortfarande att äta om skadan är färsk) och skydda plantan med fiberduk vid kalla nätter, särskilt i början och slutet av säsongen.' },
      { symptom: 'Bladen blir gula och plantan tappar kraft.', orsak: 'Övervattning/stående blöt jord - vanligare orsak än näringsbrist för basilika i lådodling.', atgard: 'Låt jordytan torka upp lite mer mellan vattningarna och kontrollera att lådan har bra dränering.' }
    ]
  },

  timjan: {
    name: 'Timjan', sub: 'Aromatisk · Perenn · Antioxidanter',
    zone: 'sol', maintenance: 'latt', effectRadius: 2,
    growth: { harvestDays: [30, 45] },
    family: 'kransblommig', feederType: 'light',
    perioder: [
      { cls: 'plantera', label: 'Plantera' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Köp planta', text: 'Plantera en liten planta i maj på soligaste, torraste platsen. Perenn – kommer tillbaka år efter år.' },
    skotsel: ['Vattna sparsamt – trivs bäst lite torrt.', 'Ingen gödning behövs.', 'Klipp ner lätt på våren för att hålla den fräsch.'],
    skörd: 'Plocka kvistar året runt (även på vintern om den inte är snötäckt), mest smak precis innan blomning i juni–juli.',
    tips: 'En av de mest skötselfria örterna – nästan omöjlig att misslyckas med.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna sparsamt - timjan kommer ursprungligen från medelhavsklimat och trivs bäst i torr, väldränerad jord. Vattna bara vid längre torrperioder; i normalt svenskt sommarväder klarar den sig oftast på naturlig nederbörd.',
    problem: [
      { symptom: 'Plantan blir gles, vissnar eller ruttnar vid basen.', orsak: 'Rotröta - nästan alltid orsakad av för mycket vatten eller dåligt dränerad jord, det klart vanligaste problemet med medelhavsörter i svenskt klimat.', atgard: 'Vattna mindre och kontrollera att jorden dränerar bra. Blanda gärna i lite sand eller grus i planteringshålet om jorden håller kvar mycket fukt.' }
    ]
  },

  oregano: {
    name: 'Oregano', sub: 'Aromatisk · Perenn · Antioxidanter',
    zone: 'sol', maintenance: 'latt', effectRadius: 2,
    growth: { harvestDays: [30, 45] },
    family: 'kransblommig', feederType: 'light',
    perioder: [
      { cls: 'plantera', label: 'Plantera' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Köp planta', text: 'Plantera i maj på soligt läge. Perenn, sprider sig gärna – ge den egen plats i lådan.' },
    skotsel: ['Vattna sparsamt.', 'Ingen gödning behövs.', 'Klipp ner efter blomning för fräscht nytt bladverk.'],
    skörd: 'Plocka löpande, smakstarkast strax före blomning i juli.',
    tips: 'Lika lättskött som timjan – ett tryggt förstaval för örtlandet.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna sparsamt, samma princip som timjan - oregano kommer från medelhavsklimat och trivs bäst torrt. Vattna bara vid längre torrperioder.',
    problem: [
      { symptom: 'Plantan blir gles eller vissnar vid basen.', orsak: 'Rotröta från för mycket vatten eller dåligt dränerad jord - det klart vanligaste problemet med denna typ av ört i svenskt klimat.', atgard: 'Vattna mindre, och se till att jorden dränerar bra. Blanda gärna i lite sand eller grus vid plantering.' }
    ]
  },

  graslok: {
    name: 'Gräslök', sub: 'Aromatisk · Perenn · K-vitamin',
    zone: 'valfri', maintenance: 'latt', effectRadius: 2,
    growth: { germinateDays: [10, 14], harvestDays: [30, 45] },
    family: 'lok', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Plantera/så' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Plantera planta eller så', text: 'Plantera en planta eller så direkt i april–maj. Klarar både sol och halvskugga. Perenn – kommer tillbaka varje år.' },
    skotsel: ['Vattna vid torka.', 'Ingen gödning behövs.', 'Klipp ner blommande strån för fortsatt bladtillväxt.'],
    skörd: 'Klipp löpande med sax ca 3–5 cm ovanför jorden, växer snabbt tillbaka inom en vecka eller två.',
    tips: 'En av de mest lättodlade örterna – funkar nästan var som helst i lådorna.',
    companionGood: ['morotter'], companionBad: [],
    vattning: 'Vattna vid torka, ca 1–2 gånger i veckan - gräslök är förlåtande men växer långsammare och blir trådigare i smaken om den får torka ut för ofta.',
    problem: [
      { symptom: 'Orangea, rostfärgade prickar eller fläckar på bladen.', orsak: 'Lökrost - en svampsjukdom som ibland drabbar gräslök, särskilt i fuktiga somrar eller tät plantering.', atgard: 'Klipp ner hela beståndet till marken - gräslök återhämtar sig snabbt och nya, friska strån växer upp igen inom ett par veckor.' }
    ]
  },

  persilja: {
    name: 'Persilja', sub: 'Mycket näringstät · K-vitamin · C-vitamin · Järn',
    zone: 'skugga', maintenance: 'latt',
    growth: { germinateDays: [14, 21], harvestDays: [70, 90] },
    family: 'flockblommig', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila (tvåårig)' }
    ],
    plantering: { titel: 'Så eller köp planta', text: 'Så april–maj, grunt (0,5 cm). Långsam grodd (2–4 veckor), ha tålamod. Klarar halvskugga bra.' },
    skotsel: ['Vattna jämnt.', 'Gödsla lätt en gång i månaden.'],
    skörd: 'Plocka ytterstjälkarna löpande med sax nära roten, låt mitten och de nya, inre skotten växa vidare.',
    tips: 'Tvåårig växt – kan ofta övervintra och ge skörd tidigt år två också.',
    companionGood: ['morotter'], companionBad: [],
    vattning: 'Vattna jämnt, 2–3 gånger i veckan - persilja har ett djupare rotsystem än de flesta örter men gynnas ändå av jämn fukt, särskilt under den långsamma groddfasen.',
    problem: [
      { symptom: 'Fröna gror väldigt långsamt eller ojämnt.', orsak: 'Persilja har naturligt långsam och ojämn grodd (2–4 veckor) - helt normalt, inget fel på fröna.', atgard: 'Ha tålamod och håll jorden jämnt fuktig under hela groddperioden. Blötlägg gärna fröna en natt före sådd för att korta ner tiden något.' },
      { symptom: 'Hål i bladen med blanka slemspår.', orsak: 'Sniglar - trivs i persiljans fuktiga, halvskuggiga växtplats.', atgard: 'Plocka bort för hand kvällstid, eller använd ölfällor.' }
    ]
  },

  dill: {
    name: 'Dill', sub: 'Aromatisk · C-vitamin · Antioxidanter',
    zone: 'valfri', maintenance: 'latt', effectRadius: 2,
    growth: { germinateDays: [10, 14], harvestDays: [40, 55] },
    family: 'flockblommig', feederType: 'light',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så direkt', text: 'Direktså april–juli, grunt, i rader eller strö. Så om varannan-var tredje vecka för löpande skörd hela säsongen.' },
    skotsel: ['Vattna jämnt.', 'Ingen gödning behövs.'],
    skörd: 'Klipp blad löpande när plantan är minst 15–20 cm hög. Frödill: låt gå i blom och skörda hela fröställningarna i augusti när fröna bytt färg från grönt till ljusbrunt.',
    tips: 'Trivs bra nära gurka och kål, både i odlingen och i syltburken.',
    companionGood: ['gurka', 'vitkal', 'gronkal'], companionBad: ['morotter'],
    vattning: 'Vattna jämnt, 2 gånger i veckan i normalt väder - torka gör att dill snabbt går i blom och slutar bilda nya, saftiga blad.',
    problem: [
      { symptom: 'Plantan skjuter snabbt i höjden och blommar redan efter några veckor.', orsak: '"Går i blom" - utlöses av värme och torka, snabbare hos dill än hos de flesta andra örter.', atgard: 'Så om i omgångar var 2–3 vecka under sommaren för att alltid ha yngre, bladrika plantor på gång. Redan blommande dill är fortfarande perfekt för fröskörd eller till syltning.' },
      { symptom: 'Klasar av små, gröna eller svarta löss på topparna.', orsak: 'Bladlöss - dill drar faktiskt till sig både bladlöss och deras naturliga fiender (nyckelpigor, blomflugor), vilket är en del av varför den är en bra kompanjonväxt för andra grödor.', atgard: 'Spola bort med vattenstråle vid kraftigt angrepp, men ett måttligt bestånd av bladlöss på dillen kan i praktiken hjälpa till att hålla nyckelpigor kvar i odlingen som sedan äter löss på dina andra växter.' }
    ]
  },

  // ---------- FLER GRÖDOR SOM TRIVS I UPPLAND ----------

  artor: {
    name: 'Gröna ärtor', sub: 'Protein · Fibrer · C-vitamin · B-vitamin',
    zone: 'skugga', maintenance: 'medel',
    growth: { germinateDays: [8, 12], harvestDays: [60, 75] },
    family: 'baljvaxt', feederType: 'builder',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 3–4 cm djupt, 5 cm mellanrum i raden. Behöver klätterstöd (nät eller pinnar), precis som sockerärtor - sätt upp det tidigt.' },
    skotsel: ['Vattna regelbundet, extra viktigt vid blomning och baljsättning.', 'Ingen gödning – fixerar eget kväve.', 'Sätt upp stöd tidigt, innan plantorna blir för höga att hantera.'],
    skörd: 'Skörda när baljorna känns fyllda och rundade men fortfarande är gröna och blanka - känn genom skalet. Till skillnad från sockerärtor äter man bara ärtorna inuti, inte skalet, så vänta tills de fyllts ut ordentligt.',
    tips: 'En klassisk favorit rakt från plantan - få grödor smakar så mycket bättre hemodlade och nyplockade jämfört med köpta.',
    companionGood: ['morotter', 'radisor'], companionBad: ['lok', 'vitlok'],
    vattning: 'Vattna regelbundet, mest kritiskt under blomning och tidig baljsättning - torka då ger färre och mindre baljor. Annars ca 2–3 gånger i veckan i normalt väder.',
    problem: [
      { symptom: 'Vita, mjöliga fläckar på bladen sent på säsongen.', orsak: 'Mjöldagg - vanligt i augusti när nätterna blir svalare och fuktigare.', atgard: 'Ge plantorna gott om luft mellan sig och ta bort de värst angripna bladen. Sällan värt att behandla mer aktivt sent på säsongen.' },
      { symptom: 'Klasar av löss på skotten.', orsak: 'Bladlöss - vanliga på ärtväxter.', atgard: 'Spola bort med vattenstråle. Dill eller ringblomma i närheten lockar till sig nyckelpigor som äter bladlöss.' },
      { symptom: 'Unga plantor avbitna eller nedätna.', orsak: 'Rådjur - särskilt tidigt på säsongen.', atgard: 'Skydda med nät eller staket tills plantorna är stadiga.' }
    ]
  },

  rabarber: {
    name: 'Rabarber', sub: 'Perenn · Fibrer · C-vitamin · Kalium',
    zone: 'valfri', maintenance: 'latt',
    growth: { harvestDays: [365, 730] },
    family: 'syravaxt', feederType: 'heavy',
    perioder: [
      { cls: 'skörda', label: 'Skörda (etablerad)' }, { cls: 'skörda', label: 'Skörda (sista)' },
      { cls: 'vila', label: 'Vila (låt bladen växa)' }, { cls: 'vila', label: 'Vila' },
      { cls: 'vila', label: 'Blasten dör tillbaka' }, { cls: 'vila', label: 'Vintervila' }
    ],
    plantering: { titel: 'Plantera en rotdel/krona', text: 'Plantera tidigt på våren eller på hösten, med gott om utrymme (minst 1 m åt varje håll - den blir stor). Skörda inte alls första året, lätt andra året, och fullt från tredje året - den ovanliga väntetiden med rabarber jämfört med resten av banken.' },
    sorter: [{ namn: 'Victoria', beskrivning: 'klassisk, grön-röd stjälk, mycket pålitlig' }, { namn: 'Livingstone', beskrivning: 'genomgående röd stjälk' }],
    skotsel: ['Gödsla rejält med kompost eller väl förmultnad gödsel på våren - rabarber är en riktig storätare.', 'Vattna vid torka, särskilt unga plantor.', 'Klipp bort blomstjälkar direkt om de dyker upp - de tar kraft från bladtillväxten.', 'Kräver i princip ingen skötsel efter etablering.'],
    skörd: 'Dra loss (inte skär) stjälkarna med en vridande rörelse nära roten, när de är minst 30 cm långa. Sluta skörda i slutet av juni/början av juli så plantan hinner återhämta sig inför vintern. Bladen är giftiga (hög halt oxalsyra) - ät bara stjälkarna, aldrig bladen.',
    tips: 'En av de mest långlivade grödorna du kan odla - en väletablerad planta kan ge skörd i 15–20 år eller mer.',
    companionGood: [], companionBad: [],
    vattning: 'Vattna vid torka, särskilt viktigt de första 1–2 åren medan roten etablerar sig. En väletablerad planta klarar sig ofta bra på naturlig nederbörd i Uppland.',
    problem: [
      { symptom: 'Plantan ser allmänt svag eller gulaktig ut.', orsak: 'Ovanligt med allvarliga sjukdomar på rabarber - oftast bara näringsbrist.', atgard: 'Gödsla rejält med kompost eller väl förmultnad gödsel på våren, rabarber är en riktig storätare.' },
      { symptom: 'Plantan skjuter upp en hög blomstjälk.', orsak: 'Normalt för äldre eller stressade plantor, särskilt i torrt eller varmt väder.', atgard: 'Klipp bort blomstjälken direkt vid basen - den tar kraft från bladtillväxten utan att ge bättre skörd.' }
    ]
  },

  brysselkal: {
    name: 'Brysselkål', sub: 'Näringstät · C-vitamin · K-vitamin · Fibrer',
    zone: 'sol', maintenance: 'medel',
    growth: { harvestDays: [140, 160] },
    family: 'kal', feederType: 'heavy',
    perioder: [
      { cls: 'så', label: 'Så inne / plantera' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Så inne eller köp planta', text: 'Så inomhus i april eller köp planta, plantera ut i juni med 50–60 cm mellanrum - kräver gott om plats och en lång säsong.' },
    skotsel: ['Vattna regelbundet och rikligt.', 'Gödsla en gång i månaden.', 'Sätt upp insektsnät mot kålfjärilar direkt vid plantering (engångsåtgärd).', 'Knip bort toppskottet i september (frivilligt) för att koncentrera kraften till kålhuvudena.'],
    skörd: 'Plocka de små kålhuvudena nedifrån och uppåt när de är valnötsstora och känns fasta - vänta gärna till efter första frosten, då blir smaken mildare och sötare, precis som grönkål.',
    tips: 'En av de mest tidskrävande kålsorterna att odla (lång säsong, mycket plats) men belönar med skörd hela vintern.',
    companionGood: ['dill'], companionBad: ['jordgubbar', 'tomat'],
    vattning: 'Vattna rikligt och regelbundet hela säsongen, 3 gånger i veckan - den långa växtsäsongen gör brysselkål känsligare för torrperioder än snabbare kålsorter.',
    problem: [
      { symptom: 'Bladen är fulla av hål.', orsak: 'Kålfjärilslarver (kålmask).', atgard: 'Insektsnät direkt vid plantering är det mest pålitliga skyddet. Redan larver: plocka bort för hand, titta på undersidan av bladen.' },
      { symptom: 'Kålhuvudena är lösa och håller inte ihop, mer som öppna blad.', orsak: 'För varmt väder under bildningen, eller ojämn vattning/näring.', atgard: 'Håll jämn vattning och näring hela säsongen. Lösa huvuden går fortfarande fint att äta.' },
      { symptom: 'Kålblad avbitna eller hela plantor nedätna.', orsak: 'Rådjur.', atgard: 'Ett nät eller staket runt lådan är det mest pålitliga skyddet.' }
    ]
  },

  blomkal: {
    name: 'Blomkål', sub: 'C-vitamin · K-vitamin · Fibrer',
    zone: 'sol', maintenance: 'krav',
    growth: { harvestDays: [70, 90] },
    family: 'kal', feederType: 'heavy',
    perioder: [
      { cls: 'så', label: 'Så inne / plantera' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så inne eller köp planta', text: 'Så inomhus i april eller köp planta, plantera ut i juni med 50 cm mellanrum. Mer krävande än vitkål - vill ha jämn tillväxt utan avbrott hela säsongen.' },
    skotsel: ['Vattna mycket jämnt och rikligt - avbrott i vattningen ger små, dåliga huvuden.', 'Gödsla varannan vecka.', 'Vik ihop några yttre blad löst över huvudet när det börjar synas, för att hålla det vitt och skyddat från sol.', 'Sätt upp insektsnät mot kålfjärilar direkt vid plantering.'],
    skörd: 'Skörda när huvudet är tätt, fast och har en fin, jämn yta - vänta inte för länge, det blir snabbt löst och gulaktigt om det står för länge efter att det mognat.',
    tips: 'Den mest krävande kålsorten i banken - flaggas medvetet som krävande. Minsta störning i vattning eller näring syns direkt som ett sämre huvud.',
    companionGood: ['dill'], companionBad: ['jordgubbar', 'tomat'],
    vattning: 'Vattna mycket jämnt och rikligt hela säsongen, gärna 3–4 gånger i veckan - blomkål är extremt känslig för avbrott i vattningen, vilket ger små eller missfärgade huvuden.',
    problem: [
      { symptom: 'Huvudet är litet, missfärgat, eller börjar blomma för tidigt utan att bli riktigt tätt.', orsak: '"Knappbildning" (buttoning) - orsakas nästan alltid av stress: ojämn vattning, näringsbrist, eller kraftiga temperaturväxlingar tidigt i tillväxten.', atgard: 'Håll extra jämn vattning och näring redan från att plantan är liten. Ett redan drabbat huvud går inte att rädda, men det går fint att äta även om det är mindre.' },
      { symptom: 'Huvudet har gulaktiga eller bruna fläckar.', orsak: 'För mycket direkt sol på huvudet under bildningen.', atgard: 'Vik ihop några yttre blad löst över huvudet så fort det börjar synas (golfbollstort) för att skugga det.' },
      { symptom: 'Hål i bladen.', orsak: 'Kålfjärilslarver, samma som på andra kålsorter.', atgard: 'Insektsnät direkt vid plantering.' }
    ]
  },

  sellerirot: {
    name: 'Sellerirot', sub: 'Fibrer · K-vitamin · Kalium',
    zone: 'sol', maintenance: 'medel',
    growth: { germinateDays: [14, 21], harvestDays: [150, 180] },
    family: 'flockblommig', feederType: 'heavy',
    perioder: [
      { cls: 'plantera', label: 'Plantera ut' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Köp planta eller så inne tidigt', text: 'Så inomhus redan i februari–mars (behöver lång, tidig förodling) eller köp färdiga plantor - enklast för de flesta. Plantera ut i slutet av maj/juni med 30–40 cm mellanrum, efter frostrisken.' },
    skotsel: ['Vattna jämnt och rikligt hela säsongen.', 'Gödsla en gång i månaden.', 'Ta bort yttre, gamla blad löpande så knölen får mer ljus och luft.'],
    skörd: 'Skörda från september och framåt, när knölen känns stor och fast (gärna minst 10 cm i diameter). Tål lätt frost och kan lämnas i jorden en bit in på hösten, men gräv upp innan marken fryser helt. Lagrar bra i kyl eller jordkällare.',
    tips: 'Långsammare och något mer krävande än många rotgrönsaker, men den unika smaken gör den värd platsen i grytor och soppor.',
    companionGood: ['purjolok'], companionBad: [],
    vattning: 'Vattna jämnt och rikligt hela säsongen, 3 gånger i veckan - sellerirot har ytliga rötter och en lång växtsäsong, vilket gör den känsligare för torka än många andra rotgrönsaker.',
    problem: [
      { symptom: 'Knölen förblir liten trots lång växtsäsong.', orsak: 'Vanligast pga ojämn vattning eller näringsbrist under sommaren.', atgard: 'Håll jämnare vattning och gödsla regelbundet genom hela säsongen, inte bara i början.' },
      { symptom: 'Bruna, ihåliga eller ruttna partier inuti knölen vid skörd.', orsak: 'Bor-brist (ett spårämne) - relativt vanligt hos sellerirot i vissa jordar.', atgard: 'Svårt att åtgärda samma säsong. Återkommer det år efter år kan ett bor-tillskott (specialgödsel) i jorden hjälpa - annars ovanligt att behöva tänka på.' }
    ]
  }
};

// Vänskapskarta för visningsnamn i varningar
const CROP_LABELS = Object.fromEntries(Object.entries(CROPS).map(([id, c]) => [id, c.name]));
