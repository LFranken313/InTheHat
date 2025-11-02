import React from 'react';
import StyledText from './StyledText';
import styled from 'styled-components/native';

const Label = styled(StyledText)`
    font-size: 24px;
    margin-bottom: 8px;
    color: #7c4a03;
    text-align: center;
`;

type GameOverviewProps = {
    players: number;
    teams: number;
    words: number;
    rounds: number;
};

const GameOverview: React.FC<GameOverviewProps> = ({ players, teams, words, rounds }) => (
    <>
        <Label>Players: {players}</Label>
        <Label>Teams: {teams}</Label>
        <Label>Words: {words}</Label>
        <Label>Rounds: {rounds}</Label>
    </>
);

export default GameOverview;