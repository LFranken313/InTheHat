import { GameService } from './GameService';
import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { Word } from '../models/Word';
import { Team } from '../models/Team';

const mockSaveGameState = jest.fn();
const mockLoadGameState = jest.fn();

const mockGameStateService = {
    saveGameState: mockSaveGameState,
    loadGameState: mockLoadGameState,
};

const mockWordService = {
    findByCategory: jest.fn((category: string) => {
        return [
            new Word('apple', category),
            new Word('banana', category),
            new Word('cherry', category),
            new Word('date', category),
            new Word('elderberry', category),
            new Word('fig', category),
            new Word('grape', category),
            new Word('honeydew', category),
            new Word('kiwi', category),
            new Word('lemon', category)
        ];
    })
};

describe('GameService', () => {
    let service: GameService;
    let game: Game;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new GameService(
            mockGameStateService as any,
            mockWordService as any
        );

        game = new Game();
        game.players = [new Player('Alice'), new Player('Bob'), new Player('Carol')];
        game.words = [new Word('apple', 'fruit'), new Word('banana', 'fruit')];
        game.wordsLeftInTheHat = [...game.words];
        game.teams = [
            new Team('Team1', [game.players[0]], 0),
            new Team('Team2', [game.players[1], game.players[2]], 0)
        ];
        game.turnOrder = [[game.players[0]], [game.players[1], game.players[2]]];
        game.wordsLeftInTheHat = [...game.words];
        mockLoadGameState.mockResolvedValue(game);
    });

    test('continueGame loads and returns the game', async () => {
        const result = await service.continueGame();
        expect(result).toBe(game);
        expect(service['game']).toBe(game);
    });

    test('continueGame throws if no game loaded', async () => {
        mockLoadGameState.mockResolvedValue(null);
        await expect(service.continueGame()).rejects.toThrow('No game loaded');
    });

    test('initializeGame creates and saves a game', async () => {
        const result = await service.initializeGame(['Alice', 'Bob'], 2, 3, 10, ['fruit']);
        expect(result).toBeInstanceOf(Game);
        expect(result.players.map(p => p.name)).toEqual(expect.arrayContaining(['Alice', 'Bob']));
        expect(result.players.length).toBe(2);
        expect(result.teams.length).toBe(2);
        expect(result.words.length).toBe(10);
        expect(mockSaveGameState).toHaveBeenCalledWith(result);
    });

    test('fetchPlayerToPlay returns next player and saves game', async () => {
        service['game'] = game;
        const nextPlayer = await service.fetchPlayerToPlay();
        expect(nextPlayer).toBeInstanceOf(Player);
        expect(mockSaveGameState).toHaveBeenCalledWith(game);
    });

    test('fetchPlayerToPlay throws if no game loaded', async () => {
        service['game'] = null;
        await expect(service.fetchPlayerToPlay()).rejects.toThrow('No game loaded');
    });

    test('wordGuessed marks word, updates team, saves state', async () => {
        service['game'] = game;
        const team = game.teams[0];
        game.wordsLeftInTheHat = [game.words[0]];
        await service.wordGuessed('apple', 'Alice', 5);
        expect(game.wordsLeftInTheHat.length).toBe(0); // Now the count goes down
        expect(game.carryOverPlayerName).toBe('Alice');
        expect(team.guessedWords).toContain(game.words[0]);
        expect(game.carryOverTime).toBe(5);
        expect(mockSaveGameState).toHaveBeenCalledWith(game);
    });

    test('wordGuessed throws if word not found', async () => {
        service['game'] = game;
        await expect(service.wordGuessed('notaword', 'Alice')).rejects.toThrow('Word not found');
    });

    test('wordGuessed throws if team not found', async () => {
        service['game'] = game;
        await expect(service.wordGuessed('apple', 'NotAPlayer')).rejects.toThrow('Team not found');
    });

    test('undoLastGuess restores word to hat and deducts team score', async () => {
        service['game'] = game;
        const team = game.teams[0];
        const word = game.words[0];

        game.wordsLeftInTheHat = [];
        team.guessedWords = [word];
        team.score = 1;

        await service.undoLastGuess('apple');

        expect(game.wordsLeftInTheHat).toContain(word);
        expect(team.guessedWords).not.toContain(word);
        expect(team.score).toBe(0);
        expect(mockSaveGameState).toHaveBeenCalledWith(game);
    });


    test('undoLastGuess throws if word not found', async () => {
        service['game'] = game;
        await expect(service.undoLastGuess('notaword')).rejects.toThrow('Word not found');
    });

    test('wordToGuessFromHat returns a word', () => {
        service['game'] = game;
        const word = service.wordToGuessFromHat();
        expect(word).toBeInstanceOf(Word);
    });

    test('wordToGuessFromHat throws if no game loaded', () => {
        service['game'] = null;
        expect(() => service.wordToGuessFromHat()).toThrow('No game loaded');
    });

    test('wordToGuessFromHat throws if no words left', () => {
        service['game'] = game;
        game.wordsLeftInTheHat = [];
        expect(() => service.wordToGuessFromHat()).toThrow('End of round');
    });

    test('startNewRound advances round, resets hat, updates turnOrder, saves', async () => {
        service['game'] = game;
        game.carryOverPlayerName = 'Alice';
        game.carryOverTime = 10;
        const prevRound = game.currentRound;
        game.wordsLeftInTheHat = [];

        await service.startNewRound();

        expect(game.currentRound).toBe(prevRound + 1);
        expect(game.wordsLeftInTheHat).toEqual(game.words);
        expect(game.turnOrder[0][0].name).toBe('Alice');
        expect(mockSaveGameState).toHaveBeenCalledWith(game);
    });

    test('startNewRound without carry-over does not change turnOrder', async () => {
        service['game'] = game;
        game.carryOverPlayerName = null;
        game.carryOverTime = null;
        const prevRound = game.currentRound;
        const prevTurnOrder = JSON.stringify(game.turnOrder);

        await service.startNewRound();

        expect(game.currentRound).toBe(prevRound + 1);
        expect(game.wordsLeftInTheHat).toEqual(game.words);
        expect(JSON.stringify(game.turnOrder)).toBe(prevTurnOrder);
        expect(mockSaveGameState).toHaveBeenCalledWith(game);
    });

    test('startNewRound throws if no game loaded', async () => {
        service['game'] = null;
        await expect(service.startNewRound()).rejects.toThrow('No game loaded');
    });

    test('team scores update correctly after multiple guesses and undos', async () => {
        service['game'] = game;
        const team1 = game.teams[0];

        expect(game.wordsLeftInTheHat.length).toBe(2);
        await service.wordGuessed('apple', 'Alice');
        expect(team1.score).toBe(1);
        await service.undoLastGuess('apple');
        expect(game.wordsLeftInTheHat.length).toBe(2);
        expect(team1.score).toBe(0);
        await service.wordGuessed('banana', 'Alice');
        await service.wordGuessed('apple', 'Alice');
        await service.undoLastGuess('apple');
        expect(game.wordsLeftInTheHat.length).toBe(1);
        expect(team1.score).toBe(1);
    });
});