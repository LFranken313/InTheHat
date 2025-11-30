import React from 'react';
import {Text, TextProps} from 'react-native';
import {useFont} from './FontContext';

export default function StyledBold(props: TextProps) {
    const { variants } = useFont();
    return <Text {...props} style={[props.style, { fontFamily: variants.bold }]} />;
}