import React, {useEffect, useState} from 'react';
import {EventArg, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {GameStateService} from '../logic/GameStateService';
import {GameService} from '../logic/GameService';
import {WordService} from '../logic/WordService';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import StyledBold from '../components/StyledBold';
import {useLanguage} from "../logic/LanguageContext";
import {translations} from "../translations";
import {RootStackParamList} from '../navigation/types';
import type {StackNavigationProp} from '@react-navigation/stack';

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

//region Styled components

const LargeInstructions = styled(StyledBold)`
    font-size: 32px;
    color: ${({ theme }) => theme.ModalTextColor};
    text-align: center;
    margin-top: 16px;
    margin-bottom: 24px;
    width: 100%;
`;

const Centered = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const PlayerName = styled(StyledBold)`
    color: ${({ theme }) => theme.PlayerTurnPlayerNameColor};
    font-size: 96px;
    text-shadow-color: ${({ theme }) => theme.PlayerTurnPlayerNameShadow};
    text-shadow-offset: 3px 3px;
    text-shadow-radius: 6px;
    margin-bottom: 24px;
    letter-spacing: 3px;
    max-width: 90%;
    align-self: center;
    font-weight: 600;
    text-align: center;
    width: 100%;
`;

const ReadyText = styled(StyledText)`
    font-size: 22px;
    color: ${({ theme }) => theme.PlayerTurnReadyTextColor};
    margin-bottom: 32px;
    font-weight: 600;
    text-align: center;
    width: 100%;
`;

//endregion

const PlayerTurnScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'GameScreen'>>();
    const [currentPlayerName, setCurrentPlayerName] = useState<string | null>(null);
    const [currentTeamName, setCurrentTeamName] = useState<string | null>(null);
    const [carryOverTime, setCarryOverTime] = useState<number | null>(null);
    const route = useRoute<RouteProp<RootStackParamList, 'PlayerTurnScreen'>>();
    const { customGame } = route.params;
    const [currentRound, setCurrentRound] = useState<number>();
    const { language } = useLanguage();
    const localizedText = translations[language].playerTurnScreen;

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e: EventArg<'beforeRemove', false, any>) => {
            //@ts-ignore
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
            setCurrentRound(game.currentRound);
        };
        loadGame();
    }, []);

    const handleGo = () => {
        navigation.navigate('GameScreen', { playerName: currentPlayerName, customGame });
    };

    const getInstructions = () => {
        switch (currentRound) {
            case 1:
                return localizedText.roundOne;
            case 2:
                return localizedText.roundTwo;
            case 3:
                return localizedText.roundThree;
            default:
                return localizedText.switchDefault;
        }
    };

    return (
        <ScreenContainer
            headerText={localizedText.title}
            showPrimaryButton
            primaryButtonText={localizedText.primaryButton}
            onPrimaryButtonPress={handleGo}
        >
            <Centered>
                {!customGame && (
                    <LargeInstructions>
                        {getInstructions()}
                    </LargeInstructions>
                )}
                {currentPlayerName && currentTeamName && (
                    <>
                        <ReadyText>{localizedText.readyText}</ReadyText>
                        {/*<TeamName>{currentTeamName}'s</TeamName>*/}
                        <PlayerName
                            numberOfLines={1}
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