import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {GameService} from "../logic/GameService";
import {WordService} from "../logic/WordService";
import {GameStateService} from '../logic/GameStateService';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RandomNamesService} from '../logic/RandomNamesService';
import ListContainer from "../components/ListContainer";
import {useLanguage} from "../logic/LanguageContext";
import {translations} from "../translations";

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);


//region Styled components
const Label = styled(StyledText)`
    font-size: 20px;
    color: ${({ theme }) => theme.SubmitLabelColor};
    margin-bottom: 8px;
    text-align: center;
`;

const NameInput = styled.TextInput`
    height: 48px;
    padding: 8px 12px;
    background: ${({ theme }) => theme.SubmitNameInputBackground};
    font-size: 20px;
    border-width: 2px;
    border-color: ${({ theme }) => theme.SubmitNameInputBorder};
    margin-bottom: 12px;
    text-align: center;
    shadow-color: ${({ theme }) => theme.SubmitNameInputShadow};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const ButtonRow = styled.View`
    flex-direction: row;
    width: 100%;
    margin-bottom: 24px;
    gap: 12px;
`;

const buttonShadow = {
    shadowColor: undefined, // will be set in style prop using theme
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
};

const AddButton = styled.TouchableOpacity`
    background: ${({ theme }) => theme.SubmitAddButtonBackground};
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: ${({ theme }) => theme.SubmitAddButtonBorder};
    flex: 1;
`;

const RandomButton = styled.TouchableOpacity`
    background: ${({ theme }) => theme.SubmitRandomButtonBackground};
    padding: 14px 0;
    align-items: center;
    border-width: 2px;
    border-color: ${({ theme }) => theme.SubmitRandomButtonBorder};
    flex: 1;
`;

const AddButtonText = styled(StyledText)`
    color: ${({ theme }) => theme.SubmitAddButtonText};
    font-size: 20px;
`;

const RandomButtonText = styled(StyledText)`
    color: ${({ theme }) => theme.SubmitRandomButtonText};
    font-size: 18px;
`;

const NameItem = styled.View`
    background: ${({ theme }) => theme.SubmitNameItemBackground};
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
    align-items: center;
    border-width: 2px;
    border-color: ${({ theme }) => theme.SubmitNameItemBorder};
    shadow-color: ${({ theme }) => theme.SubmitNameItemShadow};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const NameText = styled(StyledText)`
    font-size: 20px;
    color: ${({ theme }) => theme.SubmitNameText};
`;

const NamesEnteredText = styled(StyledText)`
    color: ${({ theme }) => theme.SubmitNamesEnteredText};
    margin-top: 12px;
`;

//endregion

const SubmitPlayerNamesScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const [name, setName] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const { language } = useLanguage();
    const localizedText = translations[language].submitPlayerNamesScreen;
    const {players, teams, words, rounds, selectedCategories, customWords, customGame} = route.params as {
        players: number;
        teams: number;
        words: number;
        rounds: number;
        selectedCategories: string[];
        customWords: string[];
        customGame: boolean;
    };

    //region Methods
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
        navigation.navigate('TeamOverviewScreen', customGame);
    };

    //endregion

    //region Html
    return (
        <ScreenContainer
            headerText={localizedText.title}
            headerLines={2}
            showPrimaryButton
            primaryButtonText={localizedText.primaryButton}
            onPrimaryButtonPress={handleSubmit}
            primaryButtonDisabled={names.length !== players}
        >
            <Label>{localizedText.playerNameLabel}</Label>
            <NameInput
                value={name}
                onChangeText={setName}
                placeholder={localizedText.playerNamePlaceholder}
                editable={names.length < players}
                onSubmitEditing={addName}
                returnKeyType="done"
            />
            <ButtonRow>
                <AddButton
                    onPress={addName}
                    disabled={isAddDisabled}
                    style={[
                        {opacity: isAddDisabled ? 0.5 : 1, shadowColor: theme.SubmitAddButtonBorder},
                        buttonShadow
                    ]}
                >
                    <AddButtonText>{localizedText.addButton}</AddButtonText>
                </AddButton>
                <RandomButton
                    onPress={fillRandomNames}
                    style={[
                        {shadowColor: theme.SubmitRandomButtonBorder},
                        buttonShadow
                    ]}
                >
                    <RandomButtonText>{localizedText.randomNamesButton}</RandomButtonText>
                </RandomButton>
            </ButtonRow>
            <ListContainer flatListProps={{
                data: names,
                keyExtractor: (item, idx) => item + idx,
                renderItem: ({item, index}) => (
                    <TouchableOpacity onPress={() => removeName(index)}>
                        <NameItem>
                            <NameText>{index + 1}. {item}</NameText>
                        </NameItem>
                    </TouchableOpacity>
                ),
                style: {width: '100%'},
                scrollEnabled: true,
            }}/>
            <NamesEnteredText>
                {names.length} / {players} {localizedText.namesEntered}
            </NamesEnteredText>
        </ScreenContainer>
        //endregion
    );
};

export default SubmitPlayerNamesScreen;