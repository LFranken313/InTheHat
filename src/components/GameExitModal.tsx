import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';

const ModalContainer = styled.View`
    flex: 1;
    background: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
`;

const ModalCard = styled.View`
    background: #fffbe6;
    border-radius: 16px;
    border-width: 2px;
    border-color: #f7c873;
    padding: 32px 24px;
    align-items: center;
    width: 80%;
`;

const ModalText = styled(StyledText)`
    font-size: 22px;
    color: #7c4a03;
    text-align: center;
    margin-bottom: 24px;
`;

const ModalButton = styled.TouchableOpacity`
    background: #e67c73;
    padding: 12px 32px;
    border-width: 2px;
    border-color: #fff;
`;

const ModalButtonText = styled(StyledText)`
    color: #fff;
    font-size: 18px;
`;

type Props = {
    visible: boolean;
    onRequestClose: () => void;
    onConfirmExit: () => void;
    buttonShadow: object;
};

const GameExitModal: React.FC<Props> = ({
    visible,
    onRequestClose,
    onConfirmExit,
    buttonShadow,
}) => (
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
                <ModalButton onPress={onConfirmExit} style={buttonShadow}>
                    <ModalButtonText>Exit Game</ModalButtonText>
                </ModalButton>
                <ModalButton
                    style={[{marginTop: 16, backgroundColor: '#6fb8e6'}, buttonShadow]}
                    onPress={onRequestClose}
                >
                    <ModalButtonText>Cancel</ModalButtonText>
                </ModalButton>
            </ModalCard>
        </ModalContainer>
    </Modal>
);

export default GameExitModal;