import React from 'react';
    import styled from 'styled-components/native';
    import StyledText from './StyledText';

const TopBar = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 15%;
    background: #f5e9da;
`;

    const FlexItem = styled.View`
        flex: 1;
        align-items: center;
        justify-content: center;
    `;

    const ExitButton = styled.TouchableOpacity`
        background: #e67c73;
        padding: 8px 16px;
        elevation: 3;
        border-width: 2px;
        border-color: #fff;
        align-items: center;
    `;

    const UndoButton = styled.TouchableOpacity`
        background: #6fb8e6;
        padding: 8px 16px;
        align-self: center;
        elevation: 3;
        border-width: 2px;
        border-color: #fff;
        opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.5 : 1)};
        align-items: center;
    `;

    const Timer = styled(StyledText)`
        font-size: 28px;
        color: #e67c73;
        font-weight: bold;
        text-align: center;
    `;

    const ExitButtonText = styled(StyledText)`
        color: #fff;
        font-size: 18px;
    `;

    type Props = {
        timer: number;
        onExit: () => void;
        onUndo: () => void;
        undoDisabled: boolean;
        buttonShadow: object;
    };

    const GameTopBar: React.FC<Props> = ({ timer, onExit, onUndo, undoDisabled, buttonShadow }) => (
        <TopBar>
            <FlexItem>
                <ExitButton onPress={onExit} style={buttonShadow}>
                    <ExitButtonText>Exit</ExitButtonText>
                </ExitButton>
            </FlexItem>
            <FlexItem>
                <Timer>{timer}s</Timer>
            </FlexItem>
            <FlexItem>
                <UndoButton onPress={onUndo} disabled={undoDisabled} style={buttonShadow}>
                    <StyledText style={{ color: '#fff', fontSize: 18 }}>Undo</StyledText>
                </UndoButton>
            </FlexItem>
        </TopBar>
    );

    export default GameTopBar;