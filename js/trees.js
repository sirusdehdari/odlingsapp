// Fruktträd - fristående guide, samma mönster som berries.js. Kopplas till
// ett träd-objekt på tomten via dess species-id (matchar TREE_SPECIES.frukt).
const FRUIT_TREES = {
  appel: {
    name: 'Äppelträd', sub: 'Vår vanligaste fruktträd - kräver oftast en pollineringspartner', maintenance: 'medel',
    plantering: 'Plantera barrotat träd okt–nov eller mar–apr, i sol. De flesta sorter är inte självfertila - ha en annan äppelsort (eller ett vildapel/rönn i närheten kan hjälpa lite) inom ca 10–15 m för bra pollinering och skörd.',
    skotsel: ['Beskär i sen vinter (feb–mars) innan savstigningen, för öppen krona och bättre luft/ljus.', 'Vattna extra första 1–2 åren tills trädet är etablerat.', 'Gödsla måttligt på våren - för mycket kväve ger mest blad, inte frukt.'],
    skörd: 'Augusti–oktober beroende på sort. Tidiga sorter äts direkt, sena sorter lagrar bäst svalt och mörkt.',
    tips: 'Den absolut vanligaste nybörjarmissen är att plantera ett enda äppelträd och undra varför det ger lite frukt - kolla alltid pollineringsbehovet för din sort innan du planterar.',
    skadedjur: 'Vintermal (larver äter knoppar och blad tidigt på säsongen) och äppelskorv (svampsjukdom, vanlig i fuktiga svenska vårar) är de vanligaste problemen. Rådjur gnager gärna bark och unga skott på nyplanterade träd - stamskydd rekommenderas de första åren.'
  },
  paron: {
    name: 'Päronträd', sub: 'Vill ha varmare läge än äpple - kräver nästan alltid en pollineringspartner', maintenance: 'medel',
    plantering: 'Plantera okt–nov eller mar–apr, sydvänt och skyddat läge om möjligt - päron är känsligare för sen vårfrost än äpple. Nästan alla sorter behöver en annan päronsort inom ca 10–15 m för pollinering.',
    skotsel: ['Beskär i sen vinter för öppen krona.', 'Vattna extra de första åren.', 'Gödsla måttligt på våren.'],
    skörd: 'Augusti–september. Plockas ofta något omogna och eftermognar inomhus för bäst konsistens och smak.',
    tips: 'Om du bara har plats för ett fruktträd och vill ha säker skörd utan pollineringskrångel är plommon eller krikon ett enklare val än päron.',
    skadedjur: 'Päronpest förekommer men är ovanligare i Sverige än i varmare klimat. Päronskorv (liknande äppelskorv) och bladlöss är vanligare. Rådjur/gnagare kan skada unga stammar.'
  },
  plommon: {
    name: 'Plommonträd', sub: 'Flera sorter (t.ex. Victoria) är delvis självfertila', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, i sol. Många plommonsorter ger frukt även utan pollineringspartner, men skörden blir ofta större med en till i närheten.',
    skotsel: ['Beskär helst på sommaren, inte vintern - vinterbeskärning ökar risken för silverglans (en svampsjukdom som kommer in genom sår i kallt, fuktigt väder).', 'Vattna vid torka, särskilt under fruktsättning.', 'Gödsla måttligt på våren.'],
    skörd: 'Augusti–september, plockas när frukten släpper lätt från grenen.',
    tips: 'Ett bra förstaträd om du vill ha hög sannolikhet för skörd utan att behöva tänka på pollineringspartner.',
    skadedjur: 'Plommonstekel (larver i de unga frukterna, syns som tidigt frukt fall) och monilia (brunröta, särskilt i fuktiga somrar) är de vanligaste problemen. Fåglar och getingar tar gärna av den mogna, söta frukten.'
  },
  korsbar: {
    name: 'Körsbärsträd', sub: 'Söta sorter kräver oftast pollineringspartner, surkörsbär är ofta självfertila', maintenance: 'medel',
    plantering: 'Plantera vår eller höst, i sol. Kolla om din sort är sötkörsbär (behöver oftast en partner) eller surkörsbär (t.ex. skuggmorell, ofta självfertil och mer skuggtåligt).',
    skotsel: ['Beskär på sommaren, aldrig på vintern - samma silverglans-risk som plommon.', 'Vattna vid torka.', 'Gödsla måttligt på våren.'],
    skörd: 'Juli. Bären mognar snabbt och ofta samtidigt - var redo att plocka under en kort period.',
    tips: 'Fåglar hittar mogna körsbär anmärkningsvärt snabbt - om du vill ha någon skörd alls till dig själv är nät över trädet (eller delar av det) nästan ett måste.',
    skadedjur: 'Fåglar är det klart största hotet mot skörden. Körsbärsflugans larver kan finnas i frukten - lite gulklistrade fällor i trädet under blomningen hjälper att övervaka angrepp.'
  },
  krikon: {
    name: 'Krikonträd', sub: 'Litet, plommonliknande, ofta självfertilt och mycket härdigt', maintenance: 'latt',
    plantering: 'Plantera vår eller höst, sol till halvskugga. Ett av de mest odlingssäkra fruktträden i svenskt klimat - klarar sig ofta bra utan pollineringspartner.',
    skotsel: ['Minimal beskärning behövs.', 'Vattna bara vid långvarig torka.', 'Klarar sig i princip utan gödning.'],
    skörd: 'Augusti–september. Frukterna är små men söta, bra för saft, sylt och att äta direkt.',
    tips: 'Ett utmärkt val om du vill ha ett fruktträd med minimal skötsel och hög tillförlitlighet - liknar plommon men ännu tåligare.',
    skadedjur: 'Generellt mindre utsatt för sjukdomar än äpple/päron. Fåglar och getingar kan ta av den mogna frukten, men skörden är oftast riklig nog att det inte spelar så stor roll.'
  }
};
