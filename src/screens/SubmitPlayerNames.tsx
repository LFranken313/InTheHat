import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import { GameService } from "../logic/GameService";
import { WordService } from "../logic/WordService";
import { GameStateService } from '../logic/GameStateService';
import {useNavigation, useRoute} from '@react-navigation/native';
import { RandomNamesService } from '../logic/RandomNamesService';
import { TouchableOpacity } from 'react-native';
import ListContainer from "../components/ListContainer";

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);


const Label = styled(StyledText)`
    font-size: 20px;
    color: #7c4a03;
    margin-bottom: 8px;
    text-align: center;
`;

const NameInput = styled.TextInput`
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
    width: 100%;
    margin-bottom: 24px;
    gap: 12px;
`;

const buttonShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
};

const AddButton = styled.TouchableOpacity`
    background: #6fb8e6;
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: #fff;
    flex: 1;
`;

const RandomButton = styled.TouchableOpacity`
    background: #43d9be;
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: #fff;
    flex: 1;
`;


const AddButtonText = styled(StyledText)`
    color: #fff;
    font-size: 20px;
`;

const RandomButtonText = styled(StyledText)`
    color: #fff;
    font-size: 18px;
`;

const NameItem = styled.View`
    background: #fffbe6;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
    align-items: center;
    border-width: 2px;
    border-color: #f7c873;
`;

const NameText = styled(StyledText)`
    font-size: 20px;
    color: #7c4a03;
`;

const SubmitPlayerNames = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const { players, teams, words, rounds, selectedCategories, customWords } = route.params as {
        players: number;
        teams: number;
        words: number;
        rounds: number;
        selectedCategories: string[];
        customWords: string[];
    };

    const addName = () => {
        if (name.trim() && names.length < players) {
            setNames([...names, name.trim()]);
            setName('');
        }
    };

    const fillRandomNames = () => {
        const namesNeeded = players - names.length;
        if (namesNeeded <= 0) return;
        const randomNames = RandomNamesService.getRandomNames(namesNeeded)
            .filter(n => !names.includes(n));
        setNames([...names, ...randomNames]);
        setName('');
    };

    const isAddDisabled = !name.trim() || names.length >= players;

    const removeName = (index: number) => {
        setNames(names => names.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const game = await gameService.initializeGame(
            names,
            teams,
            rounds,
            words,
            selectedCategories,
            customWords
        )
        await gameStateService.saveGameState(game)
        navigation.navigate('PlayerTurnScreen');
    };

    return (
        <ScreenContainer
            headerText="Enter player names"
            headerLines={2}
            showPrimaryButton
            primaryButtonText="Next: start game"
            onPrimaryButtonPress={() => {
                handleSubmit()
            }}
            primaryButtonDisabled={names.length !== players}
        >
            <View style={{ marginTop: 32, alignItems: 'center' }}>
                <Label>Player name</Label>
                <NameInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                    editable={names.length < players}
                    onSubmitEditing={addName}
                    returnKeyType="done"
                />
                <ButtonRow>
                    <AddButton
                        onPress={addName}
                        disabled={isAddDisabled}
                        style={[{ opacity: isAddDisabled ? 0.5 : 1 }, buttonShadow]}
                    >
                        <AddButtonText>Add</AddButtonText>
                    </AddButton>
                    <RandomButton
                        onPress={fillRandomNames}
                        style={buttonShadow}
                    >
                        <RandomButtonText>Random names</RandomButtonText>
                    </RandomButton>

                </ButtonRow>
                <ListContainer>
                    <FlatList
                        data={names}
                        keyExtractor={(item, idx) => item + idx}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => removeName(index)}>
                                <NameItem>
                                    <NameText>{index + 1}. {item}</NameText>
                                </NameItem>
                            </TouchableOpacity>
                        )}
                        style={{ width: '100%' }}
                        scrollEnabled
                    />
                </ListContainer>
                <StyledText style={{ color: '#7c4a03', marginTop: 12 }}>
                    {names.length} / {players} names entered
                </StyledText>
            </View>
        </ScreenContainer>
    );
};

export default SubmitPlayerNames;