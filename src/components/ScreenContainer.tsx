import React, {ReactNode} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions, View} from 'react-native';
import BigHeader from './BigHeader';
import PrimaryButton from './PrimaryButton';

const Outer = styled(SafeAreaView)`
    background-color: #f5e9da;
    flex: 1;
`;

const Content = styled.View<{ height: number }>`
    width: 92%;
    align-self: center;
    height: ${({height}) => height}px;
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

const HEADER_HEIGHT = 80;
const BUTTON_HEIGHT = 64;

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
    const windowHeight = Dimensions.get('window').height;
    const contentHeight =
        windowHeight -
        (headerText ? HEADER_HEIGHT : 0) -
        (showPrimaryButton ? BUTTON_HEIGHT + insets.bottom + 24 : 0);

    return (
        <Outer edges={['bottom']}>
            {headerText && <BigHeader numberOfLines={headerLines}>{headerText}</BigHeader>}
            <Content height={contentHeight}>
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