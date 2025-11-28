import React from 'react';
import styled from 'styled-components/native';
import StyledBold from './StyledBold';

const SectionContainer = styled.View`
    width: 100%;
    padding: 16px;
    margin-bottom: 24px;
`;

const SectionHeader = styled(StyledBold)`
    font-size: 20px;
    margin-bottom: 12px;
    text-align: left;
    color: ${({theme}) => theme.SetupModalText};
`;

const Underline = styled.View`
    height: 2px;
    width: 40%;
    background-color: ${({ theme }) => theme.SetupModalBorder};
    margin-vertical: 6px;
    margin-left: 0;
    align-self: flex-start;
`;

type SettingsSectionProps = {
    header: string;
    children: React.ReactNode;
};

export default function SettingsSection({header, children}: SettingsSectionProps) {
    return (
        <SectionContainer>
            <SectionHeader>{header}</SectionHeader>
            <Underline />
            {children}
        </SectionContainer>
    );
}