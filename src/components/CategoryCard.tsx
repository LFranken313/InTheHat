import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

//region Styled components

const Card = styled.TouchableOpacity<{ selected: boolean }>`
    flex: 1;
    margin: 8px;
    padding: 18px 0;
    background-color: ${({ theme, selected }) => selected ? theme.CategoryCardBorder : theme.CategoryCardBackground};
    border-width: 2px;
    border-color: ${({ theme, selected }) => selected ? theme.CategoryCardBackground : theme.CategoryCardBorder};
    align-items: center;
    shadow-color: ${({ theme }) => theme.black};
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 4;
    min-width: 0;
`;

const CategoryText = styled(StyledText)<{ selected: boolean }>`
    font-size: 18px;
    color: ${({ theme, selected }) => selected ? theme.CategoryCardBackground : theme.CategoryCardText};
    font-weight: 600;
    text-align: center;
    width: 100%;
`;

//endregion

type CategoryCardProps = {
    selected: boolean;
    onPress: () => void;
    children: string;
};

export default function CategoryCard({ selected, onPress, children }: CategoryCardProps) {
    return (
        <Card selected={selected} onPress={onPress} activeOpacity={0.8}>
            <CategoryText
                selected={selected}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.1}
                style={{ maxWidth: '90%', textAlign: 'center' }}
            >
                {children}
            </CategoryText>
        </Card>
    );
}