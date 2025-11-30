import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';
import {TextInput} from 'react-native';
import Slider from '@react-native-community/slider';
import {useLanguage} from "../logic/LanguageContext";
import {translations} from "../translations";

//region Styled components
export const Grid = styled.View(() => ({
    marginBottom: 32,
    alignItems: 'center',
}));

export const GridCell = styled.View(() => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
}));

export const GridLabel = styled(StyledText)(({ theme }) => ({
    fontSize: 32,
    color: theme.SetupGridLabelColor,
    width: '35%',
    textAlign: 'right',
    marginRight: 12,
}));

export const ValueInput = styled(TextInput)(({ theme }) => ({
    fontSize: 20,
    color: theme.SetupGridInputColor,
    width: 70,
    textAlign: 'left',
    marginLeft: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
}));

//endregion

interface SetupGridProps {
    players: number;
    teams: number;
    words: number;
    rounds: number;
    inputsDisabled?: boolean;
    setPlayers: (n: number) => void;
    setTeams: (n: number) => void;
    setWords: (n: number) => void;
    setRounds: (n: number) => void;
}

function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
}


export default function SetupGrid({
  players,
  teams,
  words,
  rounds,
  setPlayers,
  setTeams,
  setWords,
  setRounds,
  inputsDisabled
}: SetupGridProps) {
    const { language } = useLanguage();
    const localizedText = translations[language].setupScreen;
    return (
        <Grid>
            <GridCell>
                <GridLabel>{localizedText.playersLabel}</GridLabel>
                <Slider
                    minimumValue={0}
                    maximumValue={20}
                    step={1}
                    value={players}
                    onValueChange={n => setPlayers(clamp(n, 0, 20))}
                    style={{width: 120}}
                />
                <ValueInput
                    value={String(players)}
                    keyboardType="numeric"
                    onChangeText={text => {
                        const num = clamp(parseInt(text.replace(/[^0-9]/g, ''), 10) || 0, 0, 20);
                        setPlayers(num);
                    }}
                />
            </GridCell>
            <GridCell>
                <GridLabel>{localizedText.teamsLabel}</GridLabel>
                <Slider
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={teams}
                    onValueChange={n => setTeams(clamp(n, 0, 20))}
                    style={{width: 120}}
                />
                <ValueInput
                    value={String(teams)}
                    keyboardType="numeric"
                    onChangeText={text => {
                        const num = clamp(parseInt(text.replace(/[^0-9]/g, ''), 10) || 0, 0, 20);
                        setTeams(num);
                    }}
                />
            </GridCell>
            <GridCell>
                <GridLabel>{localizedText.wordsLabel}</GridLabel>
                <Slider
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={words}
                    onValueChange={n => setWords(clamp(n, 0, 20))}
                    disabled={!!inputsDisabled}
                    style={{width: 120}}
                />
                <ValueInput
                    value={String(words)}
                    keyboardType="numeric"
                    editable={!inputsDisabled}
                    onChangeText={text => {
                        const num = clamp(parseInt(text.replace(/[^0-9]/g, ''), 10) || 0, 0, 20);
                        setWords(num);
                    }}
                />
            </GridCell>
            <GridCell>
                <GridLabel>{localizedText.roundsLabel}</GridLabel>
                <Slider
                    minimumValue={0}
                    maximumValue={5}
                    step={1}
                    value={rounds}
                    onValueChange={n => setRounds(clamp(n, 0, 20))}
                    disabled={!!inputsDisabled}
                    style={{width: 120}}
                />
                <ValueInput
                    value={String(rounds)}
                    keyboardType="numeric"
                    editable={!inputsDisabled}
                    onChangeText={text => {
                        const num = clamp(parseInt(text.replace(/[^0-9]/g, ''), 10) || 0, 0, 20);
                        setRounds(num);
                    }}
                />
            </GridCell>
        </Grid>
    );
}