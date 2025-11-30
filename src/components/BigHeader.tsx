import React, {ReactNode} from 'react';
import {View} from 'react-native';
import StyledBold from './StyledBold';
import styled from 'styled-components/native';


//region styled components
const HeaderContainer = styled.View(() => ({
    width: '90%',
    alignSelf: 'center',
    marginTop: '2%',
    minMarginTop: 40,
}));

const StyledBigHeader = styled(StyledBold)`
    color: ${({ theme }) => theme.BannerColor};
    font-size: 82px;
    text-align: center;
    text-shadow-color: ${({ theme }) => theme.BannerColorShadow};
    text-shadow-offset: 2px 2px;
    text-shadow-radius: 4px;
    width: 100%;
`;

const Underline = styled.View(({ theme }) => ({
    position: 'absolute',
    left: '25%',
    width: '50%',
    height: 4,
    backgroundColor: theme.BannerColor,
    bottom: 0,
    borderRadius: 2,
}));

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