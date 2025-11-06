import {Game} from '../models/Game';
import {Player} from '../models/Player';
import {Word} from '../models/Word';
import {Team} from '../models/Team';
import {GameStateService} from './GameStateService';
import {WordService} from './WordService';
import {GameFactory} from '../models/GameFactory';

export class GameService {
    private game: Game | null = null;
    private gameFactory: GameFactory;

    constructor(
        private gameStateService: GameStateService,
        private wordService: WordService
    ) {
        this.gameFactory = new GameFactory(this.wordService);
    }

    async continueGame(): Promise<Game> {
        const loadedGame = await this.gameStateService.loadGameState();
        if (!loadedGame) throw new Error('No game loaded');
        this.game = loadedGame;
        return this.game;
    }

    async initializeGame(
        playerNames: string[],
        numberOfTeams: number,
        numberOfRoundsToPlay: number,
        numberOfWords: number,
        chosenCategories?: string[],
        customWords?: string[]): Promise<Game> {
        this.game = await this.gameFactory.createGame(
            playerNames,
            numberOfTeams,
            numberOfRoundsToPlay,
            numberOfWords,
            chosenCategories,
            customWords);
        await this.gameStateService.saveGameState(this.game);
        return this.game;
    }

    async fetchPlayerToPlay(): Promise<Player> {
        if (!this.game) throw new Error('No game loaded');
        const currentPlayer = this.game.nextPlayer();
        await this.gameStateService.saveGameState(this.game);
        return currentPlayer;
    }

    async wordGuessed(wordName: string, playerName: string, timeLeft?: number): Promise<void> {
        if (!this.game) throw new Error('No game loaded');

        const word = this.game.wordsLeftInTheHat.find(w => w.name === wordName);
        if (!word) throw new Error('Word not found');

        const team = this.game.teams.find(t => t.players.some(p => p.name === playerName));
        if (!team) throw new Error('Team not found');

        this.game.removeWordFromHat(word);
        team.correctGuess(word);

        if (this.game.wordsLeftInTheHat.length === 0 && typeof timeLeft === 'number') {
            this.game.carryOverPlayerName = playerName;
            this.game.carryOverTime = timeLeft;
        }

        await this.gameStateService.saveGameState(this.game);
    }

    async undoLastGuess(wordName: string): Promise<void> {
        if (!this.game) throw new Error('No game loaded');
        const word = this.game.words.find(w => w.name === wordName);
        if (!word) throw new Error('Word not found');
        this.game.restoreWordToHat(word);
        this.game.removeWordFromTeams(word);
        await this.gameStateService.saveGameState(this.game);
    }

    wordToGuessFromHat(): Word {
        if (!this.game) throw new Error('No game loaded');
        if (this.game.wordsLeftInTheHat.length === 0) throw new Error('End of round');
        const idx = Math.floor(Math.random() * this.game.wordsLeftInTheHat.length);
        return this.game.wordsLeftInTheHat[idx];
    }

    async startNewRound(): Promise<Game> {
        if (!this.game) throw new Error('No game loaded');
        this.game.advanceRound();
        this.initializeWordsInTheHat();
        if (this.game.carryOverPlayerName && this.game.carryOverTime) {
            const idx = this.game.turnOrder.findIndex(p => p.name === this.game.carryOverPlayerName);
            if (idx > -1) {
                const [player] = this.game.turnOrder.splice(idx, 1);
                this.game.turnOrder.unshift(player);
            }
        }
        await this.gameStateService.saveGameState(this.game);
        return this.game;
    }

    private initializeWordsInTheHat(): void {
        if (!this.game) throw new Error('No game loaded');
        this.game.wordsLeftInTheHat = [...this.game.words];
    }
}