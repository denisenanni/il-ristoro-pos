import type { Product } from '../types';

export const products: Product[] = [
  // Pinse Rosse
  {
    id: 'pr-margherita',
    name: 'Margherita',
    description: 'Pomodoro, fior di latte',
    price: 8.0,
    category: 'pinse-rosse',
  },
  {
    id: 'pr-diavola',
    name: 'Diavola',
    description: 'Pomodoro, fior di latte, salame piccante',
    price: 10.0,
    category: 'pinse-rosse',
  },
  {
    id: 'pr-norma',
    name: 'Norma',
    description: 'Pomodoro, fior di latte, melanzane, ricotta salata',
    price: 10.0,
    category: 'pinse-rosse',
  },
  {
    id: 'pr-prosciutto',
    name: 'Prosciutto e Funghi',
    description: 'Pomodoro, fior di latte, prosciutto cotto, funghi',
    price: 10.0,
    category: 'pinse-rosse',
  },
  {
    id: 'pr-salsiccia',
    name: 'Salsiccia e Friarielli',
    description: 'Pomodoro, fior di latte, salsiccia, friarielli',
    price: 11.0,
    category: 'pinse-rosse',
  },

  // Pinse Bianche
  {
    id: 'pb-bianca',
    name: 'Bianca',
    description: 'Fior di latte, olio EVO',
    price: 7.0,
    category: 'pinse-bianche',
  },
  {
    id: 'pb-bresaola',
    name: 'Bresaola e Rucola',
    description: 'Fior di latte, bresaola, rucola, grana',
    price: 12.0,
    category: 'pinse-bianche',
  },
  {
    id: 'pb-crudo',
    name: 'Crudo e Burrata',
    description: 'Burrata, prosciutto crudo, pomodorini',
    price: 13.0,
    category: 'pinse-bianche',
  },
  {
    id: 'pb-patate',
    name: 'Patate e Rosmarino',
    description: 'Fior di latte, patate, rosmarino, pancetta',
    price: 10.0,
    category: 'pinse-bianche',
  },
  {
    id: 'pb-4formaggi',
    name: 'Quattro Formaggi',
    description: 'Fior di latte, gorgonzola, grana, provola',
    price: 11.0,
    category: 'pinse-bianche',
  },

  // Pinse Fredde
  {
    id: 'pf-caprese',
    name: 'Caprese',
    description: 'Mozzarella, pomodorini, basilico, olio EVO',
    price: 10.0,
    category: 'pinse-fredde',
  },
  {
    id: 'pf-tonno',
    name: 'Tonno e Cipolla',
    description: 'Fior di latte, tonno, cipolla rossa',
    price: 10.0,
    category: 'pinse-fredde',
  },

  // Taglieri
  {
    id: 'tg-salumi',
    name: 'Tagliere Salumi',
    description: 'Selezione di salumi misti',
    price: 14.0,
    category: 'taglieri',
  },
  {
    id: 'tg-formaggi',
    name: 'Tagliere Formaggi',
    description: 'Selezione di formaggi misti',
    price: 14.0,
    category: 'taglieri',
  },
  {
    id: 'tg-misto',
    name: 'Tagliere Misto',
    description: 'Salumi e formaggi misti',
    price: 18.0,
    category: 'taglieri',
  },

  // Fritti
  {
    id: 'fr-supplì',
    name: 'Supplì al Telefono',
    description: 'Supplì classici romani, ragù e mozzarella',
    price: 1.5,
    category: 'fritti',
  },
  {
    id: 'fr-fiori',
    name: 'Fiori di Zucca Fritti',
    description: 'Fiori di zucca con mozzarella e alici',
    price: 2.0,
    category: 'fritti',
  },
  {
    id: 'fr-crocchette',
    name: 'Crocchette di Patate',
    description: 'Crocchette di patate con mozzarella',
    price: 1.5,
    category: 'fritti',
  },
  {
    id: 'fr-olive',
    name: 'Olive Ascolane',
    description: 'Olive ripiene fritte',
    price: 1.5,
    category: 'fritti',
  },
  {
    id: 'fr-misto',
    name: 'Fritto Misto',
    description: 'Selezione di fritti misti (6 pezzi)',
    price: 8.0,
    category: 'fritti',
  },

  // Bevande
  {
    id: 'bv-acqua-nat',
    name: 'Acqua Naturale',
    description: '0.5L',
    price: 1.5,
    category: 'bevande',
  },
  {
    id: 'bv-acqua-friz',
    name: 'Acqua Frizzante',
    description: '0.5L',
    price: 1.5,
    category: 'bevande',
  },
  {
    id: 'bv-coca',
    name: 'Coca Cola',
    description: '0.33L',
    price: 3.0,
    category: 'bevande',
  },
  {
    id: 'bv-fanta',
    name: 'Fanta',
    description: '0.33L',
    price: 3.0,
    category: 'bevande',
  },
  {
    id: 'bv-sprite',
    name: 'Sprite',
    description: '0.33L',
    price: 3.0,
    category: 'bevande',
  },
  {
    id: 'bv-limonata',
    name: 'Limonata',
    description: 'San Pellegrino 0.33L',
    price: 3.0,
    category: 'bevande',
  },
  {
    id: 'bv-succo',
    name: 'Succo di Frutta',
    description: 'Pera, Pesca, Albicocca',
    price: 2.5,
    category: 'bevande',
  },

  // Birre
  {
    id: 'bir-nastro',
    name: 'Nastro Azzurro',
    description: '0.33L',
    price: 4.0,
    category: 'birre',
  },
  {
    id: 'bir-peroni',
    name: 'Peroni',
    description: '0.33L',
    price: 4.0,
    category: 'birre',
  },
  {
    id: 'bir-corona',
    name: 'Corona',
    description: '0.33L',
    price: 4.5,
    category: 'birre',
  },
  {
    id: 'bir-artigianale',
    name: 'Birra Artigianale',
    description: 'Chiara o Rossa 0.5L',
    price: 6.0,
    category: 'birre',
  },
];

export const categoryLabels: Record<string, string> = {
  'pinse-rosse': 'Pinse Rosse',
  'pinse-bianche': 'Pinse Bianche',
  'pinse-fredde': 'Pinse Fredde',
  taglieri: 'Taglieri',
  fritti: 'Fritti',
  bevande: 'Bevande',
  birre: 'Birre',
};

export const categories = Object.keys(categoryLabels) as Array<
  keyof typeof categoryLabels
>;
