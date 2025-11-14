import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';
import {useWindowDimensions, Image} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledBold from '../components/StyledBold';
import StyledText from '../components/StyledText';

const Banner = styled(StyledBold)<{ fontSize: number }>`
    font-size: ${({fontSize}) => fontSize}px;
    color: ${({ theme }) => theme.BannerColor};
    letter-spacing: 2px;
    text-align: center;
    text-shadow-color: ${({ theme }) => theme.BannerColorShadow};
    text-shadow-offset: 2px 2px;
    text-shadow-radius: 4px;
    margin-top: 8%;
`;

const ButtonLabel = styled(StyledText)<{ fontSize: number }>`
    font-size: ${({fontSize}) => fontSize}px;
    color: ${({ theme }) => theme.MainScreenButtonLabel};
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const Button = styled.TouchableOpacity<{ width: number }>`
    width: ${({width}) => width}px;
    min-height: 56px;
    background-color: ${({ theme }) => theme.MainScreenButtonBackGround};
    border-color: ${({ theme }) => theme.MainScreenButtonBorder};
    border-width: 2px;
    margin-top: 16px;
    align-items: center;
    justify-content: center;
    shadow-color: ${({ theme }) => theme.MainScreenButtonShadow};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 4;
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
`;

const StartScreen = () => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const navigation = useNavigation();
    const {width, height} = useWindowDimensions();

    const bannerFontSize = Math.max(32, width * 0.2);
    const buttonFontSize = Math.max(16, width * 0.05);
    const buttonWidth = Math.min(width * 0.8, 400);
    const imageSize = Math.min(width * 0.5, height * 0.3);

    useEffect(() => {
        const checkSavedGame = async () => {
            const service = new GameStateService();
            const game = await service.loadGameState();
            setHasSavedGame(!!game);
        };
        checkSavedGame();
    }, []);

    return (
        <ScreenContainer>
            <Banner fontSize={bannerFontSize}>{`In the\nhat!`}</Banner>
            <ImageContainer>
                <Image
                    source={require('../../assets/images/tophat.png')}
                    resizeMode="contain"
                    style={{
                        width: imageSize,
                        height: imageSize,
                    }}
                />
            </ImageContainer>
            <ButtonContainer style={{paddingBottom: height * 0.10}}>
                <Button
                    width={buttonWidth}
                    padding={height * 0.022}
                    onPress={() => navigation.navigate('Setup' as never)}
                >
                    <ButtonLabel fontSize={buttonFontSize * 1.2}>Start game</ButtonLabel>
                </Button>
                {hasSavedGame && (
                    <Button
                        width={buttonWidth}
                        padding={height * 0.022}
                        onPress={() => navigation.navigate('PlayerTurnScreen' as never)}
                    >
                        <ButtonLabel fontSize={buttonFontSize}>Load last game</ButtonLabel>
                    </Button>
                )}
                <Button
                    width={buttonWidth}
                    padding={height * 0.022}
                    onPress={() => navigation.navigate('SettingsScreen' as never)}
                >
                    <ButtonLabel fontSize={buttonFontSize}>Settings</ButtonLabel>
                </Button>
            </ButtonContainer>
        </ScreenContainer>
    );
};

export default StartScreen;