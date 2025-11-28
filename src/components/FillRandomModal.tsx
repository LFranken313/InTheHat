import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';

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

const ConfirmButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.ModalButtonBackground};
    padding: 12px 32px;
    border-width: 2px;
    width: 75%;
    border-color: ${({theme}) => theme.ModalButtonBorder};
    /* iOS shadow */
    shadow-color: ${({ theme }) => theme.black};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;

    /* Android shadow */
    elevation: 6;
`;

const ConfirmButtonText = styled(StyledText)`
    color: ${({theme}) => theme.ModalButtonTextColor};
    font-size: 18px;
    letter-spacing: 1px;
    font-weight: 600;
    text-align: center;
    width: 100%;`;

const CancelButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.ModalCancelButtonBackground};
    padding: 12px 32px;
    border-width: 2px;
    border-color: ${({theme}) => theme.ModalButtonBorder};
    margin-top: 16px;
    width: 75%;
    /* iOS shadow */
    shadow-color: ${({ theme }) => theme.black};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;

    /* Android shadow */
    elevation: 6;
`;

const CancelButtonText = styled(StyledText)`
    color: ${({theme}) => theme.ModalCancelButtonTextColor};
    font-size: 18px;
    text-align: center;
    font-weight: 600;
    width: 100%;
`;

type Props = {
    visible: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    missing: number;
};

const FillRandomModal: React.FC<Props> = ({
    visible,
    onRequestClose,
    onConfirm,
    missing,
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
                    Fill the remaining {missing} words with random ones?
                </ModalText>
                <ConfirmButton onPress={onConfirm}>
                    <ConfirmButtonText>Yes, fill random</ConfirmButtonText>
                </ConfirmButton>
                <CancelButton onPress={onRequestClose}>
                    <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>
            </ModalCard>
        </ModalContainer>
    </Modal>
);

export default FillRandomModal;