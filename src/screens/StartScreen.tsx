import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';
import {useWindowDimensions, Image} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledBold from '../components/StyledBold';
import StyledText from '../components/StyledText';

const Banner = styled(StyledBold)`
    font-size: 100px;
    color: ${({ theme }) => theme.BannerColor};
    letter-spacing: 2px;
    text-align: center;
    text-shadow-color: ${({ theme }) => theme.BannerColorShadow};
    text-shadow-offset: 2px 2px;
    text-shadow-radius: 4px;
    margin-top: 8%;
`;

const ButtonLabel = styled(StyledText)`
    font-size: 22px;
    color: ${({ theme }) => theme.MainScreenButtonLabel};
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const Button = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.MainScreenButtonBackGround};
    border-color: ${({ theme }) => theme.MainScreenButtonBorder};
    border-width: 2px;
    margin-bottom: 16px;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    width: 80%;
    shadow-color: ${({ theme }) => theme.MainScreenButtonShadow};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 4;
`;

const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    width: 80%;
    align-self: center;
    margin-bottom: 16px;
`;

const HalfButton = styled(Button)`
    width: 48%;
    margin-bottom: 0;
`;

const ImageContainer = styled.View`
    justify-content: flex-start;
    align-items: center;
    margin-top: 12px;
`;

const ButtonContainer = styled.View`
    width: 100%;
    align-items: center;
    margin-top: auto;
    padding-bottom: 10%;
`;

const StartScreen = () => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const navigation = useNavigation();
    const {height} = useWindowDimensions();

    useEffect(() => {
        const checkSavedGame = async () => {
            const service = new GameStateService();
            const game = await service.loadGameState();
            setHasSavedGame(!!game);
        };
        checkSavedGame();
    }, []);

    const handleStartPress = (customGame: boolean) => {
        navigation.navigate('Setup', { customGame });
    };

    return (
        <ScreenContainer>
            <Banner>In the{'\n'}hat!</Banner>
            <ImageContainer>
                <Image
                    source={require('../../assets/images/tophat.png')}
                    resizeMode="contain"
                    style={{
                        width: '50%',
                        height: height * 0.3,
                    }}
                />
            </ImageContainer>
            <ButtonContainer>
                <ButtonRow>
                    <HalfButton onPress={() => handleStartPress(false)}>
                        <ButtonLabel>Quick game</ButtonLabel>
                    </HalfButton>
                    <HalfButton onPress={() => handleStartPress(true)}>
                        <ButtonLabel>Custom game</ButtonLabel>
                    </HalfButton>
                </ButtonRow>
                {hasSavedGame && (
                    <Button onPress={() => navigation.navigate('PlayerTurnScreen' as never)}>
                        <ButtonLabel>Load last game</ButtonLabel>
                    </Button>
                )}
                <Button onPress={() => navigation.navigate('SettingsScreen' as never)}>
                    <ButtonLabel>Settings</ButtonLabel>
                </Button>
            </ButtonContainer>
        </ScreenContainer>
    );
};

export default StartScreen;

//TODO: If this is the first time playing show modal with welcome text