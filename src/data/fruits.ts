// Fruits data with Arabic names
export interface Fruit {
  emoji: string;
  nameAr: string;
  nameEn: string;
}

export const FRUITS_DATA: Fruit[] = [
  { emoji: '🍎', nameAr: 'تفاحة', nameEn: 'apple' },
  { emoji: '🍊', nameAr: 'برتقالة', nameEn: 'orange' },
  { emoji: '🍌', nameAr: 'موزة', nameEn: 'banana' },
  { emoji: '🍉', nameAr: 'بطيخ', nameEn: 'watermelon' },
  { emoji: '🍓', nameAr: 'فراولة', nameEn: 'strawberry' },
  { emoji: '🍋', nameAr: 'ليمونة', nameEn: 'lemon' },
  { emoji: '🫐', nameAr: 'توت أزرق', nameEn: 'blueberry' },
  { emoji: '🍒', nameAr: 'كرز', nameEn: 'cherry' },
  { emoji: '🍑', nameAr: 'خوخ', nameEn: 'peach' },
  { emoji: '🥝', nameAr: 'كيوي', nameEn: 'kiwi' },
  { emoji: '🍍', nameAr: 'أناناس', nameEn: 'pineapple' },
  { emoji: '🥭', nameAr: 'مانجو', nameEn: 'mango' },
  { emoji: '🍅', nameAr: 'طماطم', nameEn: 'tomato' },
  { emoji: '🍪', nameAr: 'مشقوق', nameEn: 'cookie' },
  { emoji: '🍰', nameAr: 'كيكة', nameEn: 'cake' },
];

// Get fruit data by index
export const getFruitData = (index: number): Fruit => {
  return FRUITS_DATA[index % FRUITS_DATA.length];
};

// Get fruit index by Arabic name
export const getFruitIndexByNameAr = (nameAr: string): number => {
  const index = FRUITS_DATA.findIndex(f => f.nameAr.toLowerCase() === nameAr.toLowerCase());
  return index >= 0 ? index : -1;
};

// Get fruit index by emoji
export const getFruitIndexByEmoji = (emoji: string): number => {
  const index = FRUITS_DATA.findIndex(f => f.emoji === emoji);
  return index >= 0 ? index : -1;
};
