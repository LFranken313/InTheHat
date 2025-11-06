import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {useRoute} from '@react-navigation/native';
import styled from 'styled-components/native';
import {WordService} from '../logic/WordService';
import {useNavigation} from '@react-navigation/native';
import StyledText from '../components/StyledText';
import GameOverview from '../components/GameOverview';
import ScreenContainer from '../components/ScreenContainer';
import ListContainer from "../components/ListContainer";


const wordService = new WordService();

const Centered = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #f5e9da;
`;

const Label = styled(StyledText)`
    font-size: 20px;
    margin-bottom: 8px;
    color: #7c4a03;
    text-align: center;
`;

const Subheader = styled(StyledText)`
    font-size: 30px;
    margin-top: 24px;
    margin-bottom: 12px;
    color: #7c4a03;
    text-align: center;
`;

const CategoryCard = styled.TouchableOpacity<{ selected: boolean }>`
    flex: 1;
    margin: 8px;
    padding: 18px 0;
    background-color: ${props => (props.selected ? '#f7c873' : '#fff')};
    border-width: 2px;
    border-color: ${props => (props.selected ? '#fff' : '#f7c873')};
    align-items: center;
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
    min-width: 0;
`;

const SelectAllButton = styled.TouchableOpacity<{ selected: boolean }>`
    background-color: ${props => (props.selected ? '#f7c873' : '#fff')};
    padding: 12px 24px;
    border-width: 2px;
    border-color: ${props => (props.selected ? '#fff' : '#f7c873')};
    align-self: center;
    margin-bottom: 12px;
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
    min-width: 0;
`;

const SelectAllText = styled(StyledText)<{ selected: boolean }>`
    color: ${props => (props.selected ? '#fff' : '#7c4a03')};
    font-size: 18px;
    font-weight: 600;
`;


const CategoryText = styled(StyledText)<{ selected: boolean }>`
    font-size: 18px;
    color: ${props => (props.selected ? '#fff' : '#7c4a03')};
`;


const QuickGameScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const isValid = selected.size > 0;
    const [loading, setLoading] = useState(true);

    const {players, teams, words, rounds} = route.params as {
        players: number;
        teams: number;
        words: number;
        rounds: number;
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
        navigation.navigate('SubmitPlayerNames', {
            players,
            teams,
            words,
            rounds,
            selectedCategories,
            customWords: [],
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
            onPrimaryButtonPress={handleSubmit}>
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
            <ListContainer>
                <FlatList
                    data={categories}
                    keyExtractor={item => item}
                    numColumns={2}
                    contentContainerStyle={{paddingHorizontal: 8, alignItems: 'stretch'}}
                    renderItem={({item}) => (
                        <CategoryCard
                            selected={selected.has(item)}
                            onPress={() => toggleCategory(item)}
                            activeOpacity={0.8}
                        >
                            <CategoryText
                                selected={selected.has(item)}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                adjustsFontSizeToFit
                                minimumFontScale={0.1}
                                style={{maxWidth: '90%', textAlign: 'center'}}
                            >
                                {item}
                            </CategoryText>
                        </CategoryCard>
                    )}
                    style={{flexGrow: 0}}
                />
            </ListContainer>
        </ScreenContainer>
    );
};

export default QuickGameScreen;