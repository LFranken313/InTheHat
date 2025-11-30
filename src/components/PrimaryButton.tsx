import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

//region Styled components
export const Button = styled.TouchableOpacity(({ theme }) => ({
    backgroundColor: theme.primaryButtonBlue,
    borderColor: theme.primaryButtonBorder,
    borderWidth: 2,
    paddingVertical: 18,
    paddingHorizontal: 0,
    alignItems: "center",
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 12,

    // iOS shadow
    shadowColor: theme.MainScreenButtonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android shadow
    elevation: 6,
}));

export const ButtonText = styled(StyledText)(({ theme }) => ({
    color: theme.primaryButtonBorder,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
}));

//endregion


type PrimaryButtonProps = {
    onPress: () => void;
    children: ReactNode;
    disabled?: boolean;
    style?: object;
};

const PrimaryButton = ({ onPress, children, disabled, style }: PrimaryButtonProps) => (
    <Button onPress={onPress} disabled={disabled} style={[style, { opacity: disabled ? 0.5 : 1 }]}>
        <ButtonText>{children}</ButtonText>
    </Button>
);

export default PrimaryButton;