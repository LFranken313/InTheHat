import React, {useState} from 'react';
import {View, FlatList, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {useNavigation, useRoute} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const BUTTON_WIDTH = screenWidth * 0.38;

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
    border-radius: 8px;
    margin-bottom: 12px;
    text-align: center;
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
    border-radius: 8px;
    align-items: center;
    border-width: 2px;
    border-color: #fff;
    width: ${BUTTON_WIDTH}px;
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
            <View style={{marginTop: 32, alignItems: 'center', width: '100%'}}>
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
                    numColumns={3}
                    renderItem={({item, index}) => (
                        <WordGridItem onPress={() => removeWord(index)}>
                            <WordText>{item}</WordText>
                            <RemoveText>Remove</RemoveText>
                        </WordGridItem>
                    )}
                    style={{width: '100%', minHeight: 60}}
                    scrollEnabled={false}
                />
                <StyledText style={{color: '#7c4a03', marginTop: 12}}>
                    {hat.length} / {requiredWords} words entered
                </StyledText>
            </View>
        </ScreenContainer>
    );
};

export default SubmitWordsScreen;