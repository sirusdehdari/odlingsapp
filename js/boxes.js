// Static option lists for the plot grid's type-picker. Species content here
// is intentionally minimal (labels only) - full care-info cards for trees
// and additional bushes are later work, not needed for placing objects.

const OBJECT_TYPE_LABELS = {
  gras: '🌱 Gräs', trad: '🌳 Träd', buske: '🫐 Buske', sten: '🪨 Sten',
  grusgang: '⬜ Grusgång/sten', byggnad: '🏠 Byggnad', altan: '🪵 Altan',
  hack: '🌲 Häck', box: '📦 Odlingslåda'
};

const TREE_SPECIES = {
  frukt: [
    { id: 'appel', name: 'Äppelträd' },
    { id: 'paron', name: 'Päronträd' },
    { id: 'plommon', name: 'Plommonträd' },
    { id: 'korsbar', name: 'Körsbärsträd' },
    { id: 'krikon', name: 'Krikonträd' }
  ],
  ickefrukt: [
    { id: 'bjork', name: 'Björk' },
    { id: 'gran', name: 'Gran' },
    { id: 'tall', name: 'Tall' },
    { id: 'lonn', name: 'Lönn' },
    { id: 'ek', name: 'Ek' },
    { id: 'valnot', name: 'Valnöt' },
    { id: 'ovrigt', name: 'Övrigt träd' }
  ]
};

// Reuses BERRIES ids where a fruiting bush already has a full guide entry
// (see berries.js); "ovrigt" covers purely ornamental bushes.
const BUSH_SPECIES = [
  { id: 'rodavinbar', name: 'Röda vinbär' },
  { id: 'vitavinbar', name: 'Vita vinbär' },
  { id: 'krusbar', name: 'Krusbär' },
  { id: 'hallon', name: 'Hallon' },
  { id: 'aronia', name: 'Aronia' },
  { id: 'blabar', name: 'Blåbär (odlad)' },
  { id: 'bjornbar', name: 'Björnbär' },
  { id: 'havtorn', name: 'Havtorn' },
  { id: 'ovrigt', name: 'Övrig/prydnadsbuske' }
];
