import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GameStateService} from '../logic/GameStateService';
import {GameService} from '../logic/GameService';
import {WordService} from '../logic/WordService';

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
    color: #6fb8e6;
    font-size: 38px;
    text-align: center;
    margin-bottom: 16px;
`;

const shadowStyle = {
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
};

const PlayerName = styled(StyledBold)`
    color: #f7c873;
    font-size: 96px;
    text-align: center;
    text-shadow-color: #b88a2a;
    text-shadow-offset: 3px 3px;
    text-shadow-radius: 6px;
    margin-bottom: 24px;
    letter-spacing: 3px;
`;

const ReadyText = styled(StyledText)`
    font-size: 22px;
    color: #7c4a03;
    margin-bottom: 32px;
    text-align: center;
`;

const TimeLeftText = styled(StyledText)`
    font-size: 20px;
    color: #e67c73;
    margin-bottom: 16px;
    text-align: center;
`;

const PlayerTurnScreen = () => {
    const navigation = useNavigation();
    const [currentPlayerName, setCurrentPlayerName] = useState<string | null>(null);
    const [currentTeamName, setCurrentTeamName] = useState<string | null>(null);
    const [carryOverTime, setCarryOverTime] = useState<number | null>(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });
        return unsubscribe;
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
        navigation.navigate('GameScreen', {playerName: currentPlayerName});
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
                        <TeamName style={shadowStyle}>{currentTeamName}'s</TeamName>
                        <PlayerName>{currentPlayerName}</PlayerName>
                    </>
                )}
            </Centered>
        </ScreenContainer>
    );
};

export default PlayerTurnScreen;