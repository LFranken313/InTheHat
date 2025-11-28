import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';

const ModalBackground = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
`;

const ModalCard = styled.View`
    background-color: ${({theme}) => theme.ModalCardBackground};
    border-radius: 16px;
    border-width: 2px;
    border-color: ${({theme}) => theme.ModalCardBorder};
    width: 90%;
    max-height: 90%;
    position: relative;
    overflow: hidden;
    flex-direction: column;
    justify-content: space-between;
`;

const ContentContainer = styled.View`
    padding: 4%;
    max-height: 90%;
`;

const ButtonRow = styled.View`
    padding: 3%;
    justify-content: center;
    width: 50%;
    align-self: center;
`;

const ActionButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.ModalButtonBackground};
    padding: 12px 32px;
    border-width: 2px;
    border-color: ${({theme}) => theme.ModalButtonBorder};
    margin-top: 0;
`;

const ActionButtonText = styled(StyledText)`
    color: ${({theme}) => theme.ModalButtonTextColor};
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    width: 100%;
`;

const SecondaryButton = styled(ActionButton)`
    background-color: ${({theme}) => theme.ModalCancelButtonBackground};
`;

const SecondaryButtonText = styled(ActionButtonText)`
    color: ${({theme}) => theme.ModalCancelButtonTextColor};
`;

type ModalButton = {
    label: string;
    onPress: () => void;
};

type ModalComponentProps = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    primaryButton?: ModalButton | null;
    secondaryButton?: ModalButton | null;
};

export default function ModalComponent({
   visible,
   onClose,
   children,
   primaryButton,
   secondaryButton,
}: ModalComponentProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <ModalBackground>
                <ModalCard>
                    <ContentContainer>
                        {children}
                    </ContentContainer>
                    <ButtonRow>
                        {secondaryButton && (
                            <SecondaryButton onPress={secondaryButton.onPress}>
                                <SecondaryButtonText>{secondaryButton.label}</SecondaryButtonText>
                            </SecondaryButton>
                        )}
                        {primaryButton && (
                            <ActionButton onPress={primaryButton.onPress}>
                                <ActionButtonText>{primaryButton.label}</ActionButtonText>
                            </ActionButton>
                        )}
                    </ButtonRow>
                </ModalCard>
            </ModalBackground>
        </Modal>
    );
}