import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from '../logic/GameService';
import {StackNavigationProp} from '@react-navigation/stack';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import {Game} from '../models/Game';
import {useTheme} from 'styled-components/native';


const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

type RootStackParamList = {
    RoundEndScreen: undefined;
    PlayerTurnScreen: undefined;
    GameEndScreen: undefined;
};

const gold = '#FFD700';
const silver = '#C0C0C0';
const bronze = '#CD7F32';


const TeamRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0 24px;
    width: 100%;
`;

const TeamName = styled(StyledText)<{ color?: string }>`
    font-size: 30px;
    color: ${({color, theme}) => color || theme.RoundEndTeamNameColor};
    flex: 1;
    margin-right: 12px;
`;

const TeamScore = styled(StyledText)`
    font-size: 30px;
    color: ${({theme}) => theme.RoundEndTeamScoreColor};
    flex: none;
    min-width: 0;
    text-align: right;
`;

const TeamsScroll = styled(ScrollView)`
    max-height: 400px;
    width: 100%;
    border-width: 2px;
    border-color: ${({theme}) => theme.RoundEndTeamsScrollBorder};
    background-color: ${({theme}) => theme.RoundEndTeamsScrollBackground};
    padding-vertical: 8px;
    margin-top: 5%;
`;

const RoundEndScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'RoundEndScreen'>>();
    const [teams, setTeams] = useState<{ name: string; score: number }[]>([]);
    const [game, setGame] = useState<Game | null>(null);
    const theme = useTheme();

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
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });
        return unsubscribe;
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
        navigation.navigate('PlayerTurnScreen');
    };

    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    return (
        <ScreenContainer
            headerText={game ? `Round ${game.currentRound} Over!` : 'Round Over!'}
            showPrimaryButton
            primaryButtonText="Start Next Round"
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