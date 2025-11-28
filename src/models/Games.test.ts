import {Word} from './Word';
import {Player} from './Player';
import {Game} from "./Game";

let sut: Game;

describe('Game', () => {
    it.each([
        [3, 6],
        [2, 5],
        [4, 10],
        [2, 4],
        [5, 11]
    ])('createTeams creates %i teams with %i players', (numTeams, numPlayers) => {
        sut = new Game();
        addPlayers(sut, numPlayers);

        sut.createTeams(numTeams);
        sut.assignPlayersToTeams();

        expect(sut.teams.length).toBe(numTeams);

        const teamSizes = sut.teams.map(team => team.players.length);
        const maxSize = Math.max(...teamSizes);
        const minSize = Math.min(...teamSizes);

        expect(maxSize - minSize).toBeLessThanOrEqual(1);
    });

    it.each([
        [2, 5],
        [2, 4],
        [3, 7],
        [3, 6]
    ])('Turn order works for %i teams and %i players, no team twice in a row', (numTeams, numPlayers) => {
        sut = new Game();
        initializeGame(sut, 20, numPlayers);
        sut.createTeams(numTeams);
        sut.assignPlayersToTeams();
        sut.initializeTurnOrder();

        const initialSizes = sut.teams.map(team => team.players.length);

        const teamIndices: number[] = [];
        for (let i = 0; i < sut.teams.length; i++) {
            const player = sut.nextPlayer();
            const teamIdx = sut.teams.findIndex(team => team.players.includes(player));
            teamIndices.push(teamIdx);
        }

        for (let i = 1; i < teamIndices.length; i++) {
            expect(teamIndices[i]).not.toBe(teamIndices[i - 1]);
        }

        const expectedSizes = initialSizes.map(size => size - 1);
        const lengths = sut.turnOrder.map(arr => arr.length);
        expect(lengths).toEqual(expectedSizes);
    });
})

function addWords(game: Game, numWords: number) {
    for (let i = 1; i <= numWords; i++) {
        game.words.push(new Word(`word${i}`, `category${Math.ceil(i / 5)}`));
    }
}

function addPlayers(game: Game, numPlayers: number) {
    for (let i = 1; i <= numPlayers; i++) {
        game.players.push(new Player(`player${i}`));
    }
}

function initializeGame(game: Game, numWords: number, numPlayers: number) {
    addWords(game, numWords);
    addPlayers(game, numPlayers);
}