import React from 'react';
import styled from 'styled-components/native';
import StyledBold from './StyledBold';

//region Styled components
export const SectionContainer = styled.View(() => ({
    width: "100%",
    padding: 16,
    marginBottom: 24,
}));

export const SectionHeader = styled(StyledBold)(({ theme }) => ({
    fontSize: 20,
    marginBottom: 12,
    textAlign: "left",
    color: theme.SetupModalText,
}));

export const Underline = styled.View(({ theme }) => ({
    height: 2,
    width: "40%",
    backgroundColor: theme.SetupModalBorder,
    marginVertical: 6,
    marginLeft: 0,
    alignSelf: "flex-start",
}));

//endregion

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