import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from "react-native";
import { Prime_Color } from "../Colour/Colour";

const LoadingButton = ({
    title = "Submit",
    loading = false,
    loadingText = "Processing...",
    onPress,
    disabled = false,
    style,
    textStyle,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.button,
                { opacity: loading || disabled ? 0.6 : 1 },
                style
            ]}
            disabled={loading || disabled}
            onPress={onPress}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.text, textStyle]}>
                        {" "}{loadingText}
                    </Text>
                </View>
            ) : (
                <Text style={[styles.text, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default LoadingButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: Prime_Color,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
});
