import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';
import {useFont} from '../components/FontContext';
import ScreenContainer from '../components/ScreenContainer';
import StyledBold from "../components/StyledBold";

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const StyledPicker = styled(Picker)`
    width: 100%;
    color: ${({theme}) => theme.SetupModalText};
    background-color: ${({theme}) => theme.SetupModalBackground};
`;

const PickerText = styled(StyledBold)`
    font-size: 18px;
    margin-bottom: 8px;
    color: ${({theme}) => theme.SetupModalText};
    font-weight: 600;
`;

const PickerWrapper = styled.View`
  width: 100%;
  border-width: 2px;
  border-color: ${({theme}) => theme.SetupModalBorder};
  background-color: ${({theme}) => theme.SetupModalBackground};
  margin-bottom: 16px;
`;

type SettingsScreenProps = {
    themeMode: 'normal' | 'dark' | 'girly';
    setThemeMode: (mode: 'normal' | 'dark' | 'girly') => void;
    navigation: any;
    route: any;
};

const THEME_KEY = 'user_theme';
const FONT_KEY = 'user_font';

const themeOptions = [
    {label: 'Classic', value: 'normal'},
    {label: 'Dark', value: 'dark'},
    {label: 'Pink', value: 'girly'},
];

export const fontOptions = [
    { label: 'Pixel', value: 'pixel', fontFamily: 'PixelFont' },
    { label: 'Handwriting', value: 'handwriting', fontFamily: 'HandwritingFont' },
    { label: 'Rubik', value: 'rubik', fontFamily: 'Rubik' },
];

export default function SettingsScreen({ themeMode, setThemeMode, navigation }: SettingsScreenProps) {
    const { font, setFont } = useFont();

    const handleThemeChange = async (mode: 'normal' | 'dark' | 'girly') => {
        setThemeMode(mode);
        await AsyncStorage.setItem(THEME_KEY, mode);
    };

    const handleFontChange = async (fontValue: string) => {
        setFont(fontValue);
        await AsyncStorage.setItem(FONT_KEY, fontValue);
        const x = await AsyncStorage.getItem(FONT_KEY);
    };

    return (
        <ScreenContainer
            showPrimaryButton={true}
            primaryButtonText={"Save"}
            onPrimaryButtonPress={() => navigation.goBack()}
            headerText="SETTINGS">
            <Container>
                <PickerText>Select Theme:</PickerText>
                <PickerWrapper>
                    <StyledPicker
                        selectedValue={themeMode}
                        onValueChange={handleThemeChange}
                    >
                        {themeOptions.map(opt => (
                            <Picker.Item key={opt.value} label={opt.label} value={opt.value}/>
                        ))}
                    </StyledPicker>
                </PickerWrapper>
                <PickerText>Select Font:</PickerText>
                <PickerWrapper>
                    <StyledPicker
                        selectedValue={font}
                        onValueChange={handleFontChange}
                    >
                        {fontOptions.map(opt => (
                            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                        ))}
                    </StyledPicker>
                </PickerWrapper>
            </Container>
        </ScreenContainer>
    );
}
