import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Modal, View, TouchableOpacity} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import styled from 'styled-components/native';

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
    shadowOffset: { width: 0, height: 2 },
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

const Grid = styled.View`
    margin-bottom: 32px;
    align-items: center;
`;

const GridCell = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
`;

const GridLabel = styled(StyledText)`
    font-size: 32px;
    color: #7c4a03;
    width: 120px;
    text-align: right;
    margin-right: 12px;
`;

const GridInput = styled.TextInput`
    height: 48px;
    width: 80px;
    padding: 8px 12px;
    background: #fff;
    font-size: 20px;
    text-align: center;
    border-width: 2px;
    border-color: #f7c873;
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

const WarningModal = styled(Modal)``;

const SetupScreen = () => {
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
                <Grid>
                    <GridCell>
                        <GridLabel>Players</GridLabel>
                        <GridInput
                            keyboardType="numeric"
                            value={String(players)}
                            onChangeText={handleInput(setPlayers)}
                            placeholder="0"
                            onFocus={() => {
                                setPlayers('');
                            }}
                            maxLength={2}
                        />
                    </GridCell>
                    <GridCell>
                        <GridLabel>Teams</GridLabel>
                        <GridInput
                            keyboardType="numeric"
                            value={String(teams)}
                            onChangeText={handleInput(setTeams)}
                            placeholder="0"
                            onFocus={() => {
                                setTeams('');
                            }}
                            maxLength={2}
                        />
                    </GridCell>
                    <GridCell>
                        <GridLabel>Words</GridLabel>
                        <GridInput
                            keyboardType="numeric"
                            value={String(words)}
                            onChangeText={handleInput(setWords)}
                            maxLength={2}
                        />
                    </GridCell>
                    <GridCell>
                        <GridLabel>Rounds</GridLabel>
                        <GridInput
                            keyboardType="numeric"
                            value={String(rounds)}
                            onChangeText={handleInput(setRounds)}
                            placeholder="3"
                            maxLength={2}
                        />
                    </GridCell>
                </Grid>
            </ContentWrapper>
            <ButtonRow>
                <Button
                    bg="#6fb8e6"
                    onPress={() => handleButtonPress('quick')}
                    disabled={!isFormValid()}
                    style={[{ opacity: !isFormValid() ? 0.5 : 1 }, buttonShadow]}
                >
                    <ButtonText>Quick game</ButtonText>
                </Button>
                <Button
                    bg="#43d9be"
                    onPress={() => handleButtonPress('custom')}
                    disabled={!isFormValid()}
                    style={[{ opacity: !isFormValid() ? 0.5 : 1 }, buttonShadow]}
                >
                    <ButtonText>Custom game</ButtonText>
                </Button>

            </ButtonRow>
            <WarningModal
                transparent
                visible={showWarning}
                animationType="fade"
                onRequestClose={() => setShowWarning(false)}
            >
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

        </ScreenContainer>
    );
};

export default SetupScreen;