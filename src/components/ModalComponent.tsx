import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import StyledText from './StyledText';

//region Styled components
export const ModalBackground = styled.View({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
});

export const ModalCard = styled.View(({ theme }) => ({
    backgroundColor: theme.ModalCardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.ModalCardBorder,
    width: "90%",
    maxHeight: "90%",
    position: "relative",
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "space-between",
}));

export const ContentContainer = styled.View({
    padding: "4%",
    maxHeight: "90%",
});

export const ButtonRow = styled.View({
    padding: "3%",
    justifyContent: "center",
    width: "50%",
    alignSelf: "center",
});

export const ActionButton = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.ModalButtonBackground,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: theme.ModalButtonBorder,
    marginTop: 0,
}));

export const ActionButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.ModalButtonTextColor,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
    width: "100%",
}));

export const SecondaryButton = styled(ActionButton)(({ theme }) => ({
    backgroundColor: theme.ModalCancelButtonBackground,
}));

export const SecondaryButtonText = styled(ActionButtonText)(({ theme }) => ({
    color: theme.ModalCancelButtonTextColor,
}));

//endregion

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