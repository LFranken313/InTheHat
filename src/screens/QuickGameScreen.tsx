import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useRoute} from '@react-navigation/native';
import styled from 'styled-components/native';
import {WordService} from '../logic/WordService';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import StyledText from '../components/StyledText';
import GameOverview from '../components/GameOverview';
import ScreenContainer from '../components/ScreenContainer';
import ListContainer from "../components/ListContainer";
import CategoryCard from '../components/CategoryCard';


const wordService = new WordService();

const Centered = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.QuickGameScreenBackground};
`;

const Label = styled(StyledText)`
    font-size: 20px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.QuickGameScreenLabelColor};
    text-align: center;
`;

const Subheader = styled(StyledText)`
    font-size: 30px;
    margin-top: 24px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.QuickGameScreenSubheaderColor};
    text-align: center;
`;

const SelectAllButton = styled.TouchableOpacity<{ selected: boolean }>`
    background-color: ${({ theme, selected }) =>
            selected
                    ? theme.QuickGameScreenSelectAllButtonSelectedBg
                    : theme.QuickGameScreenSelectAllButtonUnselectedBg};
    padding: 12px 24px;
    border-width: 2px;
    border-color: ${({ theme, selected }) =>
            selected
                    ? theme.QuickGameScreenSelectAllButtonSelectedBorder
                    : theme.QuickGameScreenSelectAllButtonUnselectedBorder};
    align-self: center;
    margin-bottom: 12px;
    shadow-color: ${({ theme }) => theme.QuickGameScreenSelectAllButtonShadow};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
    min-width: 0;
    width: 40%;
`;

const RoundButtonRow = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-bottom: 16px;
`;

const RoundButton = styled.TouchableOpacity<{ selected: boolean }>`
    background: ${({ theme, selected }) => selected ? theme.SetupButtonQuickGameBackground : theme.SetupButtonBackground};
    border-width: 2px;
    border-color: ${({ theme }) => theme.SetupButtonBorder};
    padding: 10px 18px;
    margin: 0 8px;
    border-radius: 8px;
    opacity: ${({ selected }) => selected ? 1 : 0.7};
`;

const RoundButtonText = styled(StyledText)<{ selected: boolean }>`
    color: ${({ theme, selected }) => selected ? theme.SetupButtonText : theme.SetupButtonText};
    font-size: 18px;
    font-weight: ${({ selected }) => selected ? 'bold' : 'normal'};
`;

const SelectAllText = styled(StyledText)<{ selected: boolean }>`
    color: ${({ theme, selected }) =>
            selected
                    ? theme.QuickGameScreenSelectAllTextSelected
                    : theme.QuickGameScreenSelectAllTextUnselected};
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    width: 100%;
`;

type QuickGameParamList = {
    SubmitPlayerNames: {
        players: number;
        teams: number;
        words: number;
        rounds: number;
        selectedCategories: string[];
        customWords: string[];
    };
};

type QuickGameScreenNavigationProp = StackNavigationProp<QuickGameParamList, 'SubmitPlayerNames'>;

const QuickGameScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<QuickGameScreenNavigationProp>();
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const isValid = selected.size > 0;
    const [loading, setLoading] = useState(true);

    const {players, teams, words, rounds, customGame} = route.params as {
        players: number;
        teams: number;
        words: number;
        rounds: number;
        customGame: boolean;
    };


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
                <Label>Loading categories...</Label>
            </Centered>
        );
    }

    return (
        <ScreenContainer
            headerText="Quick Game Setup"
            headerLines={2}
            showPrimaryButton
            primaryButtonDisabled={!isValid}
            primaryButtonText="Next: players"
            onPrimaryButtonPress={handleSubmit}
        >
            <GameOverview players={players} teams={teams} words={words} rounds={rounds}/>
            <Subheader>{categories.length} available Categories:</Subheader>
            <SelectAllButton
                onPress={handleSelectAll}
                selected={selected.size === categories.length}
            >
                <SelectAllText selected={selected.size === categories.length}>
                    {selected.size === categories.length ? 'Deselect All' : 'Select All'}
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