import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import { Text } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import styled from 'styled-components/native';
import SetupGrid from "../components/SetupGrid";
import textContent from '../textContent.json';
import {useLanguage} from "../logic/LanguageContext";
import ModalComponent from "../components/ModalComponent";
import GameRulesContent from "../components/GameRulesContent";


//region Styled components

const ModalText = styled(StyledText)`
    font-size: 22px;
    color: ${({ theme }) => theme.MainScreenButtonLabel};
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const ContentWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const InfoButtonContainer = styled.View`
    align-items: center;
    margin-bottom: 24px;
    width: 100%;
`;

const InfoButton = styled.TouchableOpacity`
    background: ${({theme}) => theme.SetupInfoButtonBackground};
    padding: 8px 18px;
    border-width: 1px;
    border-color: ${({theme}) => theme.SetupInfoButtonBorder};
    shadow-color: ${({theme}) => theme.SetupButtonShadowColor};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const InfoButtonText = styled(StyledText)`
    color: ${({theme}) => theme.SetupInfoButtonText};
    font-size: 16px;
    font-weight: 600;
`;

const RoundButtonRow = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-bottom: 16px;
`;

const RoundButton = styled.TouchableOpacity<{ selected: boolean }>`
    background: ${({theme, selected}) => selected ? theme.BannerColor : theme.BannerColor};
    border-width: 2px;
    border-color: ${({theme}) => theme.SetupButtonBorder};
    padding: 10px 18px;
    margin: 0 8px;
    border-radius: 8px;
    opacity: ${({selected}) => selected ? 1 : 0.7};
`;

const RoundButtonText = styled(StyledText)<{ selected: boolean }>`
    color: ${({theme, selected}) => selected ? theme.SetupButtonText : theme.SetupButtonText};
    font-size: 18px;
    font-weight: ${({selected}) => selected ? 'bold' : 'normal'};
`;

const RoundButtonRowLabel = styled(StyledText)`
    font-size: 18px;
    margin-bottom: 8px;
    text-align: center;
    color: ${({theme}) => theme.SetupGridLabelColor};
    font-weight: 600;
`;

//endregion

const SetupScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const customGame = route.params?.customGame ?? true;
    const [showInfo, setShowInfo] = useState(false);
    const [players, setPlayers] = useState<number>(4);
    const [teams, setTeams] = useState<number>(2);
    const [words, setWords] = useState<number>(players * 5);
    const [rounds, setRounds] = useState<number>(3);
    const [showWarning, setShowWarning] = useState(false);
    const [hasShownPlayerWarning, setHasShownPlayerWarning] = useState(false);
    const [hasShownWordWarning, setHasShownWordWarning] = useState(false);
    const [warningText, setwarningText] = useState('');
    const { language } = useLanguage();
    const localizedText = textContent[language].setupScreen;
    const rulesModalText = textContent[language].rulesModal;

    const isFormValid = () => {
        if (!customGame) {
            return players > 0 && teams > 0;
        }
        return players > 0 && teams > 0 && words > 0 && rounds > 0;
    };

    const getFormValues = () => ({
        players,
        teams,
        words,
        rounds,
        customGame
    });

    const handleSetPlayers = (n: number) => {
        setPlayers(n);
        setWords(n * 5);
    };

    // const handleInput = (setter: (n: number) => void) => (text: string) => {
    //     const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    //     setter(isNaN(num) ? 0 : num);
    // };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const handleSubmit = () => {
        if (teams > 1 && players < teams * 2 && !hasShownPlayerWarning) {
            setwarningText(" Warning: At least one team will have only 1 player. Consider adjusting the numbers for balanced teams.");
            setShowWarning(true);
            setHasShownPlayerWarning(true);
            return;
        }
        if (words / players < 4 && !hasShownWordWarning) {
            setwarningText("Please choose at least 4 words per player for a better game experience.");
            setShowWarning(true);
            setHasShownWordWarning(true);
            return;
        }
        if (customGame) {
            navigation.navigate('SubmitWordsScreen', getFormValues());
        } else {
            navigation.navigate('QuickGameScreen', getFormValues());
        }
    }

    return (
        <ScreenContainer
            headerText={localizedText.title}
            showPrimaryButton
            onPrimaryButtonPress={handleSubmit}
            primaryButtonText={localizedText.primaryButton}
            primaryButtonDisabled={!isFormValid()}
        >
            <ContentWrapper>
                {!customGame && (
                    <>
                        <RoundButtonRowLabel>
                            {localizedText.presetLabel}
                        </RoundButtonRowLabel>
                        <RoundButtonRow>
                            {[4, 6, 8, 10].map(num => (
                                <RoundButton
                                    key={num}
                                    selected={players === num}
                                    onPress={() => handleSetPlayers(num)}
                                >
                                    <RoundButtonText selected={players === num}>{num}</RoundButtonText>
                                </RoundButton>
                            ))}
                        </RoundButtonRow>
                    </>
                )}

                <SetupGrid
                    players={players}
                    teams={teams}
                    words={words}
                    rounds={rounds}
                    inputsDisabled={!customGame}
                    // handleInput={handleInput}
                    setPlayers={handleSetPlayers}
                    setTeams={setTeams}
                    setWords={setWords}
                    setRounds={setRounds}
                />
                <InfoButtonContainer>
                    <InfoButton onPress={() => setShowInfo(true)}>
                        <InfoButtonText>{localizedText.modalTitle}</InfoButtonText>
                    </InfoButton>
                </InfoButtonContainer>
            </ContentWrapper>
            <ModalComponent
                visible={showWarning}
                onClose={handleCloseWarning}
                secondaryButton={{
                    label: "OK",
                    onPress: handleCloseWarning
                }}
            >
                <ModalText>
                    <Text>{warningText}</Text>
                </ModalText>
            </ModalComponent>
            <ModalComponent
                visible={showInfo}
                onClose={() => setShowInfo(false)}
                secondaryButton={{
                    label: rulesModalText.modalButton,
                    onPress: () => setShowInfo(false)
                }}
            >
                <GameRulesContent onClose={() => setShowInfo(false)} />
            </ModalComponent>
        </ScreenContainer>
    );
};

export default SetupScreen;