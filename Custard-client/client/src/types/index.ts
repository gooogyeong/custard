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

export interface CardForm {
  deckKey: string;
  cardType: CardType;
  question: string;
  answer: string;
  answerTarget: string[];
  hint: string;
}

export interface Card {
  key: string;
  deckKey: string;
  cardType: CardType;
  question: string; //text or image
  answer: string;
  answerTarget: string[];
  hint: string; //text or image
  createdAt: string;
  lastStudiedAt: string;
  coverCount: number;
  correctCount: number;
  wrongCount: number;
  marked: boolean;
}

export enum AnswerType {
  correct,
  wrong,
}
