import React, { ReactNode } from 'react';
    import { Dimensions, View } from 'react-native';
    import StyledBold from './StyledBold';
    import styled from 'styled-components/native';

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
    const BASE_FONT_SIZE = Math.min(SCREEN_WIDTH * 0.10, 82);
    const HEADER_MARGIN_TOP = Math.max(SCREEN_HEIGHT * 0.02, 32);

    const HeaderContainer = styled.View`
        width: ${CONTAINER_WIDTH}px;
        align-self: center;
        margin-top: ${HEADER_MARGIN_TOP}px;
    `;

    const StyledBigHeader = styled(StyledBold)`
        color: #77dd77;
        font-size: ${BASE_FONT_SIZE}px;
        text-align: center;
        text-shadow-color: #2e7d32;
        text-shadow-offset: 2px 2px;
        text-shadow-radius: 4px;
    `;

    const Underline = styled.View`
        position: absolute;
        left: 25%;
        width: 50%;
        height: 4px;
        background-color: #77dd77;
        bottom: 0;
        border-radius: 2px;
    `;

    type BigHeaderProps = {
        children: ReactNode;
        numberOfLines?: number;
    };

    const BigHeader = ({ children, numberOfLines = 1 }: BigHeaderProps) => (
        <HeaderContainer>
            <View style={{ position: 'relative', alignItems: 'center' }}>
                <StyledBigHeader
                    numberOfLines={numberOfLines}
                    ellipsizeMode="tail"
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                >
                    {children}
                </StyledBigHeader>
                <Underline />
            </View>
        </HeaderContainer>
    );

    export default BigHeader;