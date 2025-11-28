import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';
import {useWindowDimensions, Image, Modal, View, Text, Button} from 'react-native'
import ScreenContainer from '../components/ScreenContainer';
import StyledBold from '../components/StyledBold';
import StyledText from '../components/StyledText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalComponent from "../components/ModalComponent";
import textContent from '../textContent.json';
import { useLanguage } from '../logic/LanguageContext';
import { Linking, TouchableOpacity } from 'react-native';


//region Styled components
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

const StyledButton = styled.TouchableOpacity`
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

const HalfButton = styled(StyledButton)`
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

const CloseButton = styled.TouchableOpacity`
    background: ${({theme}) => theme.SetupCloseButtonBackground};
    padding: 10px 24px;
    border-color: ${({theme}) => theme.SetupCloseButtonText};
    border-width: 2px;
    shadow-color: ${({theme}) => theme.SetupButtonShadowColor};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
    align-self: center;
    margin-top: 16px;
`;

const CloseButtonText = styled(StyledText)`
    color: ${({theme}) => theme.SetupCloseButtonText};
    font-size: 16px;
`;
//endregion

const StartScreen = () => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const navigation = useNavigation();
    const { height}  = useWindowDimensions();
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const { language } = useLanguage();
    const localizedText = textContent[language].startScreen;

    useEffect(() => {
        const checkSavedGame = async () => {
            const service = new GameStateService();
            const game = await service.loadGameState();
            setHasSavedGame(!!game);
        };
        checkSavedGame();
    }, []);

    useEffect(() => {
        const checkWelcomeModal = async () => {
            const shown = await AsyncStorage.getItem('welcomeModalShown');
            if (!shown) setShowWelcomeModal(true);
        };
        checkWelcomeModal();
    }, []);

    const handleModalClose = async () => {
        await AsyncStorage.setItem('welcomeModalShown', 'true');
        setShowWelcomeModal(false);
    };

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
                        <ButtonLabel>{localizedText.quickGame}</ButtonLabel>
                    </HalfButton>
                    <HalfButton onPress={() => handleStartPress(true)}>
                        <ButtonLabel>{localizedText.customGame}</ButtonLabel>
                    </HalfButton>
                </ButtonRow>
                {hasSavedGame && (
                    <StyledButton onPress={() => navigation.navigate('PlayerTurnScreen' as never)}>
                        <ButtonLabel>{localizedText.loadButton}</ButtonLabel>
                    </StyledButton>
                )}
                <StyledButton onPress={() => navigation.navigate('SettingsScreen' as never)}>
                    <ButtonLabel>{localizedText.settingsButton}</ButtonLabel>
                </StyledButton>
            </ButtonContainer>
            <ModalComponent
                visible={showWelcomeModal}
                onClose={handleModalClose}
                secondaryButton={{
                    label: localizedText.modalButton,
                    onPress: () => handleModalClose()
                }}
            >
                <ButtonLabel>
                    {localizedText.welcomeModal}
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:ContainerKwark@Gmail.com')}>
                        <ButtonLabel style={{ color: '#007AFF', textDecorationLine: 'underline'}}>
                            ContainerKwark@Gmail.com
                        </ButtonLabel>
                    </TouchableOpacity>
                </ButtonLabel>
            </ModalComponent>
        </ScreenContainer>
    );
};

export default StartScreen;

//TODO: If this is the first time playing show modal with welcome text