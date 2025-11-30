import React, {useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {Text} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import styled from 'styled-components/native';
import SetupGrid from "../components/SetupGrid";
import {translations} from "../translations";
import {useLanguage} from "../logic/LanguageContext";
import ModalComponent from "../components/ModalComponent";
import GameRulesContent from "../components/GameRulesContent";
import {RootStackParamList} from '../navigation/types';
import type {StackNavigationProp} from '@react-navigation/stack';

//region Styled components

const ModalText = styled(StyledText)(({ theme }) => ({
    fontSize: 22,
    color: theme.MainScreenButtonLabel,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
}));

const ContentWrapper = styled.View(() => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
}));

const InfoButtonContainer = styled.View(() => ({
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
}));

const InfoButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.SetupInfoButtonBackground,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: theme.SetupInfoButtonBorder,
    shadowColor: theme.MainScreenButtonShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const InfoButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.SetupInfoButtonText,
    fontSize: 16,
    fontWeight: '600',
}));

const RoundButtonRow = styled.View(() => ({
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
}));

const RoundButton = styled.TouchableOpacity<{ selected: boolean }>(({ theme, selected }) => ({
    backgroundColor: selected ? theme.BannerColor : theme.BannerColor,
    borderWidth: 2,
    borderColor: theme.SetupButtonBorder,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    borderRadius: 8,
    opacity: selected ? 1 : 0.7,
}));

const RoundButtonText = styled(StyledText)<{ selected: boolean }>(({ theme, selected }) => ({
    color: selected ? theme.SetupButtonText : theme.SetupButtonText,
    fontSize: 18,
    fontWeight: selected ? 'bold' : 'normal',
}));

const RoundButtonRowLabel = styled(StyledText)(({ theme }) => ({
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    color: theme.SetupGridLabelColor,
    fontWeight: '600',
}));

//endregion

const SetupScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Setup'>>();
    const { customGame } = route.params;
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
    const localizedText = translations[language].setupScreen;
    const rulesModalText = translations[language].rulesModal;

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

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const handleSubmit = () => {
        if (teams > 1 && players < teams * 2 && !hasShownPlayerWarning) {
            setwarningText(localizedText.playerWarning);
            setShowWarning(true);
            setHasShownPlayerWarning(true);
            return;
        }
        if (words / players < 4 && !hasShownWordWarning) {
            setwarningText(localizedText.wordWarning);
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