// Statisk uppsättning av dina odlingslådor. Ändra siffrorna här om antalet lådor ändras.
const BOX_CONFIG = [
  ...Array.from({ length: 7 }, (_, i) => ({ id: `skugga-${i + 1}`, zone: 'skugga', name: `Häcken ${i + 1}` })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `sol-${i + 1}`, zone: 'sol', name: `Soliga ${i + 1}` }))
];
