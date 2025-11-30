import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';
import {Image, Linking, TouchableOpacity, useWindowDimensions} from 'react-native'
import ScreenContainer from '../components/ScreenContainer';
import StyledBold from '../components/StyledBold';
import StyledText from '../components/StyledText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalComponent from "../components/ModalComponent";
import {translations} from "../translations";
import {useLanguage} from '../logic/LanguageContext';
import {RootStackParamList} from '../navigation/types';
import type {StackNavigationProp} from '@react-navigation/stack';

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

const ButtonLabel = styled(StyledText)(({ theme }) => ({
    fontSize: 22,
    color: theme.MainScreenButtonLabel,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
}));

const StyledButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.MainScreenButtonBackGround,
    borderColor: theme.MainScreenButtonBorder,
    borderWidth: 2,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    width: '80%',
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
}));

const ButtonRow = styled.View(() => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 16,
}));

const HalfButton = styled(StyledButton)(() => ({
    width: '48%',
    marginBottom: 0,
}));

const ImageContainer = styled.View(() => ({
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
}));

const ButtonContainer = styled.View(() => ({
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: '10%',
}));
//endregion

const StartScreen = () => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { height}  = useWindowDimensions();
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const { language } = useLanguage();
    const localizedText = translations[language].startScreen;
    let customGame = false;

    useEffect(() => {
        const checkSavedGame = async () => {
            const service = new GameStateService();
            const game = await service.loadGameState();
            setHasSavedGame(!!game);
            customGame = game.customGame;
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
                    <StyledButton onPress={() => navigation.navigate('PlayerTurnScreen', {customGame})}>
                        <ButtonLabel>{localizedText.loadButton}</ButtonLabel>
                    </StyledButton>
                )}
                <StyledButton onPress={() => navigation.navigate('SettingsScreen')}>
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