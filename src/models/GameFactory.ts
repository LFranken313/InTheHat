import {Game} from './Game';
import {Player} from './Player';
import {Word} from './Word';
import {WordService} from '../logic/WordService';

export class GameFactory {
    constructor(private wordService: WordService) {
    }

    async createGame(
        customGame: boolean,
        playerNames: string[],
        numberOfTeams: number,
        numberOfRoundsToPlay: number,
        numberOfWords: number,
        chosenCategories?: string[],
        customWords?: string[]
    ): Promise<Game> {
        let wordObjects: Word[];
        if (customWords && customWords.length > 0) {
            wordObjects = customWords.map(w => ({name: w, category: 'Custom'}));
            //TODO: persist custom words
            // await this.wordService.saveCustomWords(customWords);
        } else {
            const allWords = chosenCategories
                .flatMap(cat => this.wordService.findByCategory(cat));
            wordObjects = this.shuffle(allWords).slice(0, numberOfWords);
        }
        return this.setupGame(
            customGame,
            wordObjects,
            playerNames,
            numberOfTeams,
            numberOfRoundsToPlay
        );
    }

    private setupGame(
        customGame: boolean,
        words: Word[],
        playerNames: string[],
        numberOfTeams: number,
        numberOfRoundsToPlay: number
    ): Game {
        const game = new Game();
        game.customGame = customGame;
        game.currentRound = 1;
        game.numberOfRoundsToPlay = numberOfRoundsToPlay;
        game.players = playerNames.map(name => new Player(name));
        game.words = [...words];
        game.createTeams(numberOfTeams);
        game.assignPlayersToTeams();
        game.initializeTurnOrder();
        game.initializeWordsInTheHat();
        return game;
    }

    private shuffle<T>(array: T[]): T[] {
        return array
            .map(value => ({value, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({value}) => value);
    }
}