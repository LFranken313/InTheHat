import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import StyledText from './StyledText';
import { translations } from "../translations";
import {useLanguage} from "../logic/LanguageContext";

//region Styled components
const TopBar = styled.View(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '15%',
    backgroundColor: theme.TopBarBackground,
}));

const ExitButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.TopBarExitButtonBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 3,
    borderWidth: 2,
    borderColor: theme.TopBarButtonBorder,
    alignItems: 'center',
}));

const UndoButton = styled.TouchableOpacity<{ disabled?: boolean }>(({ theme, disabled }) => ({
    backgroundColor: theme.TopBarUndoButtonBackground,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    elevation: 3,
    borderWidth: 2,
    borderColor: theme.TopBarButtonBorder,
    opacity: disabled ? 0.5 : 1,
    alignItems: 'center',
}));

const Timer = styled(StyledText)(({ theme }) => ({
    fontSize: 28,
    color: theme.TopBarTimerColor,
    fontWeight: 'bold',
    textAlign: 'center',
}));

const ExitButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.TopBarButtonTextColor,
    fontSize: 18,
}));

const FlexItem = styled.View(() => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}));
//endregion

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
    const { language } = useLanguage();
    const localizedText = translations[language].gameTopBar;

    return (
        <TopBar>
            <FlexItem>
                <ExitButton onPress={onExit} style={shadow}>
                    <ExitButtonText>{localizedText.exitButton}</ExitButtonText>
                </ExitButton>
            </FlexItem>
            <FlexItem>
                <Timer>{timer}s</Timer>
            </FlexItem>
            <FlexItem>
                <UndoButton onPress={onUndo} disabled={undoDisabled} style={shadow}>
                    <StyledText style={{color: '#fff', fontSize: 18}}>{localizedText.undoButton}</StyledText>
                </UndoButton>
            </FlexItem>
        </TopBar>
    );
};
export default GameTopBar;