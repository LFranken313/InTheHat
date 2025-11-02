import React from 'react';
import { Text, TextProps } from 'react-native';

export default function StyledRegular(props: TextProps) {
    return <Text {...props} style={[props.style, { fontFamily: 'pixel-bold' }]} />;
}

