import React from 'react';
import styled from 'styled-components/native';
import BoldText from './StyledBold';
import StyledText from './StyledText';
import {translations} from "../translations";
import {useLanguage} from '../logic/LanguageContext';

//region Styled components
const ScrollArea = styled.ScrollView``;

const ContentWrapper = styled.View`
    flex: 1;
`;

const TitleText = styled(BoldText)<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    color: ${({theme}) => theme.GameRulesTextColor};
    margin-bottom: 16px;
    text-align: center;
`;

const SectionTitle = styled(BoldText)<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    color: ${({theme}) => theme.GameRulesTextColor};
    margin-bottom: 4px;
`;

const SectionContent = styled(StyledText)<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    color: ${({theme}) => theme.GameRulesTextColor};
    margin-bottom: 20px;
`;

//endregion

type GameRulesModalContentProps = {
    onClose: () => void;
};

export default function GameRulesContent({onClose}: GameRulesModalContentProps) {
    const {language} = useLanguage();
    const localizedText = translations[language].rulesModal;

    const ruleSections = [
        {title: localizedText.round1Title, content: localizedText.round1Content},
        {title: localizedText.round2Title, content: localizedText.round2Content},
        {title: localizedText.round3Title, content: localizedText.round3Content},
        {title: localizedText.challengeTitle, content: localizedText.challengeContent},
    ];

    return (
        <ScrollArea>
            <ContentWrapper>
                <TitleText fontSize={28}>{localizedText.rules}</TitleText>
                <SectionContent fontSize={18}>{localizedText.introduction}</SectionContent>
                {ruleSections.map((section, idx) => (
                    <ContentWrapper key={idx}>
                        <SectionTitle fontSize={20}>{section.title}</SectionTitle>
                        <SectionContent fontSize={16}>{section.content}</SectionContent>
                    </ContentWrapper>
                ))}
            </ContentWrapper>
        </ScrollArea>
    );
}