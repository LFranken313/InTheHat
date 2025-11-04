import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useFonts} from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

import StartScreen from './src/screens/StartScreen';
import SetupScreen from './src/screens/SetupScreen';
import QuickGameScreen from './src/screens/QuickGameScreen';
import SubmitPlayerNames from './src/screens/SubmitPlayerNames'
import GameScreen from './src/screens/GameScreen';
import PlayerTurnScreen from "./src/screens/PlayerTurnScreen";
import RoundEndScreen from "./src/screens/RoundEndScreen";
import GameEndScreen from "./src/screens/GameEndScreen";
import SubmitWordsScreen from "./src/screens/SubmitWordsScreen";
import TeamOverviewScreen from "./src/screens/TeamOverviewScreen";


const Stack = createStackNavigator();
export default function App() {
    const [fontsLoaded] = useFonts({
        'pixel-bold': require('./assets/fonts/PixelifySans-Bold.ttf'),
        'pixel-regular': require('./assets/fonts/PixelifySans-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#7c4a03" />
            </View>
        );
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
                <Stack.Screen name="TeamOverviewScreen" component={TeamOverviewScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}