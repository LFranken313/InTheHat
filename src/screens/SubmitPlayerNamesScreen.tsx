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

// region Styled components

const Label = styled(StyledText)(({ theme }) => ({
    fontSize: 20,
    color: theme.SubmitLabelColor,
    marginBottom: 8,
    textAlign: 'center',
}));

const NameInput = styled.TextInput(({ theme }) => ({
    height: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.SubmitNameInputBackground,
    fontSize: 20,
    borderWidth: 2,
    borderColor: theme.SubmitNameInputBorder,
    marginBottom: 12,
    textAlign: 'center',

    // shadow
    shadowColor: theme.SubmitNameInputShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const ButtonRow = styled.View(() => ({
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    gap: 12,
}));

const AddButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.SubmitAddButtonBackground,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.SubmitAddButtonBorder,
    flex: 1,
}));

const RandomButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.SubmitRandomButtonBackground,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.SubmitRandomButtonBorder,
    flex: 1,
}));

const AddButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.SubmitAddButtonText,
    fontSize: 20,
}));

const RandomButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.SubmitRandomButtonText,
    fontSize: 18,
}));

const NameItem = styled.View(({ theme }) => ({
    backgroundColor: theme.SubmitNameItemBackground,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',

    borderWidth: 2,
    borderColor: theme.SubmitNameItemBorder,

    // shadow
    shadowColor: theme.SubmitNameItemShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const buttonShadow = {
    shadowColor: undefined,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
};

const NameText = styled(StyledText)(({ theme }) => ({
    fontSize: 20,
    color: theme.SubmitNameText,
}));

const NamesEnteredText = styled(StyledText)(({ theme }) => ({
    color: theme.SubmitNamesEnteredText,
    marginTop: 12,
}));

// endregion


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
            customGame,
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