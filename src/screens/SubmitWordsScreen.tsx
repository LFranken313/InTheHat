import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import presetWords from '../assets/PresetWords.json';
import FillRandomModal from "../components/FillRandomModal";

const screenWidth = Dimensions.get('window').width;
const BUTTON_WIDTH = screenWidth * 0.38;

const MainContent = styled.ScrollView`
    margin-top: 32px;
    width: 100%;
    max-height: 78%;
    flex-shrink: 0;
`;

const Label = styled(StyledText)`
    font-size: 20px;
    color: ${({theme}) => theme.SubmitWordsLabelColor};
    margin-bottom: 8px;
    text-align: center;
`;

const WordInput = styled.TextInput`
    height: 48px;
    padding: 8px 12px;
    background: ${({theme}) => theme.SubmitWordsInputBackground};
    font-size: 20px;
    border-width: 2px;
    border-color: ${({theme}) => theme.SubmitWordsInputBorder};
    margin-bottom: 12px;
    text-align: center;
    shadow-color: ${({theme}) => theme.SubmitWordsInputShadow};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
    width: 60%;
`;

const AddButtonText = styled(StyledText)`
    color: ${({theme}) => theme.SubmitWordsAddButtonText};
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const BottomBar = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: center;
    padding-bottom: 24px;
`;

const WordCountText = styled(StyledText)`
    color: ${({theme}) => theme.SubmitWordsCountText};
    margin-top: 12px;
`;

const ActionButton = styled.TouchableOpacity`
    background: ${({theme}) => theme.SubmitWordsActionButtonBackground};
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: ${({theme}) => theme.SubmitWordsActionButtonBorder};
    width: ${BUTTON_WIDTH}px;
    shadow-color: ${({theme}) => theme.SubmitWordsActionButtonShadow};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
`;

const FillRandomButton = styled.TouchableOpacity`
    background: ${({theme}) => theme.SubmitWordsFillRandomButtonBackground};
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: ${({theme}) => theme.SubmitWordsFillRandomButtonBorder};
    width: ${BUTTON_WIDTH}px;
    margin-top: 8px;
    shadow-color: ${({theme}) => theme.SubmitWordsFillRandomButtonShadow};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
`;

const FillRandomText = styled(StyledText)`
    color: ${({theme}) => theme.SubmitWordsFillRandomText};
    font-size: 20px;
`;

type RootStackParamList = {
    SubmitWordsScreen: {
        words: number;
        players: number;
        teams: number;
        rounds: number;
    };
    SubmitPlayerNamesScreen: {
        words: number;
        players: number;
        teams: number;
        rounds: number;
        selectedCategories: string[];
        customWords: string[];
    };
};

const SubmitWordsScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const [showFillRandomModal, setShowFillRandomModal] = useState(false);
    const {words: requiredWords, players, teams, rounds, customGame } = route.params as {
        words: number;
        players: number;
        teams: number;
        rounds: number;
        customGame: boolean;
    };

    const [word, setWord] = useState('');
    const [hat, setHat] = useState<string[]>([]);

    const getRandomWords = (count: number) => {
        const used = new Set(hat.map(w => w.toLowerCase()));
        const available = presetWords
            .map(w => w.name)
            .filter(name => !used.has(name.toLowerCase()));
        const shuffled = available.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    const handleFillRandom = () => {
        setShowFillRandomModal(true);
    };

    const confirmFillRandom = () => {
        const missing = requiredWords - hat.length;
        if (missing > 0) {
            const randomWords = getRandomWords(missing);
            setHat([...hat, ...randomWords]);
        }
        setShowFillRandomModal(false);
    };

    const addWord = () => {
        const trimmed = word.trim();
        if (trimmed && !hat.includes(trimmed)) {
            setHat([...hat, trimmed]);
            setWord('');
        }
    };

    const handleSubmit = () => {
        navigation.navigate('SubmitPlayerNamesScreen', {
            words: requiredWords,
            players,
            teams,
            rounds,
            selectedCategories: [] as string[],
            customWords: hat,
            customGame,
        });
    };

    const isAddDisabled = !word.trim();
    const isPrimaryDisabled = hat.length < requiredWords;

    return (
        <ScreenContainer
            headerText="Enter words"
            showPrimaryButton
            primaryButtonText="Next: player names"
            onPrimaryButtonPress={handleSubmit}
            primaryButtonDisabled={isPrimaryDisabled}
        >
            <MainContent
                contentContainerStyle={{alignItems: 'center'}}
                showsVerticalScrollIndicator={false}
            >
                <Label>
                    Enter at least {requiredWords} words{'\n'}
                    (more is allowed)
                </Label>
                <WordInput
                    value={word}
                    onChangeText={setWord}
                    placeholder="Enter word"
                    onSubmitEditing={addWord}
                    returnKeyType="done"
                />

                <ActionButton onPress={addWord} disabled={isAddDisabled} style={{opacity: isAddDisabled ? 0.5 : 1}}>
                    <AddButtonText>Add</AddButtonText>
                </ActionButton>

            </MainContent>
            <BottomBar>
                <WordCountText>
                    {hat.length} / {requiredWords} words entered
                </WordCountText>
                <FillRandomButton
                    onPress={handleFillRandom}
                    disabled={hat.length >= requiredWords}
                >
                    <FillRandomText>
                        Fill Random
                    </FillRandomText>
                </FillRandomButton>
            </BottomBar>
            <FillRandomModal
                visible={showFillRandomModal}
                onRequestClose={() => setShowFillRandomModal(false)}
                onConfirm={confirmFillRandom}
                missing={requiredWords - hat.length}
            />
        </ScreenContainer>
    );
}
export default SubmitWordsScreen;