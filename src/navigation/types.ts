export type RootStackParamList = {
    Start: {customGame: boolean};
    SettingsScreen: {};
    Setup:  { customGame: boolean };
    PlayerTurnScreen: { customGame: boolean };
    GameScreen: { playerName: string; customGame: boolean };
    RoundEndScreen: { customGame: boolean };
    GameEndScreen: { customGame: boolean };
    QuickGameScreen: { players: number; teams: number; words: number; rounds: number; customGame: boolean; }
    TeamOverviewScreen: { customGame: boolean };
    CustomWordScreen: {}
    SubmitPlayerNamesScreen: {
        players: number;
        teams: number;
        words: number;
        rounds: number;
        selectedCategories: string[];
        customWords: string[];
        customGame: boolean;
    };

    SubmitWordsScreen: {
        words: number;
        players: number;
        teams: number;
        rounds: number;
        selectedCategories?: string[];
        customWords?: string[];
        customGame: boolean;
    };
    SetupScreen: { customGame: boolean };
};