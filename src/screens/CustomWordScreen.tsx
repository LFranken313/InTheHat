import ScreenContainer from "../components/ScreenContainer";
import React, { useState } from "react";
import styled from "styled-components/native";
import StyledText from "../components/StyledText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//region Styled components

const ReadyText = styled(StyledText)(({ theme }) => ({
    fontSize: 22,
    color: theme.PlayerTurnReadyTextColor,
    marginBottom: 32,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
}));

const Label = styled(StyledText)(({ theme }) => ({
    fontSize: 20,
    color: theme.SubmitLabelColor,
    marginBottom: 8,
    textAlign: "center",
}));

const CategoryInput = styled.TextInput(({ theme }) => ({
    fontSize: 22,
    color: theme.PlayerTurnReadyTextColor,
    marginBottom: 32,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: theme.SubmitNameInputBorder,
    backgroundColor: theme.SubmitNameInputBackground,
    shadowColor: theme.SubmitNameInputShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const Row = styled.View({
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
});

const WordInput = styled.TextInput(({ theme }) => ({
    flex: 1,
    height: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.SubmitNameInputBackground,
    fontSize: 18,
    borderWidth: 2,
    borderColor: theme.SubmitNameInputBorder,
    marginRight: 8,
    textAlign: "center",
    shadowColor: theme.SubmitNameInputShadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
}));

const IconButton = styled(TouchableOpacity)({
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
});

//endregion

const CustomWordScreen = () => {
    const [category, setCategory] = useState("");
    const [words, setWords] = useState([""]);

    const addWordField = () => {
        setWords([...words, ""]);
    };

    const removeWordField = (index) => {
        const updated = words.filter((_, i) => i !== index);
        setWords(updated.length === 0 ? [""] : updated);
    };

    const updateWord = (text, index) => {
        const updated = [...words];
        updated[index] = text;
        setWords(updated);
    };

    const handleSubmit = async () => {
        if (!category.trim()) return;

        const formatted = words
            .filter((w) => w.trim().length > 0)
            .map((w) => ({ name: w.trim(), category }));

        const existing = await AsyncStorage.getItem("custom_words");
        const parsed = existing ? JSON.parse(existing) : [];

        await AsyncStorage.setItem(
            "custom_words",
            JSON.stringify([...parsed, ...formatted])
        );
    };

    return (
        <ScreenContainer
            headerText="Add custom words"
            showPrimaryButton
            primaryButtonText="Save: back to start"
            onPrimaryButtonPress={handleSubmit}
        >
            <ReadyText>
                You can create your own categories and save them for later usage.
            </ReadyText>

            <Label>Category</Label>
            <CategoryInput
                value={category}
                onChangeText={setCategory}
                placeholder="Add category"
            />

            <Label>Words</Label>
            {words.map((word, index) => {
                const isLast = index === words.length - 1;
                const isEmpty = word.trim().length === 0;

                return (
                    <Row key={index}>
                        <WordInput
                            value={word}
                            onChangeText={(t) => updateWord(t, index)}
                            placeholder="Add word"
                        />

                        {isLast && (
                            <IconButton
                                style={{ backgroundColor: "#6fb8e6" }}
                                onPress={addWordField}
                            >
                                <Ionicons name="add" size={28} color="white" />
                            </IconButton>
                        )}

                        {/* X button only on filled fields */}
                        {!isEmpty && (
                            <IconButton
                                style={{ backgroundColor: "#e67c73" }}
                                onPress={() => removeWordField(index)}
                            >
                                <Ionicons name="close" size={28} color="white" />
                            </IconButton>
                        )}
                    </Row>
                );
            })}
        </ScreenContainer>
    );
};

export default CustomWordScreen;

//TODO: this is a placeholder page