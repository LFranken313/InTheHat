import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

//region Styled components
const Button = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.primaryButtonBlue};
    border-color: ${({ theme }) => theme.primaryButtonBorder};
    border-width: 2px;
    padding: 18px 0;
    align-items: center;
    margin-left: 16px;
    margin-right: 16px;
    margin-bottom: 12px;

    /* iOS shadow */
    shadow-color: ${({ theme }) => theme.black};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;

    /* Android shadow */
    elevation: 6;
`;

const ButtonText = styled(StyledText)`
    color: ${({ theme }) => theme.primaryButtonBorder};
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    width: 100%;
`;

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