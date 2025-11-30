import React from 'react';
import styled from 'styled-components/native';
import StyledText from './StyledText';

//region Styled components

const Card = styled.TouchableOpacity<{ selected: boolean }>(({ theme, selected }) => ({
    flex: 1,
    margin: 8,
    paddingVertical: 18,
    paddingHorizontal: 0,
    backgroundColor: selected ? theme.CategoryCardBorder : theme.CategoryCardBackground,
    borderWidth: 2,
    borderColor: selected ? theme.CategoryCardBackground : theme.CategoryCardBorder,
    alignItems: 'center',
    shadowColor: theme.MainScreenButtonShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    minWidth: 0,
}));

const CategoryText = styled(StyledText)<{ selected: boolean }>(({ theme, selected }) => ({
    fontSize: 18,
    color: selected ? theme.CategoryCardBackground : theme.CategoryCardText,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
}));

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