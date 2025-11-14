import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';
import { useTheme } from 'styled-components/native';


const TopBar = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 15%;
    background: ${({theme}) => theme.TopBarBackground};
`;

const ExitButton = styled.TouchableOpacity`
    background: ${({theme}) => theme.TopBarExitButtonBackground};
    padding: 8px 16px;
    elevation: 3;
    border-width: 2px;
    border-color: ${({theme}) => theme.TopBarButtonBorder};
    align-items: center;
`;

const UndoButton = styled.TouchableOpacity<{ disabled?: boolean }>`
    background: ${({theme}) => theme.TopBarUndoButtonBackground};
    padding: 8px 16px;
    align-self: center;
    elevation: 3;
    border-width: 2px;
    border-color: ${({theme}) => theme.TopBarButtonBorder};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    align-items: center;
`;

const Timer = styled(StyledText)`
    font-size: 28px;
    color: ${({theme}) => theme.TopBarTimerColor};
    font-weight: bold;
    text-align: center;
`;

const ExitButtonText = styled(StyledText)`
    color: ${({theme}) => theme.TopBarButtonTextColor};
    font-size: 18px;
`;

const FlexItem = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

type Props = {
    timer: number;
    onExit: () => void;
    onUndo: () => void;
    undoDisabled: boolean;
    buttonShadow: (theme: any) => object;
};

const GameTopBar: React.FC<Props> = ({timer, onExit, onUndo, undoDisabled, buttonShadow}) => {
    const theme = useTheme();
    const shadow = buttonShadow(theme);

    return (
        <TopBar>
            <FlexItem>
                <ExitButton onPress={onExit} style={shadow}>
                    <ExitButtonText>Exit</ExitButtonText>
                </ExitButton>
            </FlexItem>
            <FlexItem>
                <Timer>{timer}s</Timer>
            </FlexItem>
            <FlexItem>
                <UndoButton onPress={onUndo} disabled={undoDisabled} style={shadow}>
                    <StyledText style={{color: '#fff', fontSize: 18}}>Undo</StyledText>
                </UndoButton>
            </FlexItem>
        </TopBar>
    );
};
export default GameTopBar;