import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {LinearGradient} from 'expo-linear-gradient';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';
import StyledBold from '../components/StyledBold';
import StyledText from '../components/StyledText';
import {GameService} from "../logic/GameService";
import {WordService} from "../logic/WordService";

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);


const Background = styled(LinearGradient).attrs({
    colors: ['#f5e9da', '#e9dbc7'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
})`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const BannerText = styled(StyledBold)`
    font-size: 60px;
    color: #77dd77;
    letter-spacing: 2px;
    margin-top: 64px;
    text-align: center;
    text-shadow-color: #2e7d32;
    text-shadow-offset: 2px 2px;
    text-shadow-radius: 4px;
`;

// Add above the StartScreen component
const buttonShadow = {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
};

const StartButton = styled.TouchableOpacity`
    background-color: #f7c873;
    padding: 18px 48px;
    border-color: #fff;
    border-width: 2px;
    shadow-color: #000;
    shadow-opacity: 0.08;
    shadow-radius: 6px;
    margin-top: 16px;
`;

const StartButtonText = styled(StyledText)`
    font-size: 22px;
    color: #7c4a03;
    font-weight: 600;
    letter-spacing: 1px;
`;

const Content = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
`;

const LogoImage = styled.Image`
    width: 50%;
    height: 50%;
`;

const StartScreen = () => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const checkSavedGame = async () => {
            const service = new GameStateService();
            const game = await service.loadGameState();
            setHasSavedGame(!!game);
        };
        checkSavedGame();
    }, []);

    return (
        <Background>
            <Content>
                <BannerText>In the hat!</BannerText>
                <LogoImage
                    source={require('../../assets/images/tophat.png')}
                    resizeMode="contain"
                />
                <StartButton
                    onPress={() => navigation.navigate('Setup')}
                    style={buttonShadow}
                >
                    <StartButtonText>Start game</StartButtonText>
                </StartButton>
                {hasSavedGame && (
                    <StartButton
                        onPress={() => navigation.navigate('PlayerTurnScreen')}
                        style={buttonShadow}
                    >
                        <StartButtonText>Load last game</StartButtonText>
                    </StartButton>
                )}
            </Content>
        </Background>
    );
};

export default StartScreen;