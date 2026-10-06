export interface BatumiDistrict {
  id: string;
  nameKa: string;
  nameEn: string;
  estimatedDelivery: string;
  deliveryFee: number; // in GEL (0 for promo / express)
  popularHub?: string;
}

export const BATUMI_DISTRICTS: BatumiDistrict[] = [
  {
    id: 'old-batumi',
    nameKa: 'ძველი ბათუმი (Old Batumi)',
    nameEn: 'Old Batumi',
    estimatedDelivery: '2 - 4 საათში (Fast Moto)',
    deliveryFee: 0,
    popularHub: 'ევროპის მოედანი / მემედ აბაშიძე',
  },
  {
    id: 'rustaveli',
    nameKa: 'რუსთაველის გამზირი / ბულვარი',
    nameEn: 'Rustaveli Ave / Boulevard',
    estimatedDelivery: '2 - 3 საათში',
    deliveryFee: 0,
    popularHub: 'შერატონთან / ბულვარი',
  },
  {
    id: 'bagrationi',
    nameKa: 'ბაგრატიონის უბანი',
    nameEn: 'Bagrationi District',
    estimatedDelivery: '3 - 5 საათში',
    deliveryFee: 0,
    popularHub: 'აღმაშენებლის კვეთა',
  },
  {
    id: 'khimshiashvili',
    nameKa: 'ხიმშიაშვილი / ახალი ბულვარი',
    nameEn: 'Khimshiashvili / New Boulevard',
    estimatedDelivery: '3 - 5 საათში',
    deliveryFee: 0,
    popularHub: 'ორბი სითი / გრანდ მოლი',
  },
  {
    id: 'chaoba',
    nameKa: 'ჭაობი / გორგილაძის გაგრძელება',
    nameEn: 'Chaoba Area',
    estimatedDelivery: '4 - 6 საათში',
    deliveryFee: 0,
    popularHub: 'მაიაკოვსკის მხარე',
  },
  {
    id: 'chavchavadze',
    nameKa: 'ჭავჭავაძის გამზირი / ცენტრი',
    nameEn: 'Chavchavadze Central',
    estimatedDelivery: '2 - 4 საათში',
    deliveryFee: 0,
    popularHub: 'თბილისის მოედანი',
  },
  {
    id: 'makhinjauri',
    nameKa: 'მახინჯაური / მწვანე კონცხი',
    nameEn: 'Makhinjauri / Green Cape',
    estimatedDelivery: 'იმავე დღეს (Same Day)',
    deliveryFee: 5,
    popularHub: 'ბოტანიკურის მიმდებარე',
  },
  {
    id: 'khelvachauri',
    nameKa: 'ხელვაჩაური / გონიო-კვარიათი',
    nameEn: 'Khelvachauri / Gonio',
    estimatedDelivery: 'იმავე დღეს (Same Day)',
    deliveryFee: 5,
    popularHub: 'სანაპირო ზოლი',
  },
  {
    id: 'chakvi',
    nameKa: 'ჩაქვი / ციხისძირი',
    nameEn: 'Chakvi / Tsikhisdziri',
    estimatedDelivery: '24 საათში',
    deliveryFee: 6,
    popularHub: 'ოაზისის მიმდებარე',
  },
];
