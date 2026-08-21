// Bärbuskar – fristående guide, inte kopplad till odlingslådorna.
const BERRIES = {
  rodavinbar: {
    name: 'Röda vinbär', sub: 'C-vitamin · Antioxidanter · Fibrer', maintenance: 'latt',
    plantering: 'Plantera buske september–oktober eller april–maj, gärna i halvskugga till sol. Ge den 1,5 m till nästa buske.',
    skotsel: ['Vattna vid torka första året, sedan klarar den sig mestadels själv.', 'Beskär lätt varje vinter – ta bort de äldsta grenarna (4+ år) för bästa skörd.', 'Gödsla med kompost eller trädgårdsgödsel på våren.'],
    skörd: 'Skördas i juli, hela klasar plockas samtidigt när bären är genomskinligt röda och lossnar lätt. Håller sig några dagar i kylskåp, fryser utmärkt.',
    tips: 'En av de mest odlingssäkra bärbuskarna i svenskt klimat – ger skörd redan år två.',
    vattning: 'Vattna vid torka första året medan busken etablerar sig, därefter klarar den sig oftast på naturlig nederbörd i Uppland - vattna extra bara vid långvarig torka under fruktsättningen i juni–juli, för bästa bärstorlek.',
    problem: [
      { symptom: 'Bären försvinner rakt av busken precis när de mognat.', orsak: 'Fåglar - äter gärna vinbär så fort de mognar.', atgard: 'Fågelnät över busken i god tid innan mognad är det säkraste skyddet.' },
      { symptom: 'Bladen kruller ihop och blir rödaktiga tidigt på säsongen.', orsak: 'Bladlöss - vanliga på vinbär på våren, suger växtsaft från undersidan av unga blad.', atgard: 'Oftast bara kosmetiskt och påverkar sällan skörden. Vid kraftigt angrepp: spola bort med vattenstråle.' },
      { symptom: 'Unga skott är avbitna.', orsak: 'Rådjur - nafsar ibland i unga skott men bryr sig sällan om vuxna, etablerade buskar.', atgard: 'Skydda unga buskar med nät de första säsongerna om du har rådjur i närheten.' }
    ]
  },
  svartavinbar: {
    name: 'Svarta vinbär', sub: 'Mycket hög C-vitaminhalt - den mest köldhärdiga vinbärssorten', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, sol till halvskugga, 1,5–2 m mellan buskar - svarta vinbär blir ofta större och mer utbredda än röda/vita.',
    skotsel: ['Vattna vid torka första året.', 'Beskär mer aktivt än röda vinbär - ta bort ungefär en tredjedel av de äldsta grenarna varje vinter, eftersom svarta vinbär ger bäst skörd på 1–2-åriga grenar (till skillnad från röda/vita, som ger bäst skörd på äldre grenar).', 'Gödsla med kompost eller trädgårdsgödsel på våren.'],
    skörd: 'Skördas i juli–augusti, hela klasar plockas när bären är helt svarta och lossnar lätt. Stark, karaktäristisk doft och smak - de flesta föredrar dem i saft eller sylt snarare än färska.',
    tips: 'Den mest köldtåliga vinbärssorten och en av de bästa C-vitaminkällorna du kan odla.',
    vattning: 'Vattna vid torka första året medan busken etablerar sig, därefter klarar den sig oftast bra på naturlig nederbörd i Uppland. Extra vatten under fruktsättning i juli ger större bär.',
    problem: [
      { symptom: 'Knopparna är påtagligt runda och svullna på vintern, och öppnar sig inte normalt på våren.', orsak: 'Vinbärsgallkvalster - en mikroskopisk kvalster som lever inuti knopparna och får dem att svälla, specifik för svarta vinbär.', atgard: 'Plocka bort och kasta (inte kompostera) de svullna knopparna på vintern innan de öppnar sig, för att minska spridning. Vid kraftigt angrepp kan det löna sig att skära ner hela grenar - kvalstret sprider dessutom ett virus som gradvis försämrar skörden om det får härja fritt år efter år.' },
      { symptom: 'Bären försvinner rakt av busken precis när de mognat.', orsak: 'Fåglar.', atgard: 'Fågelnät över busken i god tid innan mognad.' }
    ]
  },
  vitavinbar: {
    name: 'Vita vinbär', sub: 'C-vitamin · Mildare och sötare än röda vinbär', maintenance: 'latt',
    plantering: 'Samma som röda vinbär – plantera september–oktober eller april–maj, halvskugga till sol.',
    skotsel: ['Vattna vid torka första säsongen.', 'Beskär äldsta grenarna varje vinter.', 'Gödsla lätt på våren.'],
    skörd: 'Juli, plockas i hela klasar när bären är genomskinligt gulvita. Mildare smak än röda vinbär – godast helt färska.',
    tips: 'Lika lättskött som röda vinbär men mindre känt – ett fint alternativ om du vill ha något lite ovanligare.',
    vattning: 'Samma som röda vinbär: vattna vid torka första året, därefter klarar busken sig mestadels på naturlig nederbörd. Extra vatten under fruktsättning i juni–juli ger större bär.',
    problem: [
      { symptom: 'Bären försvinner precis när de mognat.', orsak: 'Fåglar - det klart största hotet mot skörden hos alla vinbär.', atgard: 'Nät över busken när bären börjar mogna, innan de blir attraktiva.' },
      { symptom: 'Bladen kruller ihop tidigt på säsongen.', orsak: 'Bladlöss.', atgard: 'Oftast kosmetiskt. Spola bort med vattenstråle vid kraftigt angrepp.' }
    ]
  },
  krusbar: {
    name: 'Krusbär', sub: 'C-vitamin · Fibrer · Antioxidanter', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, sol till halvskugga, 1,2–1,5 m mellan buskar.',
    skotsel: ['Vattna vid torka.', 'Beskär för öppen krona (bättre luftcirkulation minskar mjöldagg).', 'Gödsla på våren.'],
    skörd: 'Juli–augusti. Kan plockas något omogna (fortfarande gröna och fasta) för syltning, eller mogna och mjukare för att ätas färska.',
    tips: 'Törnen på grenarna – använd handskar vid plockning och beskärning.',
    vattning: 'Vattna vid torka, särskilt under fruktsättning i juni–juli. Undvik att vattna direkt på bladen/bären - det ökar risken för mjöldagg.',
    problem: [
      { symptom: 'Vitt, mjöligt eller filtat överdrag på bären och skotten.', orsak: 'Amerikansk krusbärsmjöldagg - en mycket vanlig svampsjukdom specifikt för krusbär, gynnas av tät plantering och fuktigt väder.', atgard: 'Beskär för öppen krona så luften cirkulerar bättre (redan en del av skötseln). Ta bort och kasta angripna skott/bär. Fråga efter en mjöldaggständig sort i plantskolan om problemet återkommer.' },
      { symptom: 'Skörden minskar trots att krusbär anses mindre lockande för fåglar.', orsak: 'Fåglar tar ändå av skörden om den är den enda mogna frukten i trädgården just då.', atgard: 'Nät kan behövas om du märker att skörden försvinner, även om risken är lägre än för söta bär som hallon.' }
    ]
  },
  hallon: {
    name: 'Hallon', sub: 'Fibrer · C-vitamin · Antioxidanter', maintenance: 'medel',
    plantering: 'Plantera rotskott vår eller höst i sol, i rad med stöd (ståltråd eller spaljé) för bäst resultat.',
    skotsel: ['Vattna regelbundet, särskilt vid fruktsättning.', 'Skär ner de kanor som burit frukt efter skörd (för höstbärande sorter: klipp ner allt på vintern).', 'Sprider sig via rotskott – håll koll på att det inte tar över.'],
    skörd: 'Juli–september beroende på sort. Plocka löpande när bären släpper lätt från fästet med en lätt vridning, bären håller inte länge efter plockning.',
    tips: 'Kräver lite mer aktiv skötsel än övriga bär pga beskärning, men belönar med mycket skörd.',
    vattning: 'Vattna regelbundet, särskilt vid fruktsättning i juli–augusti - hallon har grunda rötter och gynnas av jämn fukt. Torka ger mindre och torrare bär.',
    problem: [
      { symptom: 'Fåglar äter upp det mesta av skörden.', orsak: 'Fåglar är mycket förtjusta i hallon.', atgard: 'Nät är nästan ett måste om du vill ha någon skörd kvar till dig själv.' },
      { symptom: 'Små, vita eller brunaktiga larver inuti eller vid bären när du plockar.', orsak: 'Hallonbagge - en skalbagge vars larver utvecklas inuti det mognande bäret, mycket vanlig i svenska hallonodlingar.', atgard: 'Plocka bären så fort de mognar. Vid kraftigt angrepp: ta bort och kasta de allra första, tidigast mogna bären där larverna ofta märks mest.' },
      { symptom: 'Blad och unga skott är avätna.', orsak: 'Rådjur, särskilt tidigt på säsongen.', atgard: 'Nät eller staket runt beståndet under uppstartsfasen.' }
    ]
  },
  aronia: {
    name: 'Aronia', sub: 'Extremt hög andel antioxidanter · C-vitamin', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, klarar de flesta lägen inklusive halvskugga. Mindre känd men allt vanligare i svenska trädgårdar.',
    skotsel: ['Mycket tålig – vattna bara vid långvarig torka.', 'Minimal beskärning behövs.', 'I princip ingen gödning nödvändig.'],
    skörd: 'September, när bären är helt mörklila/svarta. Bären är mycket syrliga och strama färska – bäst i saft, sylt eller torkade.',
    tips: 'En av de mest skötselfria och näringstäta bärbuskarna som finns – låg insats, hög hälsovinst.',
    vattning: 'Mycket tålig - vattna bara vid långvarig torka (flera veckor utan regn), annars klarar sig aronia gott på naturlig nederbörd i Uppland.',
    problem: [
      { symptom: 'Bären smakar väldigt strävt/sammandragande, även fullt mogna.', orsak: 'Naturlig egenskap hos aronia - hög halt garvämnen (tanniner), inte ett tecken på fel eller sjukdom.', atgard: 'Inget att åtgärda - aronia äts sällan färsk rakt av busken. Bäst i saft, sylt, torkad, eller blandad med sötare frukt.' },
      { symptom: 'Skörden minskar oväntat.', orsak: 'Fåglar tar ibland av bären, även om den strama smaken gör aronia mindre lockande än söta bär.', atgard: 'Ofta det minst utsatta bäret i trädgården - nät sällan nödvändigt, men håll koll om andra bär redan är slut.' }
    ]
  },
  blabar: {
    name: 'Blåbär (odlad)', sub: 'C-vitamin · K-vitamin · Antioxidanter - trädgårdssort, inte samma art som skogsblåbär', maintenance: 'medel',
    plantering: 'Plantera vår eller höst i sur jord (pH ca 4,5–5,5) - vanlig trädgårdsjord är oftast för basisk, blanda in surjord/torv vid planteringen. Sol till halvskugga.',
    skotsel: ['Håll jorden fuktig men inte vattendränkt - mulch av bark eller barrförna hjälper.', 'Minimal beskärning de första åren, ta sedan bort de äldsta grenarna efter några år.', 'Gödsla med surjordsgödsel, inte vanlig trädgårdsgödsel.'],
    skörd: 'Juli–augusti, plocka löpande när bären är helt mörkblå och släpper lätt vid en lätt beröring.',
    tips: 'Den vanligaste missen är att plantera i vanlig, för basisk trädgårdsjord - kolla jordens pH innan plantering om du är osäker.',
    vattning: 'Håll jorden jämnt fuktig men aldrig vattendränkt - blåbär har grunda, finkorniga rötter som torkar ut snabbt men också lätt tar skada av syrebrist i blöt jord. Mulch (bark eller barrförna) hjälper jorden hålla jämn fukt.',
    problem: [
      { symptom: 'Bladen blir gula mellan de gröna bladnerverna.', orsak: 'Järnbrist orsakad av för hög jord-pH (för basisk jord) - blåbär kan inte ta upp järn effektivt om jorden inte är tillräckligt sur.', atgard: 'Kontrollera jordens pH och blanda in surjord/torv eller specialgödsel för surjordsväxter. Det här är den absolut vanligaste orsaken till svaga blåbärsbuskar i vanlig trädgårdsjord.' },
      { symptom: 'Bären försvinner precis när de mognat.', orsak: 'Fåglar är mycket förtjusta i blåbär.', atgard: 'Nät behövs nästan alltid för att få behålla någon skörd själv.' }
    ]
  },
  bjornbar: {
    name: 'Björnbär', sub: 'Fibrer · C-vitamin · Antioxidanter - växer på kanor, precis som hallon', maintenance: 'medel',
    plantering: 'Plantera vår eller höst i sol, med stöd (spaljé eller ståltråd) - många sorter har långa, kraftiga kanor. Törnfria sorter finns och är betydligt lättare att hantera.',
    skotsel: ['Vattna vid torka, särskilt under fruktsättning.', 'Bind upp kanorna mot stödet under säsongen.', 'Skär ner de kanor som burit frukt efter skörd, precis som höstbärande hallon.'],
    skörd: 'Augusti–september, plockas när bären är helt mörka/svarta och släpper lätt från busken utan att du behöver dra.',
    tips: 'Törnade sorter sprider sig aggressivt via rotskott och kan bli svåra att hålla efter i en mindre trädgård - en törnfri sort är ofta ett enklare val.',
    vattning: 'Vattna vid torka, särskilt under fruktsättning i augusti–september. Undvik att vattna direkt på bären/bladen i fuktigt väder - det ökar risken för gråmögel.',
    problem: [
      { symptom: 'Bären ruttnar eller får ett grått, ludet mögelöverdrag innan de hinner mogna klart.', orsak: 'Gråmögel (Botrytis) - vanligt på mjuka bär i fuktigt väder, särskilt om kanorna ligger tätt.', atgard: 'Plocka bort och kasta angripna bär direkt så mögelsporerna inte sprids till friska bär. Ge kanorna gott om luft genom att binda upp dem ordentligt mot stödet.' },
      { symptom: 'Fåglar och getingar tar av den mogna frukten.', orsak: 'Söt, mjuk frukt lockar båda.', atgard: 'Nät kan behövas vid kraftig konkurrens. Törnarna avskräcker rådjur ganska effektivt på egen hand.' }
    ]
  },
  havtorn: {
    name: 'Havtorn', sub: 'Mycket hög C-vitaminhalt - kräver både en hane och en hona för att sätta bär', maintenance: 'latt',
    plantering: 'Plantera vår eller höst i sol, tålig för mager och sandig jord. Havtorn är tvåbyggare - du behöver minst en hanplanta och en honplanta inom ca 5–10 m från varandra för att honplantan ska sätta bär.',
    skotsel: ['Mycket tålig och torktolerant när den väl etablerat sig.', 'Minimal beskärning behövs.', 'Klarar sig utan gödning i de flesta jordar.'],
    skörd: 'September - bären sitter tätt mot grenarna och är sura. Vanligast att skörda hela grenar och frysa innan bären knäpps av, eller pressa saft direkt.',
    tips: 'Den vanligaste missen är att bara plantera en enda planta och undra varför den aldrig ger bär - kolla att du har både hane och hona innan du planterar.',
    vattning: 'Mycket torktålig när den väl etablerat sig - vattna bara det första året. En etablerad havtornsbuske klarar sig på naturlig nederbörd även i torra, sandiga jordar.',
    problem: [
      { symptom: 'Plantan sätter aldrig bär trots flera år i marken.', orsak: 'Nästan alltid avsaknad av en hanplanta i närheten - havtorn är tvåbyggare, och honplantan kan inte sätta bär utan pollen från en hane.', atgard: 'Kontrollera att du har minst en hanplanta inom 5–10 m. Fråga i plantskolan om du är osäker på vilket kön din planta är - hanar och honor går att skilja åt i blomning men inte annars.' }
    ]
  },
  jordgubbar: {
    name: 'Jordgubbar (bonus)', sub: 'C-vitamin · Fibrer · Antioxidanter · inte en buske, men hör hemma i samma hörna', maintenance: 'latt',
    plantering: 'Plantera plantor i april eller augusti, sol, 30 cm mellanrum.',
    skotsel: ['Vattna regelbundet, särskilt vid fruktsättning.', 'Lägg halm under plantorna så bären hålls rena och torra.', 'Ta bort revor (utlöpare) om du inte vill att de ska sprida sig, eller låt dem rota för fler plantor.'],
    skörd: 'Juni–juli. Plocka löpande när bären är helt röda ända ut i spetsen, inga vita eller gröna partier kvar.',
    tips: 'Plantorna tappar kraft efter 3–4 år – förnya gärna en tredjedel av beståndet varje år via revorna.',
    vattning: 'Vattna regelbundet, särskilt vid blomning och fruktsättning i maj–juni - ojämn vattning ger mindre och torrare bär. Vattna vid roten, inte på bären/bladen, för att minska risken för mögel.',
    problem: [
      { symptom: 'Bären ruttnar med ett gråluddigt mögelöverdrag innan de hinner bli helt röda.', orsak: 'Gråmögel (Botrytis) - mycket vanligt på jordgubbar i fuktigt väder, särskilt om bären ligger direkt mot fuktig jord.', atgard: 'Halm under plantorna (redan en del av skötseln) håller bären upplyfta och torra. Plocka bort angripna bär direkt så mögelsporerna inte sprids.' },
      { symptom: 'Hål i bären, ofta med blanka slemspår.', orsak: 'Sniglar.', atgard: 'Halm under plantorna gör miljön mindre snigelvänlig. Ölfällor eller handplockning kvällstid vid kraftigt angrepp.' },
      { symptom: 'Bären försvinner precis när de mognar.', orsak: 'Fåglar - tar gärna bären precis när de mognar.', atgard: 'Ett löst nät eller tyg över plantorna under mognadsperioden hjälper mycket.' },
      { symptom: 'Hela plantor är avätna eller nedtrampade.', orsak: 'Rådjur - äter gärna hela plantan om de kommer åt.', atgard: 'Ett lågt staket runt odlingen är värt att överväga om rådjur är ett problem hos dig.' }
    ]
  }
};

// Allmänt rådjursskydd, visas som en introtext i Bärbuskar-vyn eftersom det
// gäller hela trädgården snarare än en specifik gröda.
const DEER_GENERAL_TIP = 'Rådjur äter i princip vad som helst om de är hungriga nog, men undviker ofta starkt doftande växter (lavendel, mynta, vitlök) och taggiga buskar. Ett enkelt staket runt de mest utsatta odlingarna, eller doftavskräckande medel från trädgårdsbutiken, är de mest pålitliga skydden.';
