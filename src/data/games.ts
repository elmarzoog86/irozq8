export interface Game {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  minPlayers: number;
  maxPlayers: number;
  image: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

export const games: Game[] = [
  {
    id: 'questions',
    nameAr: 'سؤال و جواب',
    nameEn: 'Questions Game',
    descriptionAr: 'لعبة أسئلة تفاعلية متنوعة للاعبين الأسرع في الإجابة',
    descriptionEn: 'Interactive questions game for the fastest players to answer',
    minPlayers: 2,
    maxPlayers: 100,
    image: '/images/games/questions-hero.svg',
    isNew: true,
  },
  {
    id: 'roulette',
    nameAr: 'الروليت',
    nameEn: 'Roulette',
    descriptionAr: 'خلها تقب بين المتابعين في الشات',
    descriptionEn: 'Spin the wheel among viewers in the chat',
    minPlayers: 2,
    maxPlayers: 100,
    image: '/images/games/roulette-hero.svg',
  },
  {
    id: 'fruits-war',
    nameAr: 'حرب الفواكه',
    nameEn: 'Fruits War',
    descriptionAr: 'اللعبة تعتمد على تعيين فواكه أو خضروات لكل لاعب ويتم الإقصاء بالنقر، تنافس من أجل البقاء!',
    descriptionEn: 'Each player is assigned a fruit or vegetable and is eliminated by clicking. Compete to survive!',
    minPlayers: 2,
    maxPlayers: 100,
    image: '/images/games/fruits-war-hero.svg',
  },
  {
    id: 'chairs',
    nameAr: 'لعبة كراسي',
    nameEn: 'Musical Chairs',
    descriptionAr: 'لعبة الكراسي الموسيقية: امشِ حول الكراسي وعندما تتوقف الموسيقى يجب الجلوس بسرعة! كل جولة يتم استبعاد لاعب حتى يبقى فائز واحد.',
    descriptionEn: 'Musical Chairs game: Walk around the chairs and when the music stops, sit down quickly! Each round, one player is eliminated until one winner remains.',
    minPlayers: 3,
    maxPlayers: 20,
    isNew: true,
    isUpdated: false,
    image: '/images/games/chairs-hero.svg',
  }
];
