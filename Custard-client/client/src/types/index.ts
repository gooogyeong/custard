export interface User {
  uuid: string;
  email: string;
  username: string;
}

//그니까 다 deck에 저장되는데 ui상으로만 위계적으로 보이는거?
export interface Deck {
  key: string;
  uuid: string;
  authorId: string;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
  cards: string[]; //card의 key들을 저장
  subDecks: string[];
  superDecks: string[];
}

export enum CardType {
  flash,
  fill,
}

export interface Card {
  key: string;
  deckId: string;
  cartType: CardType;
  question: string; //text or image
  answer: string;
  answerTarget: string[];
  hint: string; //text or image
  createdAt: string;
  lastStudiedAt: string;
  coverCount: number;
  marked: boolean;
  correctCount: number;
  wrongCount: number;
  lastStudied: string;
}
