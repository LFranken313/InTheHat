import React, {useEffect, useRef, useState} from 'react';
import {EventArg, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from '../logic/GameService';
import StyledText from '../components/StyledText';
import ScreenContainer from '../components/ScreenContainer';
import GameTopBar from "../components/GameTopBar";
import {translations} from "../translations";
import {useLanguage} from "../logic/LanguageContext";
import ModalComponent from "../components/ModalComponent";
import {RootStackParamList} from '../navigation/types';
import type {StackNavigationProp} from '@react-navigation/stack';

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

//region Styled components
export const Container = styled.View(({ theme }) => ({
    flex: 1,
    backgroundColor: theme.GameScreenContainerBackground,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: 32,
    borderWidth: 2,
    borderColor: theme.GameScreenContainerBorder,
    borderRadius: 16,
    marginTop: '3%',
}));

export const ModalText = styled(StyledText)(({ theme }) => ({
    fontSize: 18,
    color: theme.ModalTextColor,
    textAlign: 'center',
    fontWeight: '600',
    width: '100%',
}));

export const CardsLeftText = styled(StyledText)(({ theme }) => ({
    color: theme.CardsLeftTextColor,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
    width: '100%',
}));

export const CurrentStreak = styled(StyledText)(({ theme }) => ({
    fontSize: 30,
    color: theme.CurrentStreakColor,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
}));

// Card Image Container
export const CardImageContainer = styled.View(() => ({
    position: 'relative',
    width: '100%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
}));

export const CardImage = styled(Image)(() => ({
    width: '100%',
    height: '100%',
    borderRadius: 16,
}));

export const CardTextOverlay = styled.View(() => ({
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
}));

interface WordTextProps {
    fontSize: number;
}

export const WordText = styled(StyledText)<WordTextProps>(({ fontSize, theme }) => ({
    maxWidth: '90%',
    paddingHorizontal: 12,
    textAlign: 'center',
    overflow: 'hidden',
    fontSize: fontSize,
    color: theme.WordTextColor,
    letterSpacing: 2,
    fontWeight: '600',
    width: '100%',
}));

export const HintText = styled(StyledText)(({ theme }) => ({
    fontSize: 18,
    color: theme.HintTextColor,
    textAlign: 'center',
    marginTop: 32,
}));

export const buttonShadow = (theme: any) => ({
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
});

export const FullscreenOverlay = styled.TouchableOpacity(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
}));
//endregion

const GameScreen = () => {
    const [roundEnded, setRoundEnded] = useState(false);
    const [timer, setTimer] = useState(30);
    const [currentWord, setCurrentWord] = useState<string>('');
    const [streak, setStreak] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [lastGuessedWord, setLastGuessedWord] = useState<string | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const [paused, setPaused] = useState(false);
    const [carryOver, setCarryOver] = useState<{ player: string, time: number } | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const gameRef = useRef<any>(null);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { language } = useLanguage();
    const route = useRoute<RouteProp<RootStackParamList, 'GameScreen'>>();
    const { playerName } = route.params;
    const { customGame } = route.params;
    const localizedText = translations[language].gameScreen;

    useEffect(() => {
        if (showExitModal && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [showExitModal]);

    useEffect(() => {
        return navigation.addListener('beforeRemove', (e: EventArg<'beforeRemove', false, any>) => {
            // @ts-ignore
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
            let initialTimer = 30;
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
        navigation.navigate('PlayerTurnScreen', { customGame });
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
        if (roundEnded) return localizedText.roundEnded;
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
                    onPress={() => navigation.navigate('RoundEndScreen', { customGame })}
                />
            )}
            <ModalComponent
                visible={showExitModal}
                onClose={() => setShowExitModal(false)}
                primaryButton={{
                    label: localizedText.exitGameLabel,
                    onPress: confirmExit
                }}
                secondaryButton={{
                    label: localizedText.cancelButtonLabel,
                    onPress: () => setShowExitModal(false)
                }}
            >
                <ModalText style={{ textAlign: 'center', fontSize: 18 }}>
                    {localizedText.exitModalText}
                </ModalText>
            </ModalComponent>
        </ScreenContainer>
    );
};

export default GameScreen;