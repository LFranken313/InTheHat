import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from '../models/Game';
import { Team } from '../models/Team';
import { Player } from '../models/Player';
import { Word } from '../models/Word';

const GAME_STATE_KEY = 'game_state';

export class GameStateService {
    async saveGameState(game: Game): Promise<void> {
        const json = JSON.stringify(game);
        await AsyncStorage.setItem(GAME_STATE_KEY, json);
    }

    async loadGameState(): Promise<Game | null> {
        const json = await AsyncStorage.getItem(GAME_STATE_KEY);
        if (!json) return null;

        const plain = JSON.parse(json);

        const game = Object.assign(Object.create(Game.prototype), plain);

        game.words = plain.words.map((w: any) =>
            Object.assign(Object.create(Word.prototype), w)
        );

        game.wordsLeftInTheHat = plain.wordsLeftInTheHat.map((w: any) =>
            Object.assign(Object.create(Word.prototype), w)
        );

        game.teams = plain.teams.map((t: any) => {
            const team = Object.assign(Object.create(Team.prototype), t);
            team.players = t.players.map((p: any) =>
                Object.assign(Object.create(Player.prototype), p)
            );
            return team;
        });

        game.players = plain.players.map((p: any) =>
            Object.assign(Object.create(Player.prototype), p)
        );

        return game;
    }

    async clearGameState(): Promise<void> {
        await AsyncStorage.removeItem(GAME_STATE_KEY);
    }
}
