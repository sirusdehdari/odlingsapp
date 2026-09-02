// Fruktträd - fristående guide, samma mönster som berries.js. Kopplas till
// ett träd-objekt på tomten via dess species-id (matchar TREE_SPECIES.frukt).
const FRUIT_TREES = {
  appel: {
    name: 'Äppelträd', sub: 'Vår vanligaste fruktträd - kräver oftast en pollineringspartner', maintenance: 'medel',
    plantering: 'Plantera barrotat träd okt–nov eller mar–apr, i sol. De flesta sorter är inte självfertila - ha en annan äppelsort (eller ett vildapel/rönn i närheten kan hjälpa lite) inom ca 10–15 m för bra pollinering och skörd.',
    skotsel: ['Beskär i sen vinter (feb–mars) innan savstigningen, för öppen krona och bättre luft/ljus.', 'Vattna extra första 1–2 åren tills trädet är etablerat.', 'Gödsla måttligt på våren - för mycket kväve ger mest blad, inte frukt.'],
    skörd: 'Augusti–oktober beroende på sort. Tidiga sorter äts direkt, sena sorter lagrar bäst svalt och mörkt. Testa mognad genom att lyfta lätt på frukten - lossnar den enkelt med skaftet kvar är den redo.',
    tips: 'Den absolut vanligaste nybörjarmissen är att plantera ett enda äppelträd och undra varför det ger lite frukt - kolla alltid pollineringsbehovet för din sort innan du planterar.',
    vattning: 'Vattna extra rejält de första 1–2 åren efter plantering, ca 1–2 gånger i veckan i torrt väder, tills trädet är väl etablerat med djupa rötter. Ett moget träd klarar sig oftast på naturlig nederbörd i Uppland utom vid långvarig torka.',
    problem: [
      { symptom: 'Knoppar och unga blad äts upp tidigt på våren, ofta innan trädet ens blommat.', orsak: 'Vintermal - larverna kläcks tidigt och äter av knoppar och blad innan de vuxna fjärilarna syns.', atgard: 'Klisterband runt stammen på hösten fångar de vingslösa honorna på väg upp för att lägga ägg - ett vanligt, enkelt skydd. Sällan ett stort problem på ett i övrigt friskt träd.' },
      { symptom: 'Bruna eller gråa korkartade fläckar på blad och frukt.', orsak: 'Äppelskorv - en svampsjukdom som är vanlig i fuktiga svenska vårar.', atgard: 'Beskär för öppen krona (redan en del av skötseln) så bladen torkar snabbare efter regn. Frukten går oftast fint att äta trots fläckar - skala bort de värsta partierna.' },
      { symptom: 'Bark eller unga skott är gnagda nära marken.', orsak: 'Rådjur eller gnagare (t.ex. sork), särskilt på nyplanterade, unga träd.', atgard: 'Sätt upp stamskydd (ett rör eller nät runt stammens nedre del) de första åren tills barken hårdnat. Ett skydd mot bara gnagare behöver inte vara högre än ca 50 cm, men rådjur når högre upp och gnager även på grenar - vill du skydda mot båda bör skyddet eller ett runtomgående nät vara minst 1,2–1,5 m högt de första åren.' }
    ]
  },
  paron: {
    name: 'Päronträd', sub: 'Vill ha varmare läge än äpple - kräver nästan alltid en pollineringspartner', maintenance: 'medel',
    plantering: 'Plantera okt–nov eller mar–apr, sydvänt och skyddat läge om möjligt - päron är känsligare för sen vårfrost än äpple. Nästan alla sorter behöver en annan päronsort inom ca 10–15 m för pollinering.',
    skotsel: ['Beskär i sen vinter för öppen krona.', 'Vattna extra de första åren.', 'Gödsla måttligt på våren.'],
    skörd: 'Augusti–september. Plockas ofta något omogna (fasta, inte fullt utfärgade) och eftermognar inomhus i rumstemperatur några dagar för bäst konsistens och smak.',
    tips: 'Om du bara har plats för ett fruktträd och vill ha säker skörd utan pollineringskrångel är plommon eller krikon ett enklare val än päron.',
    vattning: 'Vattna extra de första 1–2 åren, precis som äpple - päron är dessutom lite känsligare för torka i etableringsfasen eftersom den vill ha ett varmare, mer skyddat läge.',
    problem: [
      { symptom: 'Bruna eller gråa fläckar på blad och frukt, liknande äppelskorv.', orsak: 'Päronskorv - samma typ av svampsjukdom som drabbar äpple, fast på päron.', atgard: 'Samma åtgärd som äppelskorv: beskär för öppen krona och god luftcirkulation.' },
      { symptom: 'Klasar av löss på undersidan av unga blad, bladen kan bli kladdiga.', orsak: 'Bladlöss - vanliga på päron.', atgard: 'Spola bort med vattenstråle vid kraftigt angrepp. Sällan allvarligt för ett i övrigt friskt träd.' },
      { symptom: 'Bark eller unga skott är skadade nära marken.', orsak: 'Rådjur eller gnagare på unga träd.', atgard: 'Stamskydd de första åren - ca 50 cm räcker mot gnagare, men vill du även skydda mot rådjur (som når högre och gnager på grenar) behövs ett skydd eller nät på minst 1,2–1,5 m.' }
    ]
  },
  plommon: {
    name: 'Plommonträd', sub: 'Flera sorter (t.ex. Victoria) är delvis självfertila', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, i sol. Många plommonsorter ger frukt även utan pollineringspartner, men skörden blir ofta större med en till i närheten.',
    skotsel: ['Beskär helst på sommaren, inte vintern - vinterbeskärning ökar risken för silverglans (en svampsjukdom som kommer in genom sår i kallt, fuktigt väder).', 'Vattna vid torka, särskilt under fruktsättning.', 'Gödsla måttligt på våren.'],
    skörd: 'Augusti–september, plockas när frukten släpper lätt från grenen med en lätt vridning och känns mjuk vid ett lätt tryck.',
    tips: 'Ett bra förstaträd om du vill ha hög sannolikhet för skörd utan att behöva tänka på pollineringspartner.',
    vattning: 'Vattna vid torka, särskilt viktigt under fruktsättning i juli–augusti - ojämn vattning kan få frukterna att spricka.',
    problem: [
      { symptom: 'Små, omogna plommon faller av trädet i juni–juli, ofta med ett litet hål.', orsak: 'Plommonstekel - larverna äter sig in i den unga frukten, en vanlig orsak till tidigt fruktfall på plommon.', atgard: 'Plocka upp och kasta (inte kompostera) nedfallna frukter regelbundet under juni–juli för att bryta livscykeln. Ett i övrigt etablerat träd klarar sig fint trots visst bortfall.' },
      { symptom: 'Frukten ruttnar brunt och snabbt, ofta med ett gråaktigt sporpålägg.', orsak: 'Monilia (brunröta) - en vanlig svampsjukdom på plommon och körsbär, gynnas av fuktiga somrar.', atgard: 'Ta bort och kasta angripna frukter direkt så sjukdomen inte sprids till friska frukter i samma klase.' },
      { symptom: 'Grenar dör plötsligt tillbaka, bladen får en silverglänsande ton innan de dör.', orsak: 'Silverglans - kommer in genom sår, mycket vanligare vid beskärning på vintern i kallt, fuktigt väder.', atgard: 'Beskär bara på sommaren (redan rekommenderat), aldrig på vintern. Ta bort döda grenar snabbt och rent.' }
    ]
  },
  korsbar: {
    name: 'Körsbärsträd', sub: 'Söta sorter kräver oftast pollineringspartner, surkörsbär är ofta självfertila', maintenance: 'medel',
    plantering: 'Plantera vår eller höst, i sol. Kolla om din sort är sötkörsbär (behöver oftast en partner) eller surkörsbär (t.ex. skuggmorell, ofta självfertil och mer skuggtåligt).',
    skotsel: ['Beskär på sommaren, aldrig på vintern - samma silverglans-risk som plommon.', 'Vattna vid torka.', 'Gödsla måttligt på våren.'],
    skörd: 'Juli. Bären mognar snabbt och ofta samtidigt - var redo att plocka under en kort period, när de är helt genomfärgade och mjuka.',
    tips: 'Fåglar hittar mogna körsbär anmärkningsvärt snabbt - om du vill ha någon skörd alls till dig själv är nät över trädet (eller delar av det) nästan ett måste.',
    vattning: 'Vattna vid torka, särskilt under fruktsättning i juni–juli.',
    problem: [
      { symptom: 'Bären försvinner nästan över en natt precis när de mognat.', orsak: 'Fåglar - det klart största hotet mot körsbärsskörden.', atgard: 'Nät över trädet (eller delar av det) är nästan ett måste om du vill ha någon skörd kvar till dig själv. Använd tät maska (max ca 2 cm), dra nätet spänt utan lösa fickor och säkra det ner mot marken eller stammen - löst hängande nät kan fånga in fåglar istället för att bara hålla dem ute.' },
      { symptom: 'Små, vita larver inuti bären vid plockning.', orsak: 'Körsbärsflugans larver - lägger ägg i den mognande frukten.', atgard: 'Gula klisterfällor i trädet under blomningen hjälper att övervaka och fånga vuxna flugor innan de hinner lägga ägg.' },
      { symptom: 'Frukten ruttnar brunt, ofta med ett gråaktigt sporpålägg.', orsak: 'Monilia (brunröta) - samma sjukdom som drabbar plommon.', atgard: 'Ta bort och kasta angripna frukter direkt.' }
    ]
  },
  krikon: {
    name: 'Krikonträd', sub: 'Litet, plommonliknande, ofta självfertilt och mycket härdigt', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, sol till halvskugga. Ett av de mest odlingssäkra fruktträden i svenskt klimat - klarar sig ofta bra utan pollineringspartner.',
    skotsel: ['Minimal beskärning behövs.', 'Vattna bara vid långvarig torka.', 'Klarar sig i princip utan gödning.'],
    skörd: 'Augusti–september. Frukterna är små men söta, bra för saft, sylt och att äta direkt - plocka när de släpper lätt från grenen.',
    tips: 'Ett utmärkt val om du vill ha ett fruktträd med minimal skötsel och hög tillförlitlighet - liknar plommon men ännu tåligare.',
    vattning: 'Mycket torktålig när trädet väl etablerat sig - vattna bara vid långvarig torka.',
    problem: [
      { symptom: 'Enstaka frukter ruttnar brunt på trädet.', orsak: 'Monilia (brunröta) kan förekomma, men krikon är generellt mindre känsligt än plommon och körsbär.', atgard: 'Ta bort angripna frukter om du ser dem - sällan ett stort problem på krikon.' },
      { symptom: 'Fåglar och getingar tar av den mogna frukten.', orsak: 'Söt frukt lockar båda.', atgard: 'Skörden är oftast så riklig att visst bortfall sällan spelar någon roll - nät sällan nödvändigt.' }
    ]
  },
  hassel: {
    name: 'Hasselnöt', sub: 'Ätbara nötter - delvis självfertil men ger mer med en partner i närheten', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, sol till halvskugga. Blir ofta en stor, flerstammig buske/litet träd (upp till 4–5 m) om den inte formas. Delvis självfertil, men ger betydligt bättre skörd med en annan hasselbuske (gärna annan sort) inom några meter - pollineras av vinden, inte av insekter, och blommar redan i februari–mars.',
    skotsel: ['Minimal beskärning behövs, men ta gärna bort en del av de äldsta stammarna med några års mellanrum för att hålla busken produktiv.', 'Vattna vid torka de första åren.', 'Klarar sig i princip utan gödning i normal trädgårdsjord.'],
    skörd: 'September–oktober, när nötskalen bytt färg från grönt till brunt och nötterna lossnar lätt eller faller själva. Samla in löpande - ekorrar och andra djur tar gärna av skörden om den får ligga.',
    tips: 'En av de mest skötselfria "fruktträden" i banken när det gäller beskärning och gödning - den stora utmaningen är snarare att hinna före ekorrarna.',
    vattning: 'Vattna vid torka de första 1–2 åren medan busken etablerar sig. En etablerad hasselbuske klarar sig därefter oftast bra på naturlig nederbörd i Uppland.',
    problem: [
      { symptom: 'Nästan hela skörden försvinner strax innan du tänkt skörda, ofta med tomma skal kvar på marken.', orsak: 'Ekorrar - mycket effektiva på att hitta och plocka hasselnötter precis innan de är fullt mogna, ofta före dig.', atgard: 'Håll koll på nötterna från slutet av augusti och skörda hellre lite för tidigt än för sent om ekorrar är aktiva hos dig. Det finns inget helt pålitligt skydd mot ekorrar förutom nät runt hela busken, vilket sällan är praktiskt.' },
      { symptom: 'Små hål i skalet, och nöten inuti är uppäten eller full av en liten larv.', orsak: 'Hasselnötsvivel - en skalbagge vars larver utvecklas inuti den mognande nöten.', atgard: 'Samla upp och kasta (inte kompostera) angripna nötter för att bryta livscykeln. Nedfallna nötter tidigt på säsongen är ofta angripna - vänta med att skörda de kvarvarande, friska nötterna på busken.' }
    ]
  }
};
