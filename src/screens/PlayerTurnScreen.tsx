import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GameStateService} from '../logic/GameStateService';
import {GameService} from '../logic/GameService';
import {WordService} from '../logic/WordService';

import type {StackNavigationProp} from '@react-navigation/stack';
import type { EventArg } from '@react-navigation/native';

import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import StyledBold from '../components/StyledBold';

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

const Centered = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const TeamName = styled(StyledBold)`
    color: ${({ theme }) => theme.PlayerTurnTeamNameColor};
    font-size: 38px;
    text-align: center;
    margin-bottom: 16px;
    text-shadow-color: ${({ theme }) => theme.TeamShadowColor};
    text-shadow-offset: 1px 2px;
    text-shadow-radius: 4px;
`;

const PlayerName = styled(StyledBold)`
    color: ${({ theme }) => theme.PlayerTurnPlayerNameColor};
    font-size: 96px;
    text-align: center;
    text-shadow-color: ${({ theme }) => theme.PlayerTurnPlayerNameShadow};
    text-shadow-offset: 3px 3px;
    text-shadow-radius: 6px;
    margin-bottom: 24px;
    letter-spacing: 3px;
    max-width: 90%;
    align-self: center;
`;

const ReadyText = styled(StyledText)`
    font-size: 22px;
    color: ${({ theme }) => theme.PlayerTurnReadyTextColor};
    margin-bottom: 32px;
    text-align: center;
`;

const TimeLeftText = styled(StyledText)`
    font-size: 20px;
    color: ${({ theme }) => theme.PlayerTurnTimeLeftTextColor};
    margin-bottom: 16px;
    text-align: center;
`;

type RootStackParamList = {
    PlayerTurnScreen: undefined;
    GameScreen: { playerName: string | null };
}

const PlayerTurnScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [currentPlayerName, setCurrentPlayerName] = useState<string | null>(null);
    const [currentTeamName, setCurrentTeamName] = useState<string | null>(null);
    const [carryOverTime, setCarryOverTime] = useState<number | null>(null);

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e: EventArg<'beforeRemove', false, any>) => {
            e.preventDefault();
        });
    }, [navigation]);

    useEffect(() => {
        const loadGame = async () => {
            const game = await gameService.continueGame();
            let playerName = game.carryOverPlayerName;
            let carryTime = null;
            if (game.carryOverPlayerName && game.carryOverTime) {
                playerName = game.carryOverPlayerName;
                carryTime = game.carryOverTime;
            } else {
                const player = await gameService.fetchPlayerToPlay();
                playerName = player.name;
            }
            setCurrentPlayerName(playerName);
            setCarryOverTime(carryTime);

            const team = game.teams.find((t: any) =>
                t.players.some((p: any) => p.name === playerName)
            );
            setCurrentTeamName(team ? team.name : null);
        };
        loadGame();
    }, []);

    const handleGo = () => {
        navigation.navigate('GameScreen', { playerName: currentPlayerName });
    };

    return (
        <ScreenContainer
            headerText="Get Ready!"
            showPrimaryButton
            primaryButtonText="Go"
            onPrimaryButtonPress={handleGo}
        >
            <Centered>
                {carryOverTime != null && (
                    <TimeLeftText>
                        Time left: {carryOverTime}s
                    </TimeLeftText>
                )}
                {currentPlayerName && currentTeamName && (
                    <>
                        <ReadyText>Are you ready</ReadyText>
                        <TeamName>{currentTeamName}'s</TeamName>
                        <PlayerName
                            numberOfLines={2}
                            adjustsFontSizeToFit
                            minimumFontScale={0.3}
                        >
                            {currentPlayerName}
                        </PlayerName>
                    </>
                )}
            </Centered>
        </ScreenContainer>
    );
};

export default PlayerTurnScreen;