import React, {useState} from 'react';
import {FlatList, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {useNavigation, useRoute} from '@react-navigation/native';
import presetWords from '../assets/PresetWords.json';

const screenWidth = Dimensions.get('window').width;
const BUTTON_WIDTH = screenWidth * 0.38;

// const MainContent = styled.View`

// `;

const MainContent = styled.ScrollView`
    margin-top: 32px;
    width: 100%;
    max-height: 78%;
    flex-shrink: 0;
`;

const Label = styled(StyledText)`
    font-size: 20px;
    color: #7c4a03;
    margin-bottom: 8px;
    text-align: center;
`;

const WordInput = styled.TextInput`
    height: 48px;
    padding: 8px 12px;
    background: #fff;
    font-size: 20px;
    border-width: 2px;
    border-color: #f7c873;
    margin-bottom: 12px;
    text-align: center;
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
`;

const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;
`;

const ActionButton = styled.TouchableOpacity`
    background: #6fb8e6;
    padding: 18px 0;
    align-items: center;
    border-width: 2px;
    border-color: #fff;
    width: ${BUTTON_WIDTH}px;
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
`;

const AddHatButton = styled(ActionButton)`
    background: #43d9be;
`;

const AddButtonText = styled(StyledText)`
    color: #fff;
    font-size: 20px;
`;

const WordGridItem = styled.TouchableOpacity<{ selected?: boolean }>`
    flex: 1;
    margin: 6px;
    padding: 14px 0;
    background-color: #fffbe6;
    border-width: 2px;
    border-color: #f7c873;
    align-items: center;
    border-radius: 8px;
    min-width: 0;
`;

const WordText = styled(StyledText)`
    font-size: 18px;
    color: #7c4a03;
    text-align: center;
    width: 100%;
    flex-shrink: 1;
`;

const RemoveText = styled(StyledText)`
    color: #e67c73;
    font-size: 15px;
    margin-top: 4px;
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
    color: #7c4a03;
    margin-top: 12px;
`;

const FillRandomButton = styled.TouchableOpacity`
    background: #f7c873;
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: #fff;
    width: ${BUTTON_WIDTH}px;
    margin-top: 8px;
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 6;
`;

const FillRandomText = styled(StyledText)`
    color: #7c4a03;
    font-size: 20px;
`;

const SubmitWordsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {words: requiredWords, players, teams, rounds} = route.params as {
        words: number;
        players: number;
        teams: number;
        rounds: number;
    };

    const [word, setWord] = useState('');
    const [batch, setBatch] = useState<string[]>([]);
    const [hat, setHat] = useState<string[]>([]);

    const getRandomWords = (count: number) => {
        const used = new Set(hat.map(w => w.toLowerCase()));
        const available = presetWords
            .map(w => w.name)
            .filter(name => !used.has(name.toLowerCase()));
        const shuffled = available.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    };

    const fillRandom = () => {
        const missing = requiredWords - hat.length;
        if (missing > 0) {
            const randomWords = getRandomWords(missing);
            setHat([...hat, ...randomWords]);
        }
    };

    const addWord = () => {
        const trimmed = word.trim();
        if (trimmed && !batch.includes(trimmed)) {
            setBatch([...batch, trimmed]);
            setWord('');
        }
    };

    const removeWord = (index: number) => {
        setBatch(list => list.filter((_, i) => i !== index));
    };

    const addBatchToHat = () => {
        setHat([...hat, ...batch]);
        setBatch([]);
        setWord('');
    };

    const handleSubmit = () => {
        navigation.navigate('SubmitPlayerNames', {
            words: requiredWords,
            players,
            teams,
            rounds,
            selectedCategories: [],
            customWords: hat
        });
    };

    const isAddDisabled = !word.trim();
    const isBatchEmpty = batch.length === 0;
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
                <ButtonRow>
                    <ActionButton onPress={addWord} disabled={isAddDisabled} style={{opacity: isAddDisabled ? 0.5 : 1}}>
                        <AddButtonText>Add</AddButtonText>
                    </ActionButton>
                    <AddHatButton onPress={addBatchToHat} disabled={isBatchEmpty}
                                  style={{opacity: isBatchEmpty ? 0.5 : 1}}>
                        <AddButtonText>Add to the hat</AddButtonText>
                    </AddHatButton>
                </ButtonRow>
                <FlatList
                    data={batch}
                    keyExtractor={(item, idx) => item + idx}
                    numColumns={2}
                    renderItem={({item, index}) => (
                        <WordGridItem onPress={() => removeWord(index)}>
                            <WordText>{item}</WordText>
                            <RemoveText>Remove</RemoveText>
                        </WordGridItem>
                    )}
                    style={{width: '100%', minHeight: 60}}
                    scrollEnabled={false}
                />
            </MainContent>
            <BottomBar>
                <WordCountText>
                    {hat.length} / {requiredWords} words entered
                </WordCountText>
                <FillRandomButton onPress={fillRandom} disabled={hat.length >= requiredWords}>
                    <FillRandomText>
                        Fill Random
                    </FillRandomText>
                </FillRandomButton>
            </BottomBar>
        </ScreenContainer>
    );
}
export default SubmitWordsScreen;