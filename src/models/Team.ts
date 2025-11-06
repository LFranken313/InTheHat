import { Player } from './Player';
import { Word } from './Word';

export class Team {
  players: Player[];
  name: string;
  score: number;
  guessedWords: Word[];

  constructor(name: string, players: Player[] = [], score: number = 0, guessedWords: Word[] = []) {
    this.name = name;
    this.players = players;
    this.score = score;
    this.guessedWords = guessedWords;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  correctGuess(word: Word): void {
    this.score += 1;
    this.guessedWords.push(word);
  }

  removeGuessedWord(word: Word): void {
    this.guessedWords = this.guessedWords.filter(w => w.name !== word.name);
    if (this.score > 0) this.score -= 1;
  }

}