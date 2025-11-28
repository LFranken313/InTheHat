import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute, EventArg, RouteProp} from '@react-navigation/native';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from '../logic/GameService';
import StyledText from '../components/StyledText';
import ScreenContainer from '../components/ScreenContainer';
import GameTopBar from "../components/GameTopBar";
import GameExitModal from "../components/GameExitModal";
import {StackNavigationProp} from "@react-navigation/stack";
import textContent from '../textContent.json';
import {useLanguage} from "../logic/LanguageContext";

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

//region Styled components
const Container = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.GameScreenContainerBackground};
    justify-content: center;
    align-items: stretch;
    padding: 32px 0 32px 0;

    border-width: 2px;
    border-color: ${({ theme }) => theme.GameScreenContainerBorder};
    border-radius: 16px;
    margin-top: 3%;
`;

const CardsLeftText = styled(StyledText)`
    color: ${({ theme }) => theme.CardsLeftTextColor};
    margin-top: 12px;
    text-align: center;
    font-weight: 600;
    width: 100%;`;

const CurrentStreak = styled(StyledText)`
    font-size: 30px;
    color: ${({ theme }) => theme.CurrentStreakColor};
    text-align: center;
    margin-top: 24px;
    margin-bottom: 8px;
`;

const CardImageContainer = styled.View`
    position: relative;
    width: 100%;
    height: 320px;
    align-items: center;
    justify-content: center;
    margin-horizontal: 0;
`;

const CardImage = styled(Image)`
    width: 100%;
    height: 100%;
    border-radius: 16px;
`;

const CardTextOverlay = styled.View`
    position: absolute;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    align-items: center;
    justify-content: center;
`;
const WordText = styled(StyledText)<{ fontSize: number }>`
    max-width: 90%;
    padding-horizontal: 12px;
    text-align: center;
    overflow: hidden;
    font-size: ${({fontSize}) => fontSize}px;
    color: ${({ theme }) => theme.WordTextColor};
    letter-spacing: 2px;
    font-weight: 600;
    width: 100%;
`;

const HintText = styled(StyledText)`
    font-size: 18px;
    color: ${({ theme }) => theme.HintTextColor};
    text-align: center;
    margin-top: 32px;
`;

const buttonShadow = (theme) => ({
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
});

const FullscreenOverlay = styled.TouchableOpacity`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;
//endregion

