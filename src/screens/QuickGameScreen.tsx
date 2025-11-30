import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import styled from 'styled-components/native';
import {WordService} from '../logic/WordService';
import {StackNavigationProp} from '@react-navigation/stack';
import StyledText from '../components/StyledText';
import GameOverview from '../components/GameOverview';
import ScreenContainer from '../components/ScreenContainer';
import ListContainer from "../components/ListContainer";
import CategoryCard from '../components/CategoryCard';
import {useLanguage} from "../logic/LanguageContext";
import {translations} from "../translations";
import {RootStackParamList} from "../navigation/types";

const wordService = new WordService();

//region Styled components
const Centered = styled.View(({ theme }) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.QuickGameScreenBackground,
}));

const Label = styled(StyledText)(({ theme }) => ({
    fontSize: 20,
    marginBottom: 8,
    color: theme.QuickGameScreenLabelColor,
    textAlign: 'center',
}));

const Subheader = styled(StyledText)(({ theme }) => ({
    fontSize: 30,
    marginTop: 24,
    marginBottom: 12,
    color: theme.QuickGameScreenSubheaderColor,
    textAlign: 'center',
}));

const SelectAllButton = styled.TouchableOpacity<{ selected: boolean }>(({ theme, selected }) => ({
    backgroundColor: selected
        ? theme.QuickGameScreenSelectAllButtonSelectedBg
        : theme.QuickGameScreenSelectAllButtonUnselectedBg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: selected
        ? theme.QuickGameScreenSelectAllButtonSelectedBorder
        : theme.QuickGameScreenSelectAllButtonUnselectedBorder,
    alignSelf: 'center',
    marginBottom: 12,
    shadowColor: theme.QuickGameScreenSelectAllButtonShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    minWidth: 0,
    width: '40%',
}));

const SelectAllText = styled(StyledText)<{ selected: boolean }>(({ theme, selected }) => ({
    color: selected
        ? theme.QuickGameScreenSelectAllTextSelected
        : theme.QuickGameScreenSelectAllTextUnselected,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
}));
//endregion

const QuickGameScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SubmitPlayerNamesScreen'>>();
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const isValid = selected.size > 0;
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const localizedText = translations[language].quickGameScreen;
    const route = useRoute<RouteProp<RootStackParamList, 'QuickGameScreen'>>();
    const { players, teams, words, rounds, customGame } = route.params;

    const handleSelectAll = () => {
        if (selected.size === categories.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(categories));
        }
    };

    useEffect(() => {
        setCategories(wordService.getAllCategories());
        setLoading(false);
    }, []);

    const toggleCategory = (cat: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(cat)) {
                next.delete(cat);
            } else {
                next.add(cat);
            }
            return next;
        });
    };

    const handleSubmit = () => {
        const selectedCategories = Array.from(selected);
        navigation.navigate('SubmitPlayerNamesScreen', {
            players,
            teams,
            words,
            rounds,
            selectedCategories,
            customWords: [],
            customGame
        });
    };

    if (loading) {
        return (
            <Centered>
                <ActivityIndicator size="large" color="#6fb8e6"/>
                <Label>{localizedText.loadingCategories}</Label>
            </Centered>
        );
    }

    return (
        <ScreenContainer
            headerText={localizedText.title}
            headerLines={2}
            showPrimaryButton
            primaryButtonDisabled={!isValid}
            primaryButtonText={localizedText.primaryButtonText}
            onPrimaryButtonPress={handleSubmit}
        >
            <GameOverview players={players} teams={teams} words={words} rounds={rounds}/>
            <Subheader>{categories.length} {localizedText.subheader}</Subheader>
            <SelectAllButton
                onPress={handleSelectAll}
                selected={selected.size === categories.length}
            >
                <SelectAllText selected={selected.size === categories.length}>
                    {selected.size === categories.length ? localizedText.deselectAll : localizedText.selectAll}
                </SelectAllText>
            </SelectAllButton>
            <ListContainer
                flatListProps={{
                    data: categories,
                    keyExtractor: item => item,
                    numColumns: 2,
                    contentContainerStyle: { paddingHorizontal: 8, alignItems: 'stretch' },
                    renderItem: ({ item }) => (
                        <CategoryCard
                            selected={selected.has(item)}
                            onPress={() => toggleCategory(item)}
                        >
                            {item}
                        </CategoryCard>
                    ),
                    style: { flexGrow: 0 }
                }}
            />
        </ScreenContainer>
    );
};

export default QuickGameScreen;