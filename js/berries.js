// Bärbuskar – fristående guide, inte kopplad till odlingslådorna.
const BERRIES = {
  rodavinbar: {
    name: 'Röda vinbär', sub: 'C-vitamin · Antioxidanter · Fibrer', maintenance: 'latt',
    plantering: 'Plantera buske september–oktober eller april–maj, gärna i halvskugga till sol. Ge den 1,5 m till nästa buske.',
    skotsel: ['Vattna vid torka första året, sedan klarar den sig mestadels själv.', 'Beskär lätt varje vinter – ta bort de äldsta grenarna (4+ år) för bästa skörd.', 'Gödsla med kompost eller trädgårdsgödsel på våren.'],
    skörd: 'Skördas i juli, hela klasar plockas samtidigt. Håller sig några dagar i kylskåp, fryser utmärkt.',
    tips: 'En av de mest odlingssäkra bärbuskarna i svenskt klimat – ger skörd redan år två.',
    skadedjur: 'Fåglar äter gärna bären rakt av busken så fort de mognar – fågelnät över busken i god tid innan mognad är det säkraste skyddet. Rådjur nafsar ibland i unga skott men bryr sig sällan om de vuxna buskarna.'
  },
  vitavinbar: {
    name: 'Vita vinbär', sub: 'C-vitamin · Mildare och sötare än röda vinbär', maintenance: 'latt',
    plantering: 'Samma som röda vinbär – plantera september–oktober eller april–maj, halvskugga till sol.',
    skotsel: ['Vattna vid torka första säsongen.', 'Beskär äldsta grenarna varje vinter.', 'Gödsla lätt på våren.'],
    skörd: 'Juli, plockas i hela klasar. Mildare smak än röda vinbär – godast helt färska.',
    tips: 'Lika lättskött som röda vinbär men mindre känt – ett fint alternativ om du vill ha något lite ovanligare.',
    skadedjur: 'Samma som röda vinbär – fåglar är det stora hotet mot skörden. Nät över busken när bären börjar mogna.'
  },
  krusbar: {
    name: 'Krusbär', sub: 'C-vitamin · Fibrer · Antioxidanter', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, sol till halvskugga, 1,2–1,5 m mellan buskar.',
    skotsel: ['Vattna vid torka.', 'Beskär för öppen krona (bättre luftcirkulation minskar mjöldagg).', 'Gödsla på våren.'],
    skörd: 'Juli–augusti. Kan plockas något omogna för syltning, eller mogna för att ätas färska.',
    tips: 'Törnen på grenarna – använd handskar vid plockning och beskärning.',
    skadedjur: 'Mindre lockande för fåglar än vinbär och hallon, men nät kan behövas om du märker att skörden försvinner. Törnarna avskräcker rådjur något på egen hand.'
  },
  hallon: {
    name: 'Hallon', sub: 'Fibrer · C-vitamin · Antioxidanter', maintenance: 'medel',
    plantering: 'Plantera rotskott vår eller höst i sol, i rad med stöd (ståltråd eller spaljé) för bäst resultat.',
    skotsel: ['Vattna regelbundet, särskilt vid fruktsättning.', 'Skär ner de kanor som burit frukt efter skörd (för höstbärande sorter: klipp ner allt på vintern).', 'Sprider sig via rotskott – håll koll på att det inte tar över.'],
    skörd: 'Juli–september beroende på sort. Plocka löpande, bären håller inte länge.',
    tips: 'Kräver lite mer aktiv skötsel än övriga bär pga beskärning, men belönar med mycket skörd.',
    skadedjur: 'Fåglar är mycket förtjusta i hallon – nät är nästan ett måste om du vill ha någon skörd kvar till dig själv. Rådjur kan äta av bladen och unga skott, särskilt tidigt på säsongen.'
  },
  aronia: {
    name: 'Aronia', sub: 'Extremt hög andel antioxidanter · C-vitamin', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, klarar de flesta lägen inklusive halvskugga. Mindre känd men allt vanligare i svenska trädgårdar.',
    skotsel: ['Mycket tålig – vattna bara vid långvarig torka.', 'Minimal beskärning behövs.', 'I princip ingen gödning nödvändig.'],
    skörd: 'September. Bären är mycket syrliga och strama färska – bäst i saft, sylt eller torkade.',
    tips: 'En av de mest skötselfria och näringstäta bärbuskarna som finns – låg insats, hög hälsovinst.',
    skadedjur: 'Bärens strama, syrliga smak gör dem mindre attraktiva för fåglar än söta bär – ofta det minst utsatta bäret i trädgården.'
  },
  blabar: {
    name: 'Blåbär (odlad)', sub: 'C-vitamin · K-vitamin · Antioxidanter - trädgårdssort, inte samma art som skogsblåbär', maintenance: 'medel',
    plantering: 'Plantera vår eller höst i sur jord (pH ca 4,5–5,5) - vanlig trädgårdsjord är oftast för basisk, blanda in surjord/torv vid planteringen. Sol till halvskugga.',
    skotsel: ['Håll jorden fuktig men inte vattendränkt - mulch av bark eller barrförna hjälper.', 'Minimal beskärning de första åren, ta sedan bort de äldsta grenarna efter några år.', 'Gödsla med surjordsgödsel, inte vanlig trädgårdsgödsel.'],
    skörd: 'Juli–augusti, plocka löpande när bären är helt mörkblå.',
    tips: 'Den vanligaste missen är att plantera i vanlig, för basisk trädgårdsjord - kolla jordens pH innan plantering om du är osäker.',
    skadedjur: 'Fåglar är mycket förtjusta i blåbär - nät behövs nästan alltid för att få behålla någon skörd själv.'
  },
  bjornbar: {
    name: 'Björnbär', sub: 'Fibrer · C-vitamin · Antioxidanter - växer på kanor, precis som hallon', maintenance: 'medel',
    plantering: 'Plantera vår eller höst i sol, med stöd (spaljé eller ståltråd) - många sorter har långa, kraftiga kanor. Törnfria sorter finns och är betydligt lättare att hantera.',
    skotsel: ['Vattna vid torka, särskilt under fruktsättning.', 'Bind upp kanorna mot stödet under säsongen.', 'Skär ner de kanor som burit frukt efter skörd, precis som höstbärande hallon.'],
    skörd: 'Augusti–september, plockas när bären är helt mörka och släpper lätt från busken.',
    tips: 'Törnade sorter sprider sig aggressivt via rotskott och kan bli svåra att hålla efter i en mindre trädgård - en törnfri sort är ofta ett enklare val.',
    skadedjur: 'Fåglar och getingar tar gärna av den mogna frukten. Törnarna avskräcker rådjur ganska effektivt på egen hand.'
  },
  havtorn: {
    name: 'Havtorn', sub: 'Mycket hög C-vitaminhalt - kräver både en hane och en hona för att sätta bär', maintenance: 'latt',
    plantering: 'Plantera vår eller höst i sol, tålig för mager och sandig jord. Havtorn är tvåbyggare - du behöver minst en hanplanta och en honplanta inom ca 5–10 m från varandra för att honplantan ska sätta bär.',
    skotsel: ['Mycket tålig och torktolerant när den väl etablerat sig.', 'Minimal beskärning behövs.', 'Klarar sig utan gödning i de flesta jordar.'],
    skörd: 'September - bären sitter tätt mot grenarna och är sura. Vanligast att skörda hela grenar och frysa innan bären knäpps av, eller pressa saft direkt.',
    tips: 'Den vanligaste missen är att bara plantera en enda planta och undra varför den aldrig ger bär - kolla att du har både hane och hona innan du planterar.',
    skadedjur: 'Generellt mycket motståndskraftig mot skadedjur och sjukdomar - ett av de mest skötselfria bären som finns.'
  },
  jordgubbar: {
    name: 'Jordgubbar (bonus)', sub: 'C-vitamin · Fibrer · Antioxidanter · inte en buske, men hör hemma i samma hörna', maintenance: 'latt',
    plantering: 'Plantera plantor i april eller augusti, sol, 30 cm mellanrum.',
    skotsel: ['Vattna regelbundet, särskilt vid fruktsättning.', 'Lägg halm under plantorna så bären hålls rena och torra.', 'Ta bort revor (utlöpare) om du inte vill att de ska sprida sig, eller låt dem rota för fler plantor.'],
    skörd: 'Juni–juli. Plocka löpande när bären är helt röda.',
    tips: 'Plantorna tappar kraft efter 3–4 år – förnya gärna en tredjedel av beståndet varje år via revorna.',
    skadedjur: 'Fåglar tar gärna bären precis när de mognar – ett löst nät eller tyg över plantorna under mognadsperioden hjälper mycket. Rådjur äter gärna hela plantan om de kommer åt, så ett lågt staket runt odlingen är värt att överväga om de är ett problem hos dig.'
  }
};

// Allmänt rådjursskydd, visas som en introtext i Bärbuskar-vyn eftersom det
// gäller hela trädgården snarare än en specifik gröda.
const DEER_GENERAL_TIP = 'Rådjur äter i princip vad som helst om de är hungriga nog, men undviker ofta starkt doftande växter (lavendel, mynta, vitlök) och taggiga buskar. Ett enkelt staket runt de mest utsatta odlingarna, eller doftavskräckande medel från trädgårdsbutiken, är de mest pålitliga skydden.';
