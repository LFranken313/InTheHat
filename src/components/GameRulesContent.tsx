import React from 'react';
import styled from 'styled-components/native';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import Rules from '../assets/Rules.json';
import StyledText from './StyledText';
import BoldText from './StyledBold';

const Container = styled.View<{ padding: number }>`
    padding: ${props => props.padding}px;
    align-self: center;
    width: 100%;
    max-width: 500px;
    position: relative;
`;

const TitleText = styled(BoldText)<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    color: ${({ theme }) => theme.GameRulesTextColor};
    margin-bottom: 16px;
    text-align: center;
`;

const SectionTitle = styled(BoldText)<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    color: ${({ theme }) => theme.GameRulesTextColor};
    margin-bottom: 4px;
`;

const SectionContent = styled(StyledText)<{ fontSize: number }>`
    font-size: ${props => props.fontSize}px;
    color: ${({ theme }) => theme.GameRulesTextColor};
    margin-bottom: 20px;
`;

type GameRulesModalContentProps = {
    onClose: () => void;
};

export default function GameRulesContent({onClose}: GameRulesModalContentProps) {
    const {width} = useWindowDimensions();

    const padding = Math.max(width * 0.06, 16);
    const titleFontSize = Math.max(width * 0.06, 24);
    const sectionTitleFontSize = Math.max(width * 0.05, 20);
    const sectionContentFontSize = Math.max(width * 0.04, 16);

    const ruleSections = [
        {title: Rules.round1Title, content: Rules.round1Content},
        {title: Rules.round2Title, content: Rules.round2Content},
        {title: Rules.round3Title, content: Rules.round3Content},
        {title: Rules.challengeTitle, content: Rules.challengeContent},
    ];

    return (
        <Container padding={padding}>
            <ScrollView>
                <View style={{ padding: padding }}>
                <TitleText fontSize={titleFontSize}>Game Rules</TitleText>
                <SectionContent fontSize={sectionContentFontSize}>{Rules.rules}</SectionContent>
                <SectionContent fontSize={sectionContentFontSize}>{Rules.introduction}</SectionContent>
                {ruleSections.map((section, idx) => (
                    <React.Fragment key={idx}>
                        <SectionTitle fontSize={sectionTitleFontSize}>{section.title}</SectionTitle>
                        <SectionContent fontSize={sectionContentFontSize}>{section.content}</SectionContent>
                    </React.Fragment>
                ))}
                </View>
            </ScrollView>
        </Container>
    );
}