import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled, {useTheme} from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {ScrollView} from 'react-native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from "../logic/GameService";
import {Game} from '../models/Game';
import winningMessage from '../assets/WinningMessage.json'
import type {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/types";
import {translations} from "../translations";
import {useLanguage} from "../logic/LanguageContext";

//region Styled components
const gold = '#FFD700';
const silver = '#C0C0C0';
const bronze = '#CD7F32';

const TeamRow = styled.View(() => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 0,
    width: '100%',
}));

const TeamName = styled(StyledText)<{ fontSize: number; color?: string }>(({ fontSize, color, theme }) => ({
    color: color || theme.TeamNameColor,
    fontSize: fontSize,
    flex: 1,
    flexBasis: 0,
    flexShrink: 1,
    minWidth: 0,
    marginRight: 12,
}));

const TeamScore = styled(StyledText)<{ fontSize: number }>(({ fontSize, theme }) => ({
    color: theme.TeamScoreColor,
    fontSize: fontSize,
    flex: 0,
    minWidth: 0,
    textAlign: 'center',
    fontWeight: '600',
    width: '15%',
}));

const SubBanner = styled(StyledText)<{ color?: string }>(({ color, theme }) => ({
    fontSize: 36,
    textAlign: 'center',
    marginTop: '10%',
    color: color || theme.SubBannerColor,
}));

const TeamsScroll = styled(ScrollView)(({ theme }) => ({
    maxHeight: 400,
    width: '100%',
    borderWidth: 2,
    borderColor: theme.TeamsScrollBorder,
    backgroundColor: theme.TeamsScrollBackground,
    paddingVertical: 8,
    marginTop: '5%',
}));
//endregion

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

const GameEndScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Start'>>();
    const [teams, setTeams] = useState<{ name: string; score: number }[]>([]);
    const [game, setGame] = useState<Game>(null);
    const [message, setMessage] = useState<string>('');
    const theme = useTheme();
    const { language } = useLanguage();
    const localizedText = translations[language].gameEndScreen;

    const shadowStyle = {
        textShadowColor: theme.TeamShadowColor,
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    };

    const whiteShadowStyle = {
        textShadowColor: theme.TeamWhiteShadowColor,
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    };

    useEffect(() => {
        const loadGame = async () => {
            const game = await gameService.continueGame();
            setTeams(game.teams.map((t: any) => ({name: t.name, score: t.score})));
            setGame(game);
            const messages = winningMessage.winningMessages[0];
            const idx = Math.floor(Math.random() * messages.length);
            setMessage(messages[idx]);
        };
        loadGame();
    }, []);

    if (!game) return null;

    const totalPossiblePoints = game.numberOfRoundsToPlay * game.words.length;
    const teamsWithPercent = teams.map((team) => ({
        ...team,
        percent: totalPossiblePoints > 0 ? (team.score / totalPossiblePoints) : 0,
    }));

    const winner = teamsWithPercent.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev, teamsWithPercent[0]
    );

    const minFont = 24;
    const maxFont = 60;


    const handleSubmit = async () => {
        await gameStateService.clearGameState();
        navigation.navigate('Start');
    };

    return (
        <ScreenContainer
            headerText={localizedText.title}
            showPrimaryButton
            primaryButtonText={localizedText.primaryButton}
            onPrimaryButtonPress={handleSubmit}
        >
            <SubBanner color={theme.primaryButtonBlue} style={{
                textShadowColor: theme.TeamShadowColor,
                textShadowOffset: { width: 1, height: 2 },
                textShadowRadius: 4,
            }}>
                {message ? message + '\n' : ''}
                {winner.name}
            </SubBanner>
            <TeamsScroll>
                {teamsWithPercent
                    .sort((a, b) => b.score - a.score)
                    .map((team, idx) => {
                        const fontSize = minFont + (maxFont - minFont) * team.percent;
                        let color;
                        let style;
                        if (idx === 0) {
                            color = gold;
                            style = shadowStyle;
                        } else if (idx === 1) {
                            color = silver;
                            style = shadowStyle;
                        } else if (idx === 2) {
                            color = bronze;
                            style = shadowStyle;
                        } else {
                            style = whiteShadowStyle;
                        }
                        return (
                            <TeamRow key={team.name}>
                                <TeamName
                                    fontSize={fontSize}
                                    color={color}
                                    style={style}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {team.name}
                                </TeamName>
                                <TeamScore fontSize={fontSize} numberOfLines={1} ellipsizeMode="tail">
                                    {team.score}
                                </TeamScore>
                            </TeamRow>
                        );
                    })}
            </TeamsScroll>
        </ScreenContainer>
    );

};

export default GameEndScreen;