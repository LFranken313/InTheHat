import React from 'react';
import {FlatList, FlatListProps} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View(() => ({
    flexShrink: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
}));

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