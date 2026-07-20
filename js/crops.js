// Grödbank för odlingsappen. zone: 'skugga' | 'sol' | 'valfri'. maintenance: 'latt' | 'medel' | 'krav'.
// perioder-index motsvarar kolumnerna: [Apr-Maj, Jun, Jul, Aug, Sep-Okt, Nov-Mar]
const CROPS = {

  // ---------- SKUGGZON (7 lådor vid häcken) ----------

  spenat: {
    name: 'Spenat', sub: 'Låg kalori · Järn · Folat · K-vitamin',
    zone: 'skugga', maintenance: 'latt',
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
    skörd: 'Skörda de yttersta bladen och låt mitten växa vidare. Nyp bort blomknoppar direkt.',
    tips: 'Bäst sådd i april och igen i slutet av juli för fin höstskörd.',
    companionGood: ['jordgubbar', 'lok'], companionBad: []
  },

  ruccola: {
    name: 'Ruccola', sub: 'Låg kalori · K-vitamin · Antioxidanter · C-vitamin',
    zone: 'skugga', maintenance: 'latt',
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
    skörd: 'Klipp ytterbladen med sax och låt mitten växa vidare.',
    tips: 'Hål i bladen = jordloppor, ofarligt. Täck med fiberduk om det stör.',
    companionGood: [], companionBad: []
  },

  sallat: {
    name: 'Sallat / Klippsallat', sub: 'Låg kalori · Folat · Fibrer · K-vitamin',
    zone: 'skugga', maintenance: 'latt',
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
    skörd: 'Klippsallat: klipp ytterblad. Huvudsallat: skörda hela plantan när den är fyllig.',
    tips: 'Kan gå i frö snabbt i juli–augusti. Välj värmetåliga sorter som "Batavia".',
    companionGood: ['morotter', 'radisor'], companionBad: []
  },

  radisor: {
    name: 'Rädisor', sub: 'Låg kalori · Fibrer · C-vitamin · Folat',
    zone: 'skugga', maintenance: 'latt',
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
    skörd: 'Redo på 3–4 veckor. Plocka vid 2–3 cm diameter.',
    tips: 'Cherry Belle håller sig fin i jorden lite längre utan att bli ihålig.',
    companionGood: ['sallat', 'gurka'], companionBad: []
  },

  sockerartor: {
    name: 'Sockerärtor', sub: 'Protein · Fibrer · C-vitamin · B-vitamin',
    zone: 'skugga', maintenance: 'medel',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 3–4 cm djupt, 8–10 cm mellanrum. Behöver stöd – pinnar eller nät. Häcken bakom lådorna är perfekt att luta dem mot.' },
    skotsel: ['Vattna regelbundet, extra viktigt vid blomning.', 'Ingen gödning – fixerar eget kväve.', 'Se till att stöd finns tidigt.'],
    skörd: 'Skörda löpande när baljorna är fyllda men fortfarande gröna och krispiga.',
    tips: 'Tidig sådd i april ger kraftiga plantor.',
    companionGood: ['morotter', 'radisor'], companionBad: ['lok', 'vitlok'],
    skadedjur: 'Rådjur äter gärna unga skott och blad – extra utsatt tidigt på säsongen innan plantan hunnit bli kraftig. Ett enkelt nät eller staket runt lådan under uppstartsfasen hjälper mycket.'
  },

  bondbona: {
    name: 'Bondböna', sub: 'Protein · Fibrer · Järn · Folat',
    zone: 'skugga', maintenance: 'medel',
    perioder: [
      { cls: 'så', label: 'Så (apr)' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april, 5 cm djupt, 20 cm mellanrum. Tål kyla och lätt frost. Gror på 10–14 dagar. Behöver stöd när den blir stor.' },
    sorter: [{ namn: 'Witkiem', beskrivning: 'tidig, tålig, bra förstaval' }, { namn: 'Superaguadulce', beskrivning: 'klassiker, stor böna' }, { namn: 'Extra precoce a grano violetto', beskrivning: 'extra tidig, violetta bönor' }, { namn: 'Karmazyn', beskrivning: 'röda bönor, ovanlig' }],
    skotsel: ['Torktålig – vattna när ytan torkat.', 'Ingen gödning behövs.', 'Nyp av toppskotten när första baljorna syns (frivilligt, hämmar bladlöss).'],
    skörd: 'Skörda baljorna när fyllda men ännu mjuka, innan de gulnar.',
    tips: 'Massor av svarta bladlöss på topparna? Nyp bort toppskotten.',
    companionGood: ['potatis'], companionBad: ['lok', 'vitlok'],
    skadedjur: 'Rådjur tycker om unga bondbönsplantor. Skydda med nät tills plantorna är stadiga och lite kraftigare.'
  },

  pakchoi: {
    name: 'Pak choi', sub: 'Låg kalori · K-vitamin · Kalcium · C-vitamin',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' },
      { cls: 'så', label: 'Så' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså från juli, 1 cm djupt, 25 cm mellanrum. Bra som eftergröda efter t.ex. vitlök eller rädisor.' },
    sorter: [{ namn: 'Joi Choi', beskrivning: 'robust och populär' }],
    skotsel: ['Vattna regelbundet – torka kan driva den i frö.', 'Gödsla lätt en gång i veckan.', 'Trivs i halvskugga under augustihettan.'],
    skörd: 'Skörda hela plantan vid roten, eller plocka ytterblad löpande.',
    tips: 'Perfekt att så direkt efter vitlöksskörden – lådan utnyttjas maximalt.',
    companionGood: [], companionBad: []
  },

  hostrattika: {
    name: 'Hösträttika', sub: 'Låg kalori · C-vitamin · Fibrer · Folat',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' },
      { cls: 'så', label: 'Så (jul)' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså juli–tidig augusti, 1–2 cm djupt, 20–25 cm mellanrum (gallra). Juli är perfekt timing.' },
    sorter: [{ namn: 'China Rose', beskrivning: 'rosa/röd, pålitlig' }, { namn: 'Minowase', beskrivning: 'daikon-typ, lång och produktiv' }],
    skotsel: ['Vattna jämnt – ojämnt ger sprickor.', 'Ingen gödning behövs.', 'Tål lite frost.'],
    skörd: 'Redo på 8–10 veckor. Förvara svalt, håller sig länge.',
    tips: 'Bra eftergröda till vitlök i samma låda.',
    companionGood: [], companionBad: []
  },

  gronkal: {
    name: 'Grönkål', sub: 'Mycket näringstät · K-vitamin · C-vitamin · Kalcium',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så inne / plantera' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Så inne eller köp planta', text: 'Så inomhus i april eller köp färdig planta, plantera ut i maj–juni med 40 cm mellanrum. Klarar halvskugga bra.' },
    skotsel: ['Vattna regelbundet.', 'Gödsla lätt en gång i månaden.', 'Sätt upp insektsnät mot kålfjärilar direkt vid plantering (engångsåtgärd, inte löpande skötsel).'],
    skörd: 'Plocka nedre bladen löpande. Smakar som bäst efter första frosten.',
    tips: 'En av de mest näringstäta grödorna du kan odla – och den blir godare av kyla.',
    companionGood: ['dill'], companionBad: ['jordgubbar', 'tomat'],
    skadedjur: 'Rådjur äter gärna kålblad om de kommer åt. Ett nät eller staket runt lådan är det mest pålitliga skyddet.'
  },

  mangold: {
    name: 'Mangold', sub: 'Näringstät · K-vitamin · Magnesium · Järn',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 2 cm djupt, 30 cm mellanrum. Klarar halvskugga bra.' },
    skotsel: ['Vattna regelbundet.', 'Gödsla lätt varannan månad.', 'Väldigt lättskött rent generellt.'],
    skörd: 'Skörda ytterbladen löpande, låt mitten växa vidare – ger skörd hela säsongen.',
    tips: 'En av de mest produktiva bladgrönsakerna – en planta räcker länge.',
    companionGood: [], companionBad: []
  },

  purjolok: {
    name: 'Purjolök', sub: 'Lagrar bra · K-vitamin · Folat',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Plantera' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Plantera små plantor', text: 'Köp små plantor eller så inomhus i mars, plantera ut i maj i 15 cm djupa fåror, 15 cm mellanrum. Fyll på jord runt stjälken över säsongen för mer vitt skaft (frivilligt).' },
    skotsel: ['Vattna regelbundet.', 'Gödsla lätt en gång i månaden.', 'Kan stå kvar i jorden och skördas efter behov, även efter frost.'],
    skörd: 'Dra upp vid behov från augusti och framåt. Lagrar bra i kyl eller jordkällare.',
    tips: 'En av de mest lättskötta lagringsgrödorna – bara plantera och vänta.',
    companionGood: ['morotter'], companionBad: ['bondbona']
  },

  jordartskocka: {
    name: 'Jordärtskocka', sub: 'Mycket hög avkastning · Fibrer (inulin) · Kalium',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Plantera knölar' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vila (mognar)' }, { cls: 'skörda', label: 'Skörda hela vintern' }
    ],
    plantering: { titel: 'Plantera knölar', text: 'Plantera knölar i april, 10 cm djupt, 40 cm mellanrum. Extremt lättodlad – växer nästan som ogräs.' },
    skotsel: ['Vattna vid långvarig torka, annars sköter den sig själv.', 'Ingen gödning behövs.', 'Kan bli hög (2–3 m) – plantera där den inte skuggar annat.'],
    skörd: 'Gräv upp knölar vid behov från oktober och hela vintern – fungerar som egen "jordkällare".',
    tips: 'Sprider sig lätt – plantera i en avgränsad låda om du inte vill ha den överallt nästa år.',
    companionGood: [], companionBad: []
  },

  vitlok: {
    name: 'Vitlök', sub: 'Prebiotika · Allicin · Immunförsvar · Antioxidanter',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda (jul)' }, { cls: 'vila', label: 'Vila' },
      { cls: 'så', label: 'Plantera klyftor (sep)' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Plantera klyftor i september', text: 'Dela ett vitlökshuvud i klyftor. Plantera september–oktober, spets uppåt, 5 cm djupt, 10–15 cm mellanrum. Övervintrar utan skötsel.' },
    skotsel: ['Minimal skötsel – vattna vid torka.', 'Lätt kvävegödning på våren när bladen syns.', 'Lämnar välmående jord efter sig – bra förväxt.'],
    skörd: 'Skörda i juli när blasten gulnar. Låt torka i solen några dagar innan förvaring.',
    tips: 'Lådan frigörs i juli – perfekt timing för hösträttika eller pak choi som eftergröda.',
    companionGood: ['morotter'], companionBad: ['bondbona', 'sockerartor']
  },

  // ---------- SOL-ZON (4 lådor, sol hela dagen) ----------

  potatis: {
    name: 'Potatis', sub: 'Mycket hög avkastning · Kalium · C-vitamin · Fibrer',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Sätt sättpotatis' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Sätt sättpotatis', text: 'Förgro sättpotatis ljust och svalt i april. Sätt ut i maj, 10 cm djupt, 30 cm mellanrum.' },
    skotsel: ['Vattna regelbundet, mer vid knölbildning.', 'Kupa jord runt stjälkarna 1–2 gånger (frivilligt, ger mer skörd men inte ett krav).', 'Annars bara vänta.'],
    skörd: 'Förstaskörd (färskpotatis) när plantan blommar, ca juli. Lagringspotatis: gräv upp i augusti–september när blasten vissnat, låt torka innan förvaring.',
    tips: 'En av de mest skötselfria grödorna som ändå ger enorm skörd per kvadratmeter.',
    companionGood: ['bondbona'], companionBad: ['tomat', 'gurka', 'squash']
  },

  morotter: {
    name: 'Morötter', sub: 'Mycket bra lagring · Betakaroten · Fibrer',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 1 cm djupt, rader 20 cm mellanrum. Gallra en gång till 3–5 cm när de grott (enda ingreppet utöver vattning).' },
    skotsel: ['Vattna jämnt – ojämn vattning ger delade rötter.', 'Ingen gödning behövs.'],
    skörd: 'Redo från augusti. Kan lämnas i jorden till första frosten, eller lagras i kyl/jordkällare i månader.',
    tips: 'En av de bästa grödorna för lagring – smaken blir ofta bättre efter lätt frost.',
    companionGood: ['lok', 'salladslok', 'sallat', 'purjolok', 'vitlok'], companionBad: ['dill']
  },

  rodbetor: {
    name: 'Rödbetor', sub: 'Utmärkt lagring · Folat · Nitrat · Antioxidanter',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså maj, 2 cm djupt, 30 cm mellan rader. Gallra till 10 cm mellanrum när de grott.' },
    skotsel: ['Vattna jämnt.', 'Ingen gödning behövs.'],
    skörd: 'Redo på 8–10 veckor. Lagrar utmärkt i kyl eller jordkällare hela vintern.',
    tips: 'Bladen är också ätbara – som mangold.',
    companionGood: ['lok'], companionBad: ['bondbona']
  },

  lok: {
    name: 'Gul lök (sättlök)', sub: 'Lagrar mycket länge · Antioxidanter · Prebiotika',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Sätt sättlök' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Sätt sättlök', text: 'Sätt sättlök i april, spets uppåt, precis under jordytan, 10 cm mellanrum. Förmodligen den enklaste grödan av alla.' },
    skotsel: ['Vattna vid torka.', 'Ingen gödning behövs.', 'Sluta vattna någon vecka innan skörd.'],
    skörd: 'Skörda i augusti när blasten faller ihop och gulnar. Låt torka i solen några dagar. Lagrar i månader svalt och torrt.',
    tips: 'Mycket få saker kan gå fel med sättlök – ett tryggt förstaval.',
    companionGood: ['morotter', 'jordgubbar', 'rodbetor'], companionBad: ['bondbona', 'sockerartor']
  },

  palsternacka: {
    name: 'Palsternacka', sub: 'Mycket bra lagring · Fibrer · Folat · Kalium',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'vila', label: 'Mognar' }, { cls: 'skörda', label: 'Skörda (tål frost)' }
    ],
    plantering: { titel: 'Så från frö', text: 'Direktså april–maj, 2 cm djupt, 20 cm mellanrum. Långsam grodd (2–3 veckor) – ha tålamod.' },
    skotsel: ['Vattna jämnt de första veckorna.', 'Ingen gödning behövs.', 'I princip skötselfri efter groning.'],
    skörd: 'Kan lämnas i jorden till efter första frosten – smaken blir sötare av kylan. Skörda oktober–november, eller lämna kvar och gräv upp under vintern.',
    tips: 'En ofta förbisedd men extremt lättskött och näringsrik lagringsgröda.',
    companionGood: [], companionBad: []
  },

  vitkal: {
    name: 'Vitkål', sub: 'Mycket bra lagring · C-vitamin · Fibrer',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så inne / plantera' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Vårda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta eller så inne', text: 'Så inomhus i april eller köp planta, sätt ut i juni med 40–50 cm mellanrum – kräver full sol och gott om plats.' },
    skotsel: ['Vattna rikligt och jämnt.', 'Gödsla en gång i månaden.', 'Sätt upp insektsnät mot kålfjärilar direkt vid plantering (engångsåtgärd).'],
    skörd: 'Skörda när huvudet känns fast och tungt, ofta september–oktober. Lagrar i veckor till månader svalt.',
    tips: 'Kräver mer plats än de flesta grödor men lönar sig i lagringsvärde.',
    companionGood: ['dill'], companionBad: ['jordgubbar', 'tomat'],
    skadedjur: 'Rådjur är mycket förtjusta i kål. Ett nät eller staket runt lådan rekommenderas starkt om du har rådjur i närheten.'
  },

  tomat: {
    name: 'Tomat', sub: 'Näringsrik · Lykopen · C-vitamin · Kalium',
    zone: 'sol', maintenance: 'krav',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Slut' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp färdig planta, plantera på varmaste platsen efter frostrisken passerat (ca juni). Sätt upp stöd/pinne direkt vid plantering.' },
    skotsel: ['Vattna jämnt vid roten, aldrig på bladen.', 'Gödsla med tomatnäring varannan vecka.', 'Nyp bort sidoskott ("amputera") löpande genom säsongen – detta är den skötsel du tyckte var jobbig.', 'Bind upp stammen mot stödet allt eftersom den växer.'],
    skörd: 'Plocka när frukterna är helt röda och lossnar lätt.',
    tips: 'Den mest skötselkrävande grödan i den här banken – flaggas medvetet som krävande. Bladmögel/torrfläcksjuka är vanligt i fuktiga somrar.',
    companionGood: ['basilika', 'morotter'], companionBad: ['potatis', 'gurka', 'vitkal', 'gronkal']
  },

  gurka: {
    name: 'Gurka', sub: 'Vätskerik · K-vitamin · Kalium',
    zone: 'sol', maintenance: 'medel',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Slut' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp planta, plantera i varmaste läget i juni. Vill du slippa spaljé/stöd, välj en "buskgurka"-sort som klarar sig utan klätterstöd.' },
    skotsel: ['Vattna rikligt och jämnt, gärna varje dag i värme.', 'Gödsla med tomatnäring varannan vecka.', 'Vinsorter vill ha spaljé att klättra på – buskgurka klarar sig utan.'],
    skörd: 'Plocka löpande vid önskad storlek – ju mer du skördar desto mer producerar plantan.',
    tips: 'Mjöldagg i augustivärme: spraya med utspädd mjölk (1:9) eller ta bort drabbade blad.',
    companionGood: ['dill', 'radisor'], companionBad: ['potatis', 'tomat']
  },

  paprika: {
    name: 'Paprika / Chili', sub: 'C-vitamin · Antioxidanter · Capsaicin (chili)',
    zone: 'sol', maintenance: 'krav',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp planta, plantera på det allra varmaste och mest lä-skyddade läget. Behöver mer värme än vad Uppland vanligtvis ger.' },
    skotsel: ['Vattna jämnt, undvik stående blöt jord.', 'Gödsla med tomatnäring en gång i veckan.', 'Kan behöva bindas upp när frukterna blir tunga.'],
    skörd: 'Plocka gröna för paprika/mildare smak, eller vänta tills röda för sötare/starkare smak.',
    tips: 'Experimentgröda i svenskt klimat, som Padrón – förvänta dig en mindre skörd.',
    companionGood: ['basilika'], companionBad: ['bondbona']
  },

  squash: {
    name: 'Squash / Sommarsquash', sub: 'Låg kalori · Fibrer · B-vitamin · Kalium',
    zone: 'sol', maintenance: 'medel', fillsBox: true,
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Slut' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp färdig planta i slutet av maj eller juni. En planta per låda – de blir enorma. Plantera mitt i lådan, vattna rejält direkt efter.' },
    skotsel: ['Vattna rikligt varje dag vid roten, aldrig på bladen.', 'Gödsla med tomatnäring varannan vecka.', 'Om ingen frukt bildas: pollinera för hand med en pensel mellan blommorna.'],
    skörd: 'Plocka vid 15–20 cm. Skörda tidigt och ofta – mer skörd ju mer du plockar.',
    tips: 'Vita mjöliga fläckar = mjöldagg. Spraya med utspädd mjölk (1:9) eller ta bort drabbade blad.',
    companionGood: [], companionBad: ['potatis']
  },

  padron: {
    name: 'Pimiento de Padrón', sub: 'Låg kalori · C-vitamin · Capsaicin · Antioxidanter',
    zone: 'sol', maintenance: 'krav',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Köp planta – plantera ut i juni', text: 'Köp färdig planta, plantera på varmaste möjliga plats. Padrón är värmekrävande och gynnas av lä.' },
    skotsel: ['Vattna när jorden torkat 2–3 cm ned, inte varje dag.', 'Gödsla med tomatnäring en gång i veckan.', 'Ge den varmaste och solrikaste platsen.'],
    skörd: 'Plocka frukterna gröna och små (3–5 cm) – röda har blivit söta och tappat karaktär.',
    tips: 'Experimentgröda i svenskt klimat – förvänta dig ingen stor skörd, men en av tio är stark!',
    companionGood: [], companionBad: []
  },

  // ---------- ÖRTER ----------

  basilika: {
    name: 'Basilika', sub: 'Aromatisk · Antioxidanter · K-vitamin',
    zone: 'sol', maintenance: 'medel',
    perioder: [
      { cls: 'vila', label: 'Vila' }, { cls: 'plantera', label: 'Plantera ut (efter frost)' },
      { cls: 'vårda-skörda', label: 'Vårda + skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Slut (känslig för kyla)' }
    ],
    plantering: { titel: 'Köp planta eller så inne', text: 'Mycket köldkänslig – plantera ut först i juni när nattfrosten är helt över. Trivs bäst i kruka nära köket eller i den soligaste lådan.' },
    skotsel: ['Vattna jämnt, ogillar att stå blött.', 'Nyp bort blomställningar löpande för att hålla plantan buskig.', 'Klarar inte kyla under +10°C särskilt bra.'],
    skörd: 'Plocka blad löpande – ju mer du klipper desto mer grenar den sig.',
    tips: 'Trivs extra bra tillsammans med tomat, både i jorden och på tallriken.',
    companionGood: ['tomat', 'paprika'], companionBad: []
  },

  timjan: {
    name: 'Timjan', sub: 'Aromatisk · Perenn · Antioxidanter',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'plantera', label: 'Plantera' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Köp planta', text: 'Plantera en liten planta i maj på soligaste, torraste platsen. Perenn – kommer tillbaka år efter år.' },
    skotsel: ['Vattna sparsamt – trivs bäst lite torrt.', 'Ingen gödning behövs.', 'Klipp ner lätt på våren för att hålla den fräsch.'],
    skörd: 'Plocka kvistar året runt, mest smak precis innan blomning.',
    tips: 'En av de mest skötselfria örterna – nästan omöjlig att misslyckas med.',
    companionGood: [], companionBad: []
  },

  oregano: {
    name: 'Oregano', sub: 'Aromatisk · Perenn · Antioxidanter',
    zone: 'sol', maintenance: 'latt',
    perioder: [
      { cls: 'plantera', label: 'Plantera' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Köp planta', text: 'Plantera i maj på soligt läge. Perenn, sprider sig gärna – ge den egen plats i lådan.' },
    skotsel: ['Vattna sparsamt.', 'Ingen gödning behövs.', 'Klipp ner efter blomning för fräscht nytt bladverk.'],
    skörd: 'Plocka löpande, smakstarkast strax före blomning.',
    tips: 'Lika lättskött som timjan – ett tryggt förstaval för örtlandet.',
    companionGood: [], companionBad: []
  },

  graslok: {
    name: 'Gräslök', sub: 'Aromatisk · Perenn · K-vitamin',
    zone: 'valfri', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Plantera/så' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vårda', label: 'Vårda' }, { cls: 'vårda', label: 'Övervintrar' }
    ],
    plantering: { titel: 'Plantera planta eller så', text: 'Plantera en planta eller så direkt i april–maj. Klarar både sol och halvskugga. Perenn – kommer tillbaka varje år.' },
    skotsel: ['Vattna vid torka.', 'Ingen gödning behövs.', 'Klipp ner blommande strån för fortsatt bladtillväxt.'],
    skörd: 'Klipp löpande med sax, växer snabbt tillbaka.',
    tips: 'En av de mest lättodlade örterna – funkar nästan var som helst i lådorna.',
    companionGood: ['morotter'], companionBad: []
  },

  persilja: {
    name: 'Persilja', sub: 'Mycket näringstät · K-vitamin · C-vitamin · Järn',
    zone: 'skugga', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'vårda-skörda', label: 'Vårda + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'vila', label: 'Vila (tvåårig)' }
    ],
    plantering: { titel: 'Så eller köp planta', text: 'Så april–maj, grunt (0,5 cm). Långsam grodd (2–4 veckor), ha tålamod. Klarar halvskugga bra.' },
    skotsel: ['Vattna jämnt.', 'Gödsla lätt en gång i månaden.'],
    skörd: 'Plocka ytterstjälkar löpande, låt mitten växa vidare.',
    tips: 'Tvåårig växt – kan ofta övervintra och ge skörd tidigt år två också.',
    companionGood: ['morotter'], companionBad: []
  },

  dill: {
    name: 'Dill', sub: 'Aromatisk · C-vitamin · Antioxidanter',
    zone: 'valfri', maintenance: 'latt',
    perioder: [
      { cls: 'så', label: 'Så' }, { cls: 'så-skörda', label: 'Så + skörda' },
      { cls: 'skörda', label: 'Skörda' }, { cls: 'skörda', label: 'Skörda' },
      { cls: 'vila', label: 'Vila' }, { cls: 'vila', label: 'Vila' }
    ],
    plantering: { titel: 'Så direkt', text: 'Direktså april–juli, grunt, i rader eller strö. Så om varannan-var tredje vecka för löpande skörd hela säsongen.' },
    skotsel: ['Vattna jämnt.', 'Ingen gödning behövs.'],
    skörd: 'Klipp blad löpande. Frödill: låt gå i blom och skörda fröställningarna i augusti.',
    tips: 'Trivs bra nära gurka och kål, både i odlingen och i syltburken.',
    companionGood: ['gurka', 'vitkal', 'gronkal'], companionBad: ['morotter']
  }
};

// Vänskapskarta för visningsnamn i varningar
const CROP_LABELS = Object.fromEntries(Object.entries(CROPS).map(([id, c]) => [id, c.name]));
