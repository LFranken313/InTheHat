import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import BigHeader from './BigHeader';
import PrimaryButton from './PrimaryButton';

const Outer = styled(SafeAreaView)`
    background-color : ${({theme}) => theme.ScreenContainerBackground};
    flex: 1;
`;

const Container = styled.View`
    flex: 1;
    flex-direction: column;
`;

const Content = styled.View`
    flex: 1;
    width: 92%;
    align-self: center;
    margin-bottom: 12px;
`;

type ScreenContainerProps = {
    headerText?: string | null;
    headerLines?: number;
    children: ReactNode;
    showPrimaryButton?: boolean;
    primaryButtonText?: string;
    onPrimaryButtonPress?: () => void;
    primaryButtonDisabled?: boolean;
};

const ScreenContainer = ({
                             headerText = null,
                             headerLines = 1,
                             children,
                             showPrimaryButton = false,
                             primaryButtonText,
                             onPrimaryButtonPress,
                             primaryButtonDisabled = false,
                         }: ScreenContainerProps) => {
    const insets = useSafeAreaInsets();

    return (
        <Outer edges={['bottom']}>
            <Container>
                {headerText && <BigHeader numberOfLines={headerLines}>{headerText}</BigHeader>}
                <Content>
                    {children}
                </Content>
                {showPrimaryButton && primaryButtonText && (
                    <PrimaryButton
                        onPress={onPrimaryButtonPress}
                        disabled={primaryButtonDisabled}
                    >
                        {primaryButtonText}
                    </PrimaryButton>
                )}
            </Container>
        </Outer>
    );
};

export default ScreenContainer;