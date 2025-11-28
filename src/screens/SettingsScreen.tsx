import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';
import {useFont} from '../components/FontContext';
import ScreenContainer from '../components/ScreenContainer';
import GameRulesModal from "../components/GameRulesModal";
import StyledText from "../components/StyledText";
import {View, ScrollView} from 'react-native';
import SettingsSection from "../components/SettingsSection";

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const StyledScrollView = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
}))`
    border-width: 2px;
    border-color: ${({theme}) => theme.SetupModalBorder};
    border-radius: 12px;
    background-color: ${({theme}) => theme.SetupModalBackground};
`;

const AddCategoriesButtonText = styled(StyledText)`
    color: ${({theme}) => theme.MainScreenButtonLabel};
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const StyledPicker = styled(Picker)`
    width: 100%;
    color: ${({theme}) => theme.SetupModalText};
    background-color: ${({theme}) => theme.CategoryCardBorder};
`;

const PickerText = styled(StyledText)`
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    width: 100%;
    margin-bottom: 8px;
    color: ${({theme}) => theme.SetupModalText};
`;

const PickerWrapper = styled.View`
    width: 100%;
    border-width: 2px;
    border-color: ${({theme}) => theme.primaryButtonBorder};
    background-color: ${({theme}) => theme.SetupModalBackground};
    margin-bottom: 16px;
`;

const InfoButtonText = styled(StyledText)`
    color: ${({theme}) => theme.SetupModalText};
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const AddCategoriesButton = styled.TouchableOpacity`
    width: 100%;
    min-height: 56px;
    background-color: ${({theme}) => theme.MainScreenButtonBackGround};
    border-color: ${({theme}) => theme.MainScreenButtonBorder};
    border-width: 2px;
    margin-top: 16px;
    margin-bottom: 16px;
    align-items: center;
    justify-content: center;
    shadow-color: ${({theme}) => theme.MainScreenButtonShadow};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 4;
`;

const InfoButton = styled.TouchableOpacity`
    background: ${({theme}) => theme.SetupInfoButtonBackground};
    padding: 8px 18px;
    min-height: 56px;
    border-width: 2px;
    border-color: ${({theme}) => theme.SetupInfoButtonBorder};
    shadow-color: ${({theme}) => theme.SetupButtonShadowColor};
    margin-top: 16px;
    margin-bottom: 16px;
    align-items: center;
    justify-content: center;
    align-self: center;
    width: 70%;
`;

const ThemeRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
`;

const themeQuadColors = {
    normal: ['#7c4a03', '#6fb8e6', '#f7c873', '#f5e9da'],
    dark: ['#EEE', '#222E50', '#222', '#2C2C2C'],
    girly: ['#FF69B4', '#f898c9', '#FFD1DC', '#FFE4E1'],
};

const ThemeButton = styled.TouchableOpacity`
    width: 64px;
    height: 64px;
    border-radius: 8px;
    margin-horizontal: 8px;
    position: relative;
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
    {label: 'Pixel', value: 'pixel', fontFamily: 'PixelFont'},
    {label: 'Handwriting', value: 'handwriting', fontFamily: 'HandwritingFont'},
    {label: 'Rubik', value: 'rubik', fontFamily: 'Rubik'},
];

function QuadSolid({colors}: { colors: string[] }) {
    return (
        <>
            <View style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                backgroundColor: colors[0],
                top: 0,
                left: 0,
                borderTopLeftRadius: 12,
            }}/>
            <View style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                backgroundColor: colors[1],
                top: 0,
                right: 0,
                borderTopRightRadius: 12,
            }}/>
            <View style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                backgroundColor: colors[2],
                bottom: 0,
                left: 0,
                borderBottomLeftRadius: 12,
            }}/>
            <View style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                backgroundColor: colors[3],
                bottom: 0,
                right: 0,
                borderBottomRightRadius: 12,
            }}/>
        </>
    );
}

export default function SettingsScreen({themeMode, setThemeMode, navigation}: SettingsScreenProps) {
    const {font, setFont} = useFont();
    const [showInfo, setShowInfo] = useState(false);

    const handleThemeChange = async (mode: 'normal' | 'dark' | 'girly') => {
        setThemeMode(mode);
        await AsyncStorage.setItem(THEME_KEY, mode);
    };

    const handleFontChange = async (fontValue: string) => {
        setFont(fontValue);
        await AsyncStorage.setItem(FONT_KEY, fontValue);
    };

    return (
        <ScreenContainer
            showPrimaryButton={true}
            primaryButtonText={"Save"}
            onPrimaryButtonPress={() => navigation.goBack()}
            headerText="SETTINGS">
            <InfoButton onPress={() => setShowInfo(true)}>
                <InfoButtonText numberOfLines={1} ellipsizeMode="tail">
                    Need some help?
                </InfoButtonText>
            </InfoButton>
            <GameRulesModal visible={showInfo} onClose={() => setShowInfo(false)}/>
            <StyledScrollView
                contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <Container>
                    <SettingsSection header="Theme">
                        <PickerText>Select Theme:</PickerText>
                        <ThemeRow>
                            {themeOptions.map(opt => (
                                <ThemeButton
                                    key={opt.value}
                                    selected={themeMode === opt.value}
                                    onPress={() => handleThemeChange(opt.value as 'normal' | 'dark' | 'girly')}
                                >
                                    <QuadSolid colors={themeQuadColors[opt.value as 'normal' | 'dark' | 'girly']} />
                                </ThemeButton>
                            ))}
                        </ThemeRow>
                    </SettingsSection>
                    <SettingsSection header="Font">
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
                    </SettingsSection>
                    <SettingsSection header="Language">
                        <PickerText>Select Language:</PickerText>
                        <PickerWrapper>
                            <StyledPicker
                                selectedValue="comingSoon"
                                onValueChange={() => {}}
                            >
                                <Picker.Item label="Coming soon" value="comingSoon" />
                                <Picker.Item label="Nederlands" value="dutch" />
                                <Picker.Item label="English" value="english" />
                                <Picker.Item label="ไทย" value="thai" />
                            </StyledPicker>
                        </PickerWrapper>
                    </SettingsSection>
                </Container>
            </StyledScrollView>
            <AddCategoriesButton onPress={() => navigation.navigate('AddCategoriesScreen')}>
                <AddCategoriesButtonText>Add Categories (Coming soon)</AddCategoriesButtonText>
            </AddCategoriesButton>
        </ScreenContainer>
    );
}