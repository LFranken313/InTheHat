import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

const Button = styled.TouchableOpacity`
    background-color: #6fb8e6;
    border-color: #fff;
    border-width: 2px;
    padding: 18px 0;
    margin: 32px 16px 32px 16px;
    align-items: center;

    /* iOS shadow */
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;

    /* Android shadow */
    elevation: 6;
`;

const ButtonText = styled(StyledText)`
    color: #fff;
    font-size: 22px;
`;

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