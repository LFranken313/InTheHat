import React, {ReactNode} from 'react';
import {Dimensions, View} from 'react-native';
import StyledBold from './StyledBold';
import styled from 'styled-components/native';


//region styled components
const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.9;
const BASE_FONT_SIZE = Math.min(SCREEN_WIDTH * 0.10, 82);
const HEADER_MARGIN_TOP = Math.max(Dimensions.get('window').height * 0.02, 40);

const HeaderContainer = styled.View`
    width: ${CONTAINER_WIDTH}px;
    align-self: center;
    margin-top: ${HEADER_MARGIN_TOP}px;
`;

const StyledBigHeader = styled(StyledBold)`
    color: ${({ theme }) => theme.BannerColor};
    font-size: ${BASE_FONT_SIZE}px;
    text-align: center;
    text-shadow-color: ${({ theme }) => theme.BannerColorShadow};
    text-shadow-offset: 2px 2px;
    text-shadow-radius: 4px;
    width: 100%;
`;

const Underline = styled.View`
    position: absolute;
    left: 25%;
    width: 50%;
    height: 4px;
    background-color: ${({ theme }) => theme.BannerColor};
    bottom: 0;
    border-radius: 2px;
`;

//endregion

type BigHeaderProps = {
    children: ReactNode;
    numberOfLines?: number;
};

const BigHeader = ({children, numberOfLines = 1}: BigHeaderProps) => (
    <HeaderContainer>
        <View style={{position: 'relative', alignItems: 'center', width: '100%'}}>
            <StyledBigHeader
                numberOfLines={numberOfLines}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.3}
            >
                {children}
            </StyledBigHeader>
            <Underline/>
        </View>
    </HeaderContainer>
);

export default BigHeader;