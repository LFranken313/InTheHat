import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useFonts} from 'expo-font';
import {FontProvider} from "./src/components/FontContext";
import {ActivityIndicator, View} from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import * as ScreenOrientation from 'expo-screen-orientation';

import StartScreen from './src/screens/StartScreen';
import SetupScreen from './src/screens/SetupScreen';
import QuickGameScreen from './src/screens/QuickGameScreen';
import SubmitPlayerNamesScreen from './src/screens/SubmitPlayerNamesScreen'
import GameScreen from './src/screens/GameScreen';
import PlayerTurnScreen from "./src/screens/PlayerTurnScreen";
import RoundEndScreen from "./src/screens/RoundEndScreen";
import GameEndScreen from "./src/screens/GameEndScreen";
import SubmitWordsScreen from "./src/screens/SubmitWordsScreen";
import TeamOverviewScreen from "./src/screens/TeamOverviewScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import {darkTheme, girlyTheme, mainTheme} from "./src/theme";

const THEME_KEY = 'user_theme';
const FONT_KEY = 'user_font';
const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }, []);

    const [themeMode, setThemeMode] = useState<'normal' | 'dark' | 'girly'>('normal');
    const [font, setFont] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const savedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (savedTheme) setThemeMode(savedTheme as 'normal' | 'dark' | 'girly');
            const savedFont = await AsyncStorage.getItem(FONT_KEY);
            setFont(savedFont || 'pixel');
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(FONT_KEY, font);
    }, [font]);

    useEffect(() => {
        AsyncStorage.setItem(THEME_KEY, themeMode);

    }, [themeMode]);

    const getTheme = () => {
        if (themeMode === 'dark') return darkTheme;
        if (themeMode === 'girly') return girlyTheme;
        return mainTheme;
    };

    const [fontsLoaded] = useFonts({
        'pixel-bold': require('./assets/fonts/PixelifySans-Bold.ttf'),
        'pixel-regular': require('./assets/fonts/PixelifySans-Regular.ttf'),
        'caveat-bold': require('./assets/fonts/Caveat-Bold.ttf'),
        'caveat-regular': require('./assets/fonts/Caveat-Regular.ttf'),
        'rubik-bold': require('./assets/fonts/Rubik-Bold.ttf'),
        'rubik-regular': require('./assets/fonts/Rubik-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#7c4a03"/>
            </View>
        );
    }

    return (
        <ThemeProvider theme={getTheme()}>
            <FontProvider font={font} setFont={setFont}>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Start">
                        <Stack.Screen name="Start" component={StartScreen}/>
                        <Stack.Screen name="Setup" component={SetupScreen}/>
                        <Stack.Screen name="QuickGameScreen" component={QuickGameScreen}/>
                        <Stack.Screen name="SubmitPlayerNamesScreen" component={SubmitPlayerNamesScreen}/>
                        <Stack.Screen name="GameScreen" component={GameScreen}/>
                        <Stack.Screen name="PlayerTurnScreen" component={PlayerTurnScreen}/>
                        <Stack.Screen name="RoundEndScreen" component={RoundEndScreen}/>
                        <Stack.Screen name="GameEndScreen" component={GameEndScreen}/>
                        <Stack.Screen name="SubmitWordsScreen" component={SubmitWordsScreen}/>
                        <Stack.Screen name="TeamOverviewScreen" component={TeamOverviewScreen}/>
                        <Stack.Screen
                            name="SettingsScreen"
                            children={props => (
                                <SettingsScreen
                                    {...props}
                                    themeMode={themeMode}
                                    setThemeMode={setThemeMode}
                                />
                            )}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </FontProvider>
        </ThemeProvider>
    );
}