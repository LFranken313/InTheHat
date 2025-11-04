import React from 'react';
import {Modal, View, TouchableOpacity, useWindowDimensions} from 'react-native';
import StyledText from './StyledText';
import GameRulesContent from './GameRulesContent';
import styled from 'styled-components/native';

type GameRulesModalProps = {
    visible: boolean;
    onClose: () => void;
};

const ModalContainer = styled.View<{ width: number; maxHeight: number }>`
    background-color: #fffbe6;
    border-radius: 16px;
    border-width: 2px;
    border-color: #f7c873;
    width: ${props => props.width}px;
    max-height: ${props => props.maxHeight}px;
    position: relative;
    padding: 0;
`;

const CloseIcon = styled(StyledText)`
    color: #e67c73;
    font-size: 28px;
    text-shadow: 1px 1px 4px #00000055;
`;

export default function GameRulesModal({visible, onClose}: GameRulesModalProps) {
    const {width, height} = useWindowDimensions();
    const modalWidth = Math.min(width * 0.9, 500);
    const modalPadding = Math.max(width * 0.06, 24);
    const modalMaxHeight = height * 0.9;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
                <ModalContainer width={modalWidth} padding={modalPadding} maxHeight={modalMaxHeight}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            zIndex: 10,
                            backgroundColor: 'transparent',
                            padding: 8,
                        }}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    >
                        <CloseIcon>×</CloseIcon>
                    </TouchableOpacity>
                    <GameRulesContent onClose={onClose}/>
                </ModalContainer>
            </View>
        </Modal>
    );
}