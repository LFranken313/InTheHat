import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from '../logic/GameService';
import StyledText from '../components/StyledText';
import styled, {useTheme} from 'styled-components/native';
import {ScrollView} from 'react-native';
import {Game} from '../models/Game';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import ScreenContainer from "../components/ScreenContainer";
import {translations} from "../translations";
import {useLanguage} from "../logic/LanguageContext";


const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

//region Styled components
export const gold = '#FFD700';
export const silver = '#C0C0C0';
export const bronze = '#CD7F32';

export const TeamRow = styled.View(() => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 24,
    width: '100%',
}));

export const TeamName = styled(StyledText)<{ color?: string }>(({ color, theme }) => ({
    fontSize: 30,
    color: color || theme.RoundEndTeamNameColor,
    flex: 1,
    marginRight: 12,
}));

export const TeamScore = styled(StyledText)(({ theme }) => ({
    fontSize: 30,
    color: theme.RoundEndTeamScoreColor,
    flex: 'none',
    minWidth: 0,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
    width: '15%',
}));

export const TeamsScroll = styled(ScrollView)(({ theme }) => ({
    maxHeight: 400,
    width: '100%',
    borderWidth: 2,
    borderColor: theme.RoundEndTeamsScrollBorder,
    backgroundColor: theme.RoundEndTeamsScrollBackground,
    paddingVertical: 8,
    marginTop: '5%',
}));

//endregion

const RoundEndScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'RoundEndScreen'>>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'PlayerTurnScreen'>>();
    const { customGame } = route.params;
    const [teams, setTeams] = useState<{ name: string; score: number }[]>([]);
    const [game, setGame] = useState<Game | null>(null);
    const theme = useTheme();
    const { language } = useLanguage();
    const localizedText = translations[language].roundEndScreen;

  const shadowStyle = {
    textShadowColor: (theme as any).RoundEndTeamShadowColor,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  };

  const whiteShadowStyle = {
    textShadowColor: (theme as any).RoundEndTeamWhiteShadowColor,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  };

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e) => {
            //@ts-ignore
            e.preventDefault();
        });
    }, [navigation]);

    useEffect(() => {
        const loadTeams = async () => {
            const loadedGame = await gameService.continueGame();
            setTeams(
                loadedGame.teams.map((t: any) => ({name: t.name, score: t.score}))
            );
            setGame(loadedGame);
        };
        loadTeams();
    }, [navigation]);

    const handleNewRound = async () => {
        await gameService.startNewRound();
        navigation.navigate('PlayerTurnScreen', { customGame });
    };

    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    return (
        <ScreenContainer
            headerText={game ? `${localizedText.titlePart1} ${game.currentRound} ${localizedText.titlePart2!}` : localizedText.titleOptional}
            showPrimaryButton
            primaryButtonText={localizedText.primaryButton}
            onPrimaryButtonPress={handleNewRound}
        >
            <TeamsScroll>
                {sortedTeams.map((team, idx) => {
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
                                color={color}
                                style={style}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {team.name}
                            </TeamName>
                            <TeamScore numberOfLines={1} ellipsizeMode="tail">
                                {team.score}
                            </TeamScore>
                        </TeamRow>
                    );
                })}
            </TeamsScroll>
        </ScreenContainer>
    );
};

export default RoundEndScreen;