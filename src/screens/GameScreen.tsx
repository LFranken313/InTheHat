import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Modal, TouchableOpacity} from 'react-native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from '../logic/GameService';
import styled from 'styled-components/native';
import StyledText from '../components/StyledText';
import ScreenContainer from '../components/ScreenContainer';

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

const Container = styled.View`
    flex: 1;
    background: #f5e9da;
    justify-content: center;
    align-items: stretch;
    padding: 32px 0 32px 0;
`;

const CardsLeftText = styled(StyledText)`
    color: #7c4a03;
    margin-top: 12px;
    text-align: center;
    align-self: center;
`;

const CurrentStreak = styled(StyledText)`
    font-size: 30px;
    color: #7c4a03;
    text-align: center;
    margin-top: 24px;
    margin-bottom: 8px;
`;

const Timer = styled(StyledText)`
    position: absolute;
    top: 10%;
    right: 10%;
    font-size: 28px;
    color: #e67c73;
    font-weight: bold;
    z-index: 10;
`;

const Card = styled.View`
    background: #fffbe6;
    margin: 0 32px;
    border-radius: 16px;
    padding: 48px 24px;
    align-items: center;
    justify-content: center;
    elevation: 5;
    shadow-color: #000;
    shadow-opacity: 0.08;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
`;

const WordText = styled(StyledText)`
    font-size: 36px;
    color: #7c4a03;
    text-align: center;
    letter-spacing: 2px;
`;

const HintText = styled(StyledText)`
    font-size: 18px;
    color: #b88a2a;
    text-align: center;
    margin-top: 32px;
`;

const buttonShadow = {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
};

const ExitButton = styled.TouchableOpacity`
    position: absolute;
    top: 10%;
    left: 10%;
    z-index: 200;
    background: #e67c73;
    padding: 8px 16px;
    elevation: 3;
    border-width: 2px;
    border-color: #fff;
`;

const ExitButtonText = styled(StyledText)`
    color: #fff;
    font-size: 18px;
`;

const ModalContainer = styled.View`
    flex: 1;
    background: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
`;

const ModalCard = styled.View`
    background: #fffbe6;
    border-radius: 16px;
    padding: 32px 24px;
    align-items: center;
    width: 80%;
`;

const ModalText = styled(StyledText)`
    font-size: 22px;
    color: #7c4a03;
    text-align: center;
    margin-bottom: 24px;
`;

const ModalButton = styled.TouchableOpacity`
    background: #e67c73;
    padding: 12px 32px;
    border-width: 2px;
    border-color: #fff;
`;

const ModalButtonText = styled(StyledText)`
    color: #fff;
    font-size: 18px;
`;

const GameScreen = () => {
    const [roundEnded, setRoundEnded] = useState(false);
    const [timer, setTimer] = useState(30);
    const [currentWord, setCurrentWord] = useState<string>('');
    const [streak, setStreak] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [paused, setPaused] = useState(false);
    const [carryOver, setCarryOver] = useState<{ player: string, time: number } | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const gameRef = useRef<any>(null);
    const route = useRoute();
    const playerName = route.params?.playerName;
    const navigation = useNavigation();

    useEffect(() => {
        if (showExitModal && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [showExitModal]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });
        return unsubscribe;
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
                setCurrentWord('Round has ended!');
                setPaused(true);
                await checkGameEnd();
            }
        };
        loadGame();
    }, []);

    const handleGuessed = async () => {
        if (isTimeUp || paused) return;
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
            setCurrentWord('Round has ended!');
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

    const FullscreenOverlay = ({onPress}: { onPress: () => void }) => (
        <TouchableOpacity
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
            }}
            activeOpacity={1}
            onPress={onPress}
        />
    );

    return (
        <ScreenContainer
            showPrimaryButton
            primaryButtonText="Guessed"
            onPrimaryButtonPress={handleGuessed}
            primaryButtonDisabled={isTimeUp || showExitModal || paused}
        >
            <ExitButton onPress={handleExit} style={buttonShadow}>
                <ExitButtonText>Exit</ExitButtonText>
            </ExitButton>

            <Timer>{timer}s</Timer>

            <Container>
                <Card>
                    <WordText>
                        {isTimeUp
                            ? "Time's up!"
                            : roundEnded
                                ? "Round has ended!"
                                : showExitModal
                                    ? " "
                                    : currentWord.toUpperCase()}
                    </WordText>
                </Card>

                <CurrentStreak>Streak: {streak}</CurrentStreak>
                <CardsLeftText>
                    {gameRef.current?.wordsLeftInTheHat?.length ?? 0} / {gameRef.current?.words?.length ?? 0} cards left in the hat
                </CardsLeftText>

                {(isTimeUp || roundEnded) && (
                    <HintText>Touch anywhere to continue</HintText>
                )}
            </Container>

            {isTimeUp && !showExitModal && (
                <FullscreenOverlay onPress={onTimeUpPress}/>
            )}

            {roundEnded && !showExitModal && (
                <FullscreenOverlay
                    onPress={() => navigation.navigate('RoundEndScreen')}
                />
            )}

            <Modal
                visible={showExitModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowExitModal(false)}
            >
                <ModalContainer>
                    <ModalCard>
                        <ModalText>
                            Exit game?{'\n'}(game will be saved)
                        </ModalText>
                        <ModalButton onPress={confirmExit} style={buttonShadow}>
                            <ModalButtonText>Exit Game</ModalButtonText>
                        </ModalButton>
                        <ModalButton
                            style={[{ marginTop: 16, backgroundColor: '#6fb8e6' }, buttonShadow]}
                            onPress={() => setShowExitModal(false)}
                        >
                            <ModalButtonText>Cancel</ModalButtonText>
                        </ModalButton>
                    </ModalCard>
                </ModalContainer>
            </Modal>
        </ScreenContainer>
    );

};

export default GameScreen;