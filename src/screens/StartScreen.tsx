import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {LinearGradient} from 'expo-linear-gradient';
import {GameStateService} from '../logic/GameStateService';
import {useNavigation} from '@react-navigation/native';
import StyledBold from '../components/StyledBold';
import StyledText from '../components/StyledText';
import {useWindowDimensions, Image, TouchableOpacity} from 'react-native';

const Background = styled(LinearGradient).attrs({
    colors: ['#f5e9da', '#e9dbc7'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
})`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Content = styled.View`
    flex: 1;
    width: 100%;
`;

const BannerContainer = styled.View`
    align-items: center;
    margin-top: 8%;
`;

const ImageContainer = styled.View`
    justify-content: flex-start;
    align-items: center;
`;

const ButtonContainer = styled.View`
    width: 100%;
    align-items: center;
    margin-top: auto;
`;

const StartScreen = () => {
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const navigation = useNavigation();
    const {width, height} = useWindowDimensions();

    const bannerFontSize = Math.max(32, width * 0.2);
    const buttonFontSize = Math.max(16, width * 0.05);
    const buttonWidth = Math.min(width * 0.8, 400);
    const imageSize = Math.min(width * 0.5, height * 0.3);

    useEffect(() => {
        const checkSavedGame = async () => {
            const service = new GameStateService();
            const game = await service.loadGameState();
            setHasSavedGame(!!game);
        };
        checkSavedGame();
    }, []);

    const buttonShadow = {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    };

    return (
        <Background>
            <Content>
                <BannerContainer>
                    <StyledBold
                        style={{
                            fontSize: bannerFontSize,
                            color: '#77dd77',
                            letterSpacing: 2,
                            textAlign: 'center',
                            textShadowColor: '#2e7d32',
                            textShadowOffset: {width: 2, height: 2},
                            textShadowRadius: 4,
                        }}
                    >
                        {`In the\nhat!`}
                    </StyledBold>
                </BannerContainer>
                <ImageContainer>
                    <Image
                        source={require('../../assets/images/tophat.png')}
                        resizeMode="contain"
                        style={{
                            width: imageSize,
                            height: imageSize,
                            marginTop: 12,
                        }}
                    />
                </ImageContainer>
                <ButtonContainer style={{paddingBottom: height * 0.10}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Setup' as never)}
                        style={[
                            {
                                width: buttonWidth,
                                backgroundColor: '#f7c873',
                                paddingVertical: height * 0.022,
                                borderColor: '#fff',
                                borderWidth: 2,
                                marginTop: height * 0.02,
                                alignItems: 'center',
                            },
                            buttonShadow,
                        ]}
                    >
                        <StyledText
                            style={{
                                fontSize: buttonFontSize * 1.2,
                                color: '#7c4a03',
                                fontWeight: '600',
                                letterSpacing: 1,
                                textAlign: 'center',
                            }}
                        >
                            Start game
                        </StyledText>
                    </TouchableOpacity>
                    {hasSavedGame && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PlayerTurnScreen' as never)}
                            style={[
                                {
                                    width: buttonWidth,
                                    backgroundColor: '#f7c873',
                                    paddingVertical: height * 0.022,
                                    borderColor: '#fff',
                                    borderWidth: 2,
                                    marginTop: height * 0.02,
                                    alignItems: 'center',
                                },
                                buttonShadow,
                            ]}
                        >
                            <StyledText
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{
                                    fontSize: buttonFontSize,
                                    color: '#7c4a03',
                                    fontWeight: '600',
                                    letterSpacing: 1,
                                    textAlign: 'center',
                                }}
                            >
                                Load last game
                            </StyledText>
                        </TouchableOpacity>
                    )}
                </ButtonContainer>
            </Content>
        </Background>
    );
};

export default StartScreen;