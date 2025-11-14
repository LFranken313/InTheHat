import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex-shrink: 1;
    width: 100%;
    align-self: center;
    justify-content: flex-start;
`;

type ListContainerProps<ItemT> = {
    flatListProps: FlatListProps<ItemT>;
};

export default function ListContainer<ItemT>({ flatListProps }: ListContainerProps<ItemT>) {
    return (
        <Container>
            <FlatList
                {...flatListProps}
            />
        </Container>
    );
}