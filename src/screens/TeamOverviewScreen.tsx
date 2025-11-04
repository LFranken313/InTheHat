import React, {useEffect, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;
const maxScrollHeight = Math.min(windowHeight * 0.70);

const TeamCard = styled.View`
    background: #fffbe6;
    border-radius: 12px;
    padding: 20px 16px;
    margin-bottom: 18px;
    border-width: 2px;
    border-color: #f7c873;
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const TeamName = styled(StyledText)`
    font-size: 24px;
    color: #7c4a03;
    margin-bottom: 10px;
    text-align: center;
`;

const PlayersRow = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const PlayerName = styled(StyledText)`
    font-size: 18px;
    color: #b88a2a;
    margin: 4px;
    text-align: center;
    min-width: 90px;
    max-width: 120px;
`;

const TeamsScroll = styled(ScrollView)`
    max-height: ${maxScrollHeight}px;
    width: 100%;
    margin-top: 32px;
`;

export default function TeamOverviewScreen() {
    const [teams, setTeams] = useState<{ name: string; players: { name: string }[] }[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        const loadTeams = async () => {
            const game = await new GameStateService().loadGameState();
            if (game?.teams) setTeams(game.teams);
        };
        loadTeams();
    }, []);

    return (
        <ScreenContainer
            headerText="Your Teams"
            showPrimaryButton
            primaryButtonText="Next: Start Game"
            onPrimaryButtonPress={() => navigation.navigate('PlayerTurnScreen')}
        >
            <TeamsScroll>
                {teams.map((team, idx) => (
                    <TeamCard key={team.name + idx}>
                        <TeamName>{team.name}</TeamName>
                        <PlayersRow>
                            {team.players.map((player, i) => (
                                <PlayerName key={player.name + i}>{player.name}</PlayerName>
                            ))}
                        </PlayersRow>
                    </TeamCard>
                ))}
            </TeamsScroll>
        </ScreenContainer>
    );
}