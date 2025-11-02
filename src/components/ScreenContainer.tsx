// src/components/ScreenContainer.tsx
import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BigHeader from './BigHeader';
import PrimaryButton from './PrimaryButton';

const Outer = styled(SafeAreaView)`
    background-color: #f5e9da;
    flex: 1;
`;

const Content = styled.View`
    flex: 1;
    width: 92%;
    align-self: center;
`;

type ScreenContainerProps = {
    headerText?: string | null;
    headerLines?: number;
    children: React.ReactNode;
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
            {headerText && <BigHeader numberOfLines={headerLines}>{headerText}</BigHeader>}
            <Content>
                {children}
            </Content>
            {showPrimaryButton && primaryButtonText && (
                <PrimaryButton
                    onPress={onPrimaryButtonPress}
                    disabled={primaryButtonDisabled}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: insets.bottom + 24,
                        marginHorizontal: 16,
                    }}
                >
                    {primaryButtonText}
                </PrimaryButton>
            )}
        </Outer>
    );
};

export default ScreenContainer;