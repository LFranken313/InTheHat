import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';
import {TextInput} from 'react-native';
import Slider from '@react-native-community/slider';
import textContent from '../textContent.json';
import {useLanguage} from "../logic/LanguageContext";

//region Styled components
const Grid = styled.View`
    margin-bottom: 32px;
    align-items: center;
`;

const GridCell = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
`;

const GridLabel = styled(StyledText)`
    font-size: 32px;
    color: ${({theme}) => theme.SetupGridLabelColor};
    width: 35%;
    text-align: right;
    margin-right: 12px;
`;

const ValueInput = styled(TextInput)`
    font-size: 20px;
    color: ${({theme}) => theme.SetupGridInputColor};
    width: 70px;
    text-align: left;
    margin-left: 12px;
    padding: 2px 6px;
`;
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
    const localizedText = textContent[language].setupScreen;
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