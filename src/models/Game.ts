import {Word} from './Word';
import {Player} from './Player';
import {Team} from './Team';
import randomTeamNames from '../assets/RandomTeamNames.json'

export class Game {
    words: Word[] = [];
    players: Player[] = [];
    teams: Team[] = [];
    turnOrder: Player[][] = [];
    wordsLeftInTheHat: Word[] = [];
    currentRound: number = 0;
    numberOfRoundsToPlay: number = 3;
    carryOverPlayerName: string | null = null;
    carryOverTime: number | null = null;

    createTeams(numberOfTeams: number): void {
        this.teams = [];
        const shuffledNames = this.shuffle([...randomTeamNames.teamNames]);
        for (let i = 0; i < numberOfTeams; i++) {
            const name = shuffledNames[i % shuffledNames.length];
            const team = new Team(name, [], 0);
            this.addTeam(team);
        }
    }

    assignPlayersToTeams(): void {
        this.players = this.shuffle([...this.players]);
        let teamIndex = 0;
        for (const player of this.players) {
            this.teams[teamIndex].addPlayer(player);
            teamIndex = (teamIndex + 1) % this.teams.length;
        }
        this.teams = this.shuffle([...this.teams]);
    }

    initializeTurnOrder(): void {
        this.turnOrder = this.teams.map(team => team.players.map(player => player));
    }

    initializeWordsInTheHat(): void {
        this.wordsLeftInTheHat = [...this.words];
    }

    removeWordFromHat(word: Word): void {
        this.wordsLeftInTheHat = this.wordsLeftInTheHat.filter(w => w !== word);
    }

    addTeam(team: Team): void {
        this.teams.push(team);
    }

    nextPlayer(): Player {
        if (this.turnOrder.length === 0) {
            this.initializeTurnOrder();
        }

        const teamPlayers = this.turnOrder.shift()!;
        const player = teamPlayers.shift()!;

        if (teamPlayers.length === 0) {
            const teamIndex = this.teams.findIndex(team =>
                team.players.some(player => player === player)
            );
            if (teamIndex !== -1) {
                this.turnOrder.push(this.teams[teamIndex].players.map(p => p));
            }
        } else {
            this.turnOrder.push(teamPlayers);
        }
        return player;
    }

    advanceRound(): void {
        this.currentRound += 1;
    }

    restoreWordToHat(word: Word): void {
        if (!this.wordsLeftInTheHat.includes(word)) {
            this.wordsLeftInTheHat.push(word);
        }
    }

    removeWordFromTeams(word: Word): void {
        this.teams.forEach(team => team.removeGuessedWord(word));
    }

    private shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}