const GameScreen = () => {
    const [roundEnded, setRoundEnded] = useState(false);
    const [timer, setTimer] = useState(60);
    const [currentWord, setCurrentWord] = useState<string>('');
    const [streak, setStreak] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [lastGuessedWord, setLastGuessedWord] = useState<string | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [paused, setPaused] = useState(false);
    const [carryOver, setCarryOver] = useState<{ player: string, time: number } | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const gameRef = useRef<any>(null);
    const route = useRoute<RouteProp<{ params: GameScreenRouteParams }, 'params'>>();
    const playerName = route.params?.playerName;
    const customGame = route.params?.customGame;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { language } = useLanguage();
    const localizedText = textContent[language].gameScreen;


    type GameScreenRouteParams = {
        playerName: string;
    };

    type RootStackParamList = {
        PlayerTurnScreen: undefined;
        Start: undefined;
        GameEndScreen: undefined;
        RoundEndScreen: undefined;
    };

    useEffect(() => {
        if (showExitModal && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [showExitModal]);

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e: EventArg<'beforeRemove', false, any>) => {
            e.preventDefault();
        });
    }, [navigation]);

    useEffect(() => {
        if (showExitModal || paused) return;
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [showExitModal, paused]);

    useEffect(() => {
        const loadGame = async () => {
            setStreak(0);
            setIsTimeUp(false);
            let initialTimer = 60;
            const loadedGame = await gameService.continueGame();
            gameRef.current = loadedGame;
            if (
                loadedGame.carryOverPlayerName &&
                loadedGame.carryOverTime &&
                playerName === loadedGame.carryOverPlayerName
            ) {
                initialTimer = loadedGame.carryOverTime;
                setCarryOver({
                    player: loadedGame.carryOverPlayerName,
                    time: loadedGame.carryOverTime,
                });
                loadedGame.carryOverPlayerName = null;
                loadedGame.carryOverTime = null;
                await gameStateService.saveGameState(loadedGame);
            }
            setTimer(initialTimer);
            try {
                const word = gameService.wordToGuessFromHat();
                setCurrentWord(word.name);
                setPaused(false);
            } catch {
                setCurrentWord(localizedText.roundEnded);
                setPaused(true);
                await checkGameEnd();
            }
        };
        loadGame();
    }, []);

    const handleGuessed = async () => {
        if (isTimeUp || paused) return;
        setLastGuessedWord(currentWord);
        const loadedGame = await gameService.continueGame();
        const isLastWord = loadedGame.wordsLeftInTheHat.length === 1;
        await gameService.wordGuessed(
            currentWord,
            playerName,
            isLastWord ? timer : undefined
        );
        setStreak(prev => prev + 1);
        gameRef.current = await gameService.continueGame();
        try {
            const nextWord = await gameService.wordToGuessFromHat();
            setCurrentWord(nextWord.name);
            setPaused(false);
        } catch {
            setCurrentWord(localizedText.roundEnded);
            setPaused(true);
            await checkGameEnd();
        }
    };

    const onTimeUpPress = () => {
        navigation.navigate('PlayerTurnScreen');
    };

    const handleExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = async () => {
        setShowExitModal(false);
        if (gameRef.current) {
            await gameStateService.saveGameState(gameRef.current);
        }
        navigation.navigate('Start');
    };

    const checkGameEnd = async () => {
        const loadedGame = await gameService.continueGame();
        if (loadedGame.currentRound == loadedGame.numberOfRoundsToPlay) {
            navigation.navigate('GameEndScreen');
        } else {
            setRoundEnded(true);
        }
    };

    const getWordFontSize = (word: string) => {
        if (!word) return 36;
        const len = word.length;
        if (len <= 12) return 36;
        if (len <= 20) return 28;
        return 22;
    };

    const getWordDisplay = () => {
        if (isTimeUp) return localizedText.timeUp;
        if (roundEnded) return localizedText.roundEnd;
        if (showExitModal) return " ";
        return currentWord.toUpperCase();
    };

    const wordDisplay = getWordDisplay();

    const undoLastGuess = async () => {
        if (!lastGuessedWord) return;
        await gameService.undoLastGuess(lastGuessedWord);
        setCurrentWord(lastGuessedWord);
        setStreak(prev => (prev > 0 ? prev - 1 : 0));
        setPaused(false);
        setLastGuessedWord(null);
        gameRef.current = await gameService.continueGame();
    };
    return (
        <ScreenContainer
            showPrimaryButton
            primaryButtonText={localizedText.guessedButton}
            onPrimaryButtonPress={handleGuessed}
            primaryButtonDisabled={isTimeUp || showExitModal || paused}
        >
            <GameTopBar
                timer={timer}
                onExit={handleExit}
                onUndo={undoLastGuess}
                undoDisabled={!lastGuessedWord || showExitModal || paused}
                buttonShadow={buttonShadow}
            />
            <Container>
                <CardImageContainer>
                    <CardImage
                        source={require('../../assets/images/WordCard.png')}
                        resizeMode="cover"
                    />
                    <CardTextOverlay>
                        <WordText fontSize={getWordFontSize(wordDisplay)}>
                            {wordDisplay}
                        </WordText>
                    </CardTextOverlay>
                </CardImageContainer>

                <CurrentStreak>{localizedText.streak} {streak}</CurrentStreak>
                <CardsLeftText>
                    {gameRef.current?.wordsLeftInTheHat?.length ?? 0} / {gameRef.current?.words?.length ?? 0}
                    {localizedText.cardsLeft}
                </CardsLeftText>

                {(isTimeUp || roundEnded) && (
                    <HintText>{localizedText.touchToContinue}</HintText>
                )}
            </Container>
            {isTimeUp && !showExitModal && (
                <FullscreenOverlay activeOpacity={1} onPress={onTimeUpPress}/>
            )}
            {roundEnded && !showExitModal && (
                <FullscreenOverlay
                    activeOpacity={1}
                    onPress={() => navigation.navigate('RoundEndScreen')}
                />
            )}
            <GameExitModal
                visible={showExitModal}
                onRequestClose={() => setShowExitModal(false)}
                onConfirmExit={confirmExit}
                buttonShadow={buttonShadow}
            />
        </ScreenContainer>
    );
};

export default GameScreen;