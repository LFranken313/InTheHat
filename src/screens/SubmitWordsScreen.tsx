import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLanguage} from "../logic/LanguageContext";
import presetWords from '../assets/PresetWords.json';
import {RootStackParamList} from "../navigation/types";
import {translations} from "../translations";
import ModalComponent from '../components/ModalComponent';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';

const screenWidth = Dimensions.get('window').width;
const BUTTON_WIDTH = screenWidth * 0.38;

//region Styled components
const MainContent = styled.ScrollView(() => ({
    marginTop: 32,
    width: '100%',
    maxHeight: '78%',
    flexShrink: 0,
}));

const ModalText = styled(StyledText)(({ theme }) => ({
    fontSize: 18,
    color: theme.ModalTextColor,
    textAlign: 'center',
    fontWeight: '600',
    width: '100%',
}));

const Label = styled(StyledText)(({ theme }) => ({
    fontSize: 20,
    color: theme.SubmitWordsLabelColor,
    marginBottom: 8,
    textAlign: 'center',
}));

const WordInput = styled.TextInput(({ theme }) => ({
    height: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.SubmitWordsInputBackground,
    fontSize: 20,
    borderWidth: 2,
    borderColor: theme.SubmitWordsInputBorder,
    marginBottom: 12,
    textAlign: 'center',
    shadowColor: theme.SubmitWordsInputShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    width: '60%',
}));

const AddButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.SubmitWordsAddButtonText,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
}));

const BottomBar = styled.View(() => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
}));

const WordCountText = styled(StyledText)(({ theme }) => ({
    color: theme.SubmitWordsCountText,
    marginTop: 12,
}));

const ActionButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.SubmitWordsActionButtonBackground,
    paddingVertical: 14,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.SubmitWordsActionButtonBorder,
    width: BUTTON_WIDTH,
    shadowColor: theme.SubmitWordsActionButtonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
}));

const FillRandomButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.SubmitWordsFillRandomButtonBackground,
    paddingVertical: 14,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.SubmitWordsFillRandomButtonBorder,
    width: BUTTON_WIDTH,
    marginTop: 8,
    shadowColor: theme.SubmitWordsFillRandomButtonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
}));

const FillRandomText = styled(StyledText)(({ theme }) => ({
    color: theme.SubmitWordsFillRandomText,
    fontSize: 20,
}));
//endregion

const SubmitWordsScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'SubmitWordsScreen'>>();
    const [showFillRandomModal, setShowFillRandomModal] = useState(false);
    const { language } = useLanguage();
    const localizedText = translations[language].submitWordsSreen;
    const {words: requiredWords, players, teams, rounds, customGame } = route.params
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
            headerText={localizedText.title}
            showPrimaryButton
            primaryButtonText={localizedText.primaryButton}
            onPrimaryButtonPress={handleSubmit}
            primaryButtonDisabled={isPrimaryDisabled}
        >
            <MainContent
                contentContainerStyle={{alignItems: 'center'}}
                showsVerticalScrollIndicator={false}
            >
                <Label>
                    {localizedText.atLeast} {requiredWords} {localizedText.moreIsAllowed}
                </Label>
                <WordInput
                    value={word}
                    onChangeText={setWord}
                    placeholder={localizedText.wordPlaceholder}
                    onSubmitEditing={addWord}
                    returnKeyType="done"
                />

                <ActionButton onPress={addWord} disabled={isAddDisabled} style={{opacity: isAddDisabled ? 0.5 : 1}}>
                    <AddButtonText>Add</AddButtonText>
                </ActionButton>

            </MainContent>
            <BottomBar>
                <WordCountText>
                    {hat.length} / {requiredWords} {localizedText.wordsEntered}
                </WordCountText>
                <FillRandomButton
                    onPress={handleFillRandom}
                    disabled={hat.length >= requiredWords}
                >
                    <FillRandomText>
                        {localizedText.fillRandom}
                    </FillRandomText>
                </FillRandomButton>
            </BottomBar>
            <ModalComponent
                visible={showFillRandomModal}
                onClose={() => setShowFillRandomModal(false)}
                primaryButton={{
                    label: localizedText.confirmButtonLabel,
                    onPress: confirmFillRandom
                }}
                secondaryButton={{
                    label: localizedText.cancelButtonLabel,
                    onPress: () => setShowFillRandomModal(false)
                }}
            >
                <ModalText style={{ textAlign: 'center', fontSize: 18 }}>
                    {`${localizedText.fill} ${requiredWords - hat.length} ${localizedText.restOfTheWords}`}
                </ModalText>
            </ModalComponent>
        </ScreenContainer>
    );
}
export default SubmitWordsScreen;