import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

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
    color: #7c4a03;
    width: 120px;
    text-align: right;
    margin-right: 12px;
`;

const GridInput = styled.TextInput`
    height: 48px;
    width: 80px;
    padding: 8px 12px;
    background: #fff;
    font-size: 20px;
    text-align: center;
    border-width: 2px;
    border-color: #f7c873;
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;


interface SetupGridProps {
    players: number;
    teams: number;
    words: number;
    rounds: number;
    handleInput: (setter: (n: number) => void) => (text: string) => void;
    setPlayers: (n: number) => void;
    setTeams: (n: number) => void;
    setWords: (n: number) => void;
    setRounds: (n: number) => void;
}

export default function SetupGrid({
    players,
    teams,
    words,
    rounds,
    handleInput,
    setPlayers,
    setTeams,
    setWords,
    setRounds,
}: SetupGridProps) {
    return (
        <Grid>
            <GridCell>
                <GridLabel>Players</GridLabel>
                <GridInput
                    keyboardType="numeric"
                    value={String(players)}
                    onChangeText={handleInput(setPlayers)}
                    placeholder="0"
                    onFocus={() => setPlayers('')}
                    maxLength={2}
                />
            </GridCell>
            <GridCell>
                <GridLabel>Teams</GridLabel>
                <GridInput
                    keyboardType="numeric"
                    value={String(teams)}
                    onChangeText={handleInput(setTeams)}
                    placeholder="0"
                    onFocus={() => setTeams('')}
                    maxLength={2}
                />
            </GridCell>
            <GridCell>
                <GridLabel>Words</GridLabel>
                <GridInput
                    keyboardType="numeric"
                    value={String(words)}
                    onChangeText={handleInput(setWords)}
                    maxLength={2}
                />
            </GridCell>
            <GridCell>
                <GridLabel>Rounds</GridLabel>
                <GridInput
                    keyboardType="numeric"
                    value={String(rounds)}
                    onChangeText={handleInput(setRounds)}
                    placeholder="3"
                    maxLength={2}
                />
            </GridCell>
        </Grid>
    );
}