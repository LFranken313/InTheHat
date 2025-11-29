import React from 'react';
import StyledText from './StyledText';
import styled from 'styled-components/native';
import {useLanguage} from "../logic/LanguageContext";
import {translations} from "../translations";

//region Styled components
const OverviewGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 8px;
`;

const OverviewItem = styled.View`
    width: 48%;
    margin: 1%;
    background-color: ${({ theme }) => theme.OverviewItemBackground};
    border-width: 2px;
    border-color: ${({ theme }) => theme.OverviewItemBorder};
    padding: 6px 0;
    align-items: center;
    shadow-color: ${({ theme }) => theme.OverviewShadow};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
`;

const OverviewLabel = styled(StyledText)`
    font-size: 20px;
    color: ${({ theme }) => theme.OverViewLabel};
    margin-bottom: 2px;
`;

const OverviewValue = styled(StyledText)`
    font-size: 18px;
    color: ${({ theme }) => theme.OverViewValue};
    font-weight: bold;
`;
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