import React from 'react';
import {Text, TextProps} from 'react-native';
import {useFont} from './FontContext';

export default function StyledText(props: TextProps) {
  const { variants } = useFont();
  return <Text {...props} style={[props.style, { fontFamily: variants.regular }]} />;
}