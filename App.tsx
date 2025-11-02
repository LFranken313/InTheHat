import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';

import StartScreen from './src/screens/StartScreen';
import SetupScreen from './src/screens/SetupScreen';
import QuickGameScreen from './src/screens/QuickGameScreen';
import SubmitPlayerNames from './src/screens/SubmitPlayerNames'
import GameScreen from './src/screens/GameScreen';
import PlayerTurnScreen from "./src/screens/PlayerTurnScreen";
import RoundEndScreen from "./src/screens/RoundEndScreen";
import GameEndScreen from "./src/screens/GameEndScreen";
import SubmitWordsScreen from "./src/screens/SubmitWordsScreen";

const Stack = createStackNavigator();
export default function App() {
    const [fontsLoaded] = useFonts({
        'pixel-bold': require('./assets/fonts/PixelifySans-Bold.ttf'),
        'pixel-regular': require('./assets/fonts/PixelifySans-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return <AppLoading/>;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Start">
                <Stack.Screen name="Start" component={StartScreen}/>
                <Stack.Screen name="Setup" component={SetupScreen}/>
                <Stack.Screen name="QuickGameScreen" component={QuickGameScreen} />
                <Stack.Screen name="SubmitPlayerNames" component={SubmitPlayerNames} />
                <Stack.Screen name="GameScreen" component={GameScreen} />
                <Stack.Screen name="PlayerTurnScreen" component={PlayerTurnScreen} />
                <Stack.Screen name="RoundEndScreen" component={RoundEndScreen} />
                <Stack.Screen name="GameEndScreen" component={GameEndScreen} />
                <Stack.Screen name="SubmitWordsScreen" component={SubmitWordsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}