import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';
import { GameStateService } from '../src/logic/GameStateService';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Button = styled(TouchableOpacity)`
  background-color: #007aff;
  padding: 16px 32px;
  border-radius: 8px;
  margin: 12px 0;
`;

const ButtonText = styled(Text)`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export default function HomePage() {
  const [hasGame, setHasGame] = useState(false);

  useEffect(() => {
    const checkGame = async () => {
      const service = new GameStateService();
      const game = await service.loadGameState();
      setHasGame(!!game);
    };
    checkGame();
  }, []);

  const handleStartNewGame = () => {
    // Navigation or logic to start a new game
  };

  const handleContinueGame = () => {
    // Navigation or logic to continue the game
  };

  return (
    <Container>
      <Button onPress={handleStartNewGame}>
        <ButtonText>Start New Game</ButtonText>
      </Button>
      {hasGame && (
        <Button onPress={handleContinueGame}>
          <ButtonText>Continue Game</ButtonText>
        </Button>
      )}
    </Container>
  );
}