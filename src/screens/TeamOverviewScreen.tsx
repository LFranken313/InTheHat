import React, {useEffect, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {GameStateService} from '../logic/GameStateService';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;
const maxScrollHeight = Math.min(windowHeight * 0.70);

const TeamCard = styled.View`
    background: ${({ theme }) => theme.TeamCardBackground};
    border-radius: 12px;
    padding: 20px 16px;
    margin-bottom: 18px;
    border-width: 2px;
    border-color: ${({ theme }) => theme.TeamCardBorder};
    shadow-color: ${({ theme }) => theme.TeamCardShadow};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const TeamName = styled(StyledText)`
    font-size: 24px;
    color: ${({ theme }) => theme.TeamNameColor};
    margin-bottom: 10px;
    text-align: center;
`;

const PlayersRow = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

const PlayerName = styled(StyledText)`
    font-size: 18px;
    color: ${({ theme }) => theme.PlayerNameColor};
    margin: 0 4px 4px 4px;
    text-align: center;
    min-width: 70px;
    max-width: 100px;
`;

const TeamsScroll = styled(ScrollView)`
    max-height: ${maxScrollHeight}px;
    width: 100%;
    margin-top: 32px;
`;

type RootStackParamList = {
    TeamOverviewScreen: undefined;
    PlayerTurnScreen: undefined;
};

type TeamOverviewScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TeamOverviewScreen'
>;


export default function TeamOverviewScreen() {
    const [teams, setTeams] = useState<{ name: string; players: { name: string }[] }[]>([]);
    const navigation = useNavigation<TeamOverviewScreenNavigationProp>();
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