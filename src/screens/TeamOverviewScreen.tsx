import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from '../components/StyledText';
import {GameStateService} from '../logic/GameStateService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from "../navigation/types";

//region Styled components
const TeamCard = styled.View(({ theme }) => ({
    backgroundColor: theme.TeamCardBackground,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: theme.TeamCardBorder,
    shadowColor: theme.TeamCardShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const TeamName = styled(StyledText)(({ theme }) => ({
    fontSize: 24,
    color: theme.TeamNameColor,
    marginBottom: 10,
    textAlign: 'center',
}));

const PlayersRow = styled.View(() => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
}));

const PlayerName = styled(StyledText)(({ theme }) => ({
    fontSize: 18,
    color: theme.PlayerNameColor,
    marginTop: 0,
    marginBottom: 4,
    marginHorizontal: 4,
    textAlign: 'center',
    minWidth: 70,
    maxWidth: 100,
}));

const TeamsScroll = styled(ScrollView)(() => ({
    maxHeight: '70%',
    width: '100%',
    marginTop: 32,
}));
//endregion

export default function TeamOverviewScreen() {
    const [teams, setTeams] = useState<{ name: string; players: { name: string }[] }[]>([]);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'PlayerTurnScreen'>>();
    const route = useRoute<RouteProp<RootStackParamList, 'TeamOverviewScreen'>>();
    const customGame = route.params;
    useEffect(() => {
        const loadTeams = async () => {
            const game = await new GameStateService().loadGameState();
            if (game?.teams) setTeams(game.teams);
        };
        loadTeams();
    }, []);

    const handleSubmit = () => {
        navigation.navigate('PlayerTurnScreen', customGame);
    }

    //region Html
    return (
        <ScreenContainer
            headerText="Your Teams"
            showPrimaryButton
            primaryButtonText="Next: Start Game"
            onPrimaryButtonPress={handleSubmit}
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
    //endregion
}