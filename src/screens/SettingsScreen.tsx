import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import {Picker} from '@react-native-picker/picker';
import {useFont} from '../components/FontContext';
import ScreenContainer from '../components/ScreenContainer';
import StyledText from "../components/StyledText";
import {View} from 'react-native';
import SettingsSection from "../components/SettingsSection";
import ModalComponent from "../components/ModalComponent";
import GameRulesContent from "../components/GameRulesContent";
import {Language, translations} from "../translations";
import {useLanguage} from "../logic/LanguageContext";
import {useNavigation} from "@react-navigation/native";
import type {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/types";


//region Styled components
const Container = styled.View(() => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
}));

const StyledScrollView = styled.ScrollView.attrs(() => ({
    contentContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
}))(({ theme }) => ({
    borderWidth: 2,
    borderColor: theme.SetupModalBorder,
    borderRadius: 12,
    backgroundColor: theme.SetupModalBackground,
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
}));

const AddCategoriesButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.MainScreenButtonLabel,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
}));

const StyledPicker = styled(Picker)(({ theme }) => ({
    width: '100%',
    color: theme.SetupModalText,
    backgroundColor: theme.CategoryCardBorder,
}));

const PickerText = styled(StyledText)(({ theme }) => ({
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    marginBottom: 8,
    color: theme.SetupModalText,
}));

const PickerWrapper = styled.View(({ theme }) => ({
    width: '100%',
    borderWidth: 2,
    borderColor: theme.primaryButtonBorder,
    backgroundColor: theme.SetupModalBackground,
    marginBottom: 16,
}));

const InfoButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.SetupModalText,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    width: '100%',
}));

const AddCategoriesButton = styled.TouchableOpacity(({ theme }) => ({
    width: '100%',
    minHeight: 56,
    backgroundColor: theme.MainScreenButtonBackGround,
    borderColor: theme.MainScreenButtonBorder,
    borderWidth: 2,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
}));

const InfoButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.SetupInfoButtonBackground,
    paddingVertical: 8,
    paddingHorizontal: 18,
    minHeight: 56,
    borderWidth: 2,
    borderColor: theme.SetupInfoButtonBorder,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
}));

const ThemeRow = styled.View(() => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
}));

const themeQuadColors = {
    normal: ['#7c4a03', '#6fb8e6', '#f7c873', '#f5e9da'],
    dark: ['#EEE', '#222E50', '#222', '#2C2C2C'],
    girly: ['#FF69B4', '#f898c9', '#FFD1DC', '#FFE4E1'],
};

const ThemeButton = styled.TouchableOpacity<{ selected: boolean }>(() => ({
    width: 64,
    height: 64,
    borderRadius: 8,
    marginHorizontal: 8,
    position: 'relative',
}));
//endregion

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

export default function SettingsScreen({themeMode, setThemeMode}: SettingsScreenProps) {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CustomWordScreen'>>();
    const {font, setFont} = useFont();
    const [showInfo, setShowInfo] = useState(false);
    const { language, setLanguage } = useLanguage();
    const rulesModalText = translations[language].rulesModal;
    const localizedText = translations[language].settingsScreen;

    const handleThemeChange = async (mode: 'normal' | 'dark' | 'girly') => {
        setThemeMode(mode);
        await AsyncStorage.setItem(THEME_KEY, mode);
    };

    const handleFontChange = async (fontValue: string) => {
        setFont(fontValue);
        await AsyncStorage.setItem(FONT_KEY, fontValue);
    };

    const handleLanguageChange = async (lang: Language) => {
        setLanguage(lang);
        await AsyncStorage.setItem('user_language', lang);
    };

    const customWordScreen = () => {
        console.log("customWordScreen");
        navigation.navigate('CustomWordScreen');
    }

    return (
        <ScreenContainer
            showPrimaryButton={true}
            primaryButtonText={localizedText.saveButton}
            onPrimaryButtonPress={() => navigation.goBack()}
            headerText={localizedText.title}>
            <InfoButton onPress={() => setShowInfo(true)}>
                <InfoButtonText numberOfLines={1} ellipsizeMode="tail">
                    {localizedText.helpButton}
                </InfoButtonText>
            </InfoButton>
            <ModalComponent
                visible={showInfo}
                onClose={() => setShowInfo(false)}
                secondaryButton={{
                    label: rulesModalText.modalButton,
                    onPress: () => setShowInfo(false)
                }}
            >
                <GameRulesContent onClose={() => setShowInfo(false)} />
            </ModalComponent>
            <StyledScrollView
                contentContainerStyle={{flexGrow: 1, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                <Container>
                    <SettingsSection header={localizedText.themeTitle}>
                        <PickerText>{localizedText.themeOptions}</PickerText>
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
                    <SettingsSection header={localizedText.fontTitle}>
                        <PickerText>{localizedText.fontOptions}</PickerText>
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
                    <SettingsSection header={localizedText.languageTitle}>
                        <PickerText>{localizedText.languageOptions}</PickerText>
                        <PickerWrapper>
                            <StyledPicker
                                selectedValue={language}
                                onValueChange={(value: Language) => handleLanguageChange(value)}
                            >
                                <Picker.Item label="Nederlands" value="nl" />
                                <Picker.Item label="English" value="en" />
                                <Picker.Item label="ไทย" value="th" />
                            </StyledPicker>
                        </PickerWrapper>
                    </SettingsSection>
                </Container>
            </StyledScrollView>
            <AddCategoriesButton onPress={() => customWordScreen()}>
                <AddCategoriesButtonText>Add Categories (Coming soon)</AddCategoriesButtonText>
            </AddCategoriesButton>
        </ScreenContainer>
    );
}