import React from 'react';
import StyledText from './StyledText';
import styled from 'styled-components/native';
import {useLanguage} from "../logic/LanguageContext";
import {translations} from "../translations";

//region Styled components
const OverviewGrid = styled.View(() => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
}));

const OverviewItem = styled.View(({ theme }) => ({
    width: '48%',
    margin: '1%',
    backgroundColor: theme.OverviewItemBackground,
    borderWidth: 2,
    borderColor: theme.OverviewItemBorder,
    paddingVertical: 6,
    paddingHorizontal: 0,
    alignItems: 'center',
    shadowColor: theme.OverviewShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const OverviewLabel = styled(StyledText)(({ theme }) => ({
    fontSize: 20,
    color: theme.OverViewLabel,
    marginBottom: 2,
}));

const OverviewValue = styled(StyledText)(({ theme }) => ({
    fontSize: 18,
    color: theme.OverViewValue,
    fontWeight: 'bold',
}));
//endregion

type GameOverviewProps = {
    players: number;
    teams: number;
    words: number;
    rounds: number;
};

const GameOverview: React.FC<GameOverviewProps> = ({ players, teams, words, rounds }) => {
    const { language } = useLanguage();
    const localizedText = translations[language].gameOverview;

    return (
        <OverviewGrid>
            <OverviewItem>
                <OverviewLabel>{localizedText.playerLabel}</OverviewLabel>
                <OverviewValue>{players}</OverviewValue>
            </OverviewItem>
            <OverviewItem>
                <OverviewLabel>{localizedText.wordLabel}</OverviewLabel>
                <OverviewValue>{words}</OverviewValue>
            </OverviewItem>
            <OverviewItem>
                <OverviewLabel>{localizedText.teamLabel}</OverviewLabel>
                <OverviewValue>{teams}</OverviewValue>
            </OverviewItem>
            <OverviewItem>
                <OverviewLabel>{localizedText.roundLabel}</OverviewLabel>
                <OverviewValue>{rounds}</OverviewValue>
            </OverviewItem>
        </OverviewGrid>
    );
};


export default GameOverview;