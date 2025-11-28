import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';
import {useTheme} from 'styled-components/native';

const ModalContainer = styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
`;

const ModalCard = styled.View`
    background-color: ${({theme}) => theme.ModalCardBackground};
    border-radius: 16px;
    border-width: 2px;
    border-color: ${({theme}) => theme.ModalCardBorder};
    padding: 32px 24px;
    align-items: center;
    width: 80%;
`;

const ModalText = styled(StyledText)`
    font-size: 22px;
    color: ${({theme}) => theme.ModalTextColor};
    text-align: center;
    margin-bottom: 24px;
    font-weight: 600;
    width: 100%;
`;

const ExitButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.ModalButtonBackground};
    padding: 12px 32px;
    border-width: 2px;
    border-color: ${({theme}) => theme.ModalButtonBorder};
`;

const ExitButtonText = styled(StyledText)`
    color: ${({theme}) => theme.ModalButtonTextColor};
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const CancelButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.ModalCancelButtonBackground};
    padding: 12px 32px;
    border-width: 2px;
    border-color: ${({theme}) => theme.ModalButtonBorder};
    margin-top: 16px;
`;

const CancelButtonText = styled(StyledText)`
    color: ${({theme}) => theme.ModalCancelButtonTextColor};
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const buttonShadow = (theme: any) => ({
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
});

type Props = {
    visible: boolean;
    onRequestClose: () => void;
    onConfirmExit: () => void;
    buttonShadow: (theme: any) => object;
};

const GameExitModal: React.FC<Props> = ({
                                            visible,
                                            onRequestClose,
                                            onConfirmExit,
                                        }) => {
    const theme = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <ModalContainer>
                <ModalCard>
                    <ModalText>
                        Exit game?{'\n'}(game will be saved)
                    </ModalText>
                    <ExitButton onPress={onConfirmExit} style={buttonShadow(theme)}>
                        <ExitButtonText>Exit Game</ExitButtonText>
                    </ExitButton>
                    <CancelButton onPress={onRequestClose} style={buttonShadow(theme)}>
                        <CancelButtonText>Cancel</CancelButtonText>
                    </CancelButton>
                </ModalCard>
            </ModalContainer>
        </Modal>
    );
};

export default GameExitModal;
