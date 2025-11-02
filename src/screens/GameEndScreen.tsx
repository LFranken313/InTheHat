import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import { ScrollView } from 'react-native';
import {GameStateService} from '../logic/GameStateService';
import {WordService} from '../logic/WordService';
import {GameService} from "../logic/GameService";
import {Game} from '../models/Game';
import winningMessage from '../assets/WinningMessage.json'

const primaryBlue = '#6fb8e6';
const gold = '#FFD700';
const silver = '#C0C0C0';
const bronze = '#CD7F32';

const TeamRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 24px;
    width: 100%;
`;

const TeamName = styled(StyledText)<{ fontSize: number; color?: string }>`
    color: ${({ color }) => color || '#7c4a03'};
    font-size: ${({fontSize}) => fontSize}px;
    flex: 1;
    flex-basis: 0;
    flex-shrink: 1;
    min-width: 0;
    margin-right: 12px;
`;

const TeamScore = styled(StyledText)<{ fontSize: number }>`
    color: #e67c73;
    font-size: ${({fontSize}) => fontSize}px;
    flex: none;
    min-width: 0;
    text-align: right;
`;

const SubBanner = styled(StyledText)<{ color?: string }>`
    font-size: 36px;
    text-align: center;
    margin-top: 10%;
    color: ${({ color }) => color || '#2e7d32'};
`;

const TeamsScroll = styled(ScrollView)`
    max-height: 400px;
    width: 100%;
    border-width: 2px;
    border-color: #f7c873;
    background: #fffbe6;
    padding-vertical: 8px;
    margin-top: 5%;
`;


const shadowStyle = {
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
};

const whiteShadowStyle = {
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
};

const gameStateService = new GameStateService();
const wordService = new WordService();
const gameService = new GameService(gameStateService, wordService);

const GameEndScreen = () => {
    const navigation = useNavigation<any>();
    const [teams, setTeams] = useState<{ name: string; score: number }[]>([]);
    const [game, setGame] = useState<Game>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const loadGame = async () => {
            const game = await gameService.continueGame();
            setTeams(game.teams.map((t: any) => ({name: t.name, score: t.score})));
            setGame(game);
            // Fix: use the first array inside winningMessages
            const messages = winningMessage.winningMessages[0];
            const idx = Math.floor(Math.random() * messages.length);
            setMessage(messages[idx]);
        };
        loadGame();
    }, []);

    if (!game) return null;

    const totalPossiblePoints = game.numberOfRoundsToPlay * game.words.length;
    const teamsWithPercent = teams.map((team) => ({
        ...team,
        percent: totalPossiblePoints > 0 ? (team.score / totalPossiblePoints) : 0,
    }));

    const winner = teamsWithPercent.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev, teamsWithPercent[0]
    );

    const minFont = 24;
    const maxFont = 60;


    const handleSubmit = async () => {
        await gameStateService.clearGameState();
        navigation.navigate('Start');
    };

    return (
        <ScreenContainer
            headerText="Game has ended!"
            showPrimaryButton
            primaryButtonText="Back to Start"
            onPrimaryButtonPress={handleSubmit}
        >
            <SubBanner color={primaryBlue} style={shadowStyle}>
                {message ? message + '\n' : ''}
                {winner.name}
            </SubBanner>
            <TeamsScroll>
                {teamsWithPercent
                    .sort((a, b) => b.score - a.score)
                    .map((team, idx) => {
                        const fontSize = minFont + (maxFont - minFont) * team.percent;
                        let color;
                        let style;
                        if (idx === 0) {
                            color = gold;
                            style = shadowStyle;
                        } else if (idx === 1) {
                            color = silver;
                            style = shadowStyle;
                        } else if (idx === 2) {
                            color = bronze;
                            style = shadowStyle;
                        } else {
                            style = whiteShadowStyle;
                        }
                        return (
                            <TeamRow key={team.name}>
                                <TeamName
                                    fontSize={fontSize}
                                    color={color}
                                    style={style}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {team.name}
                                </TeamName>
                                <TeamScore fontSize={fontSize} numberOfLines={1} ellipsizeMode="tail">
                                    {team.score}
                                </TeamScore>
                            </TeamRow>
                        );
                    })}
            </TeamsScroll>
        </ScreenContainer>
    );

};

export default GameEndScreen;