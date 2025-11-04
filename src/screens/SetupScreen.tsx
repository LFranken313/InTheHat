import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Modal, Image, View, TouchableOpacity} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import styled from 'styled-components/native';
import GameRulesModal from "../components/GameRulesModal";
import SetupGrid from "../components/SetupGrid";

const ModalContent = styled.View`
    background: #fffbe6;
    padding: 24px 20px;
    border-radius: 12px;
    align-items: center;
    margin: 100px 32px;
    elevation: 5;
`;

const ModalText = styled(StyledText)`
    color: #7c4a03;
    font-size: 18px;
    text-align: center;
    margin-bottom: 16px;
`;

const buttonShadow = {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
};

const CloseButton = styled.TouchableOpacity`
    background: #43d9be;
    padding: 10px 24px;
    border-color: #fff;
    border-width: 2px;
`;

const CloseButtonText = styled(StyledText)`
    color: #fff;
    font-size: 16px;
`;

const ContentWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const ButtonRow = styled.View`
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 32px;
`;

const Button = styled.TouchableOpacity<{ bg: string }>`
    background: ${props => props.bg};
    padding: 20px 0;
    border-color: #fff;
    border-width: 2px;
    margin: 0 0 16px 0;
    flex: none;
    align-items: center;
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
`;

const ButtonText = styled(StyledText)`
    font-size: 28px;
    color: #fff;
    letter-spacing: 1px;
`;

const InfoButtonContainer = styled.View`
    align-items: center;
    margin-bottom: 24px;
    width: 100%;
`;

const InfoButton = styled.TouchableOpacity`
    background: #fffbe6;
    padding: 8px 18px;
    border-width: 1px;
    border-color: #f7c873;
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const InfoButtonText = styled(StyledText)`
    color: #7c4a03;
    font-size: 16px;
    font-weight: 600;
`;

const WarningModal = styled(Modal)``;

const SetupScreen = () => {
    const [showInfo, setShowInfo] = useState(false);
    const [players, setPlayers] = useState<number>(4);
    const [teams, setTeams] = useState<number>(2);
    const [words, setWords] = useState<number>(20);
    const [rounds, setRounds] = useState<number>(3);
    const [showWarning, setShowWarning] = useState(false);
    const navigation = useNavigation();

    const isFormValid = () => {
        return players > 0 && teams > 0 && words > 0 && rounds > 0 && players >= teams * 2;
    };

    useEffect(() => {
        if (
            teams > 1 &&
            players > 1 &&
            (players % teams === 1 || players < teams * 2)
        ) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
    }, [players, teams]);

    const getFormValues = () => ({
        players,
        teams,
        words,
        rounds,
    });

    const handleInput = (setter: (n: number) => void) => (text: string) => {
        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        setter(isNaN(num) ? 0 : num);
    };

    const handleButtonPress = (type: 'quick' | 'custom') => {
        const formValues = getFormValues();
        if (type === 'quick') {
            navigation.navigate('QuickGameScreen', formValues);
        }
        if (type === 'custom') {
            navigation.navigate('SubmitWordsScreen', formValues);
        }
    };

    return (
        <ScreenContainer headerText="SETUP">
            <ContentWrapper>
                <SetupGrid
                    players={players}
                    teams={teams}
                    words={words}
                    rounds={rounds}
                    handleInput={handleInput}
                    setPlayers={setPlayers}
                    setTeams={setTeams}
                    setWords={setWords}
                    setRounds={setRounds}
                />
                <InfoButtonContainer>
                    <InfoButton onPress={() => setShowInfo(true)}>
                        <InfoButtonText>New? Read the rules.</InfoButtonText>
                    </InfoButton>
                </InfoButtonContainer>
            </ContentWrapper>
            <ButtonRow>
                <Button
                    bg="#6fb8e6"
                    onPress={() => handleButtonPress('quick')}
                    disabled={!isFormValid()}
                    style={[{opacity: !isFormValid() ? 0.5 : 1}, buttonShadow]}
                >
                    <ButtonText>Quick game</ButtonText>
                </Button>
                <Button
                    bg="#43d9be"
                    onPress={() => handleButtonPress('custom')}
                    disabled={!isFormValid()}
                    style={[{opacity: !isFormValid() ? 0.5 : 1}, buttonShadow]}
                >
                    <ButtonText>Custom game</ButtonText>
                </Button>
            </ButtonRow>
            <WarningModal
                transparent
                visible={showWarning}
                animationType="fade"
                onRequestClose={() => setShowWarning(false)}>
                <ModalContent>
                    <ModalText>
                        Warning: At least one team will have only 1 player. Consider adjusting the numbers for balanced
                        teams.
                    </ModalText>
                    <CloseButton onPress={() => setShowWarning(false)}>
                        <CloseButtonText>OK</CloseButtonText>
                    </CloseButton>
                </ModalContent>
            </WarningModal>
            <GameRulesModal visible={showInfo} onClose={() => setShowInfo(false)}/>
        </ScreenContainer>
    );
};

export default SetupScreen;