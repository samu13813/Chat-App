import React from "react";
import { View, Text, StyleSheet } from 'react-native';

export default function Chat(props) {

    //The name / color introduced by the User in the Start window is sent to the Chat window and the title is updated to match user name
    let { name, color } = props.route.params;
    props.navigation.setOptions({ title: name });

    return (
            // User background preference is updated to match selection
            <View style={[{ backgroundColor: color}, styles.container]}>
                <Text style={styles.text}>Welcome to the Chat!</Text>
            </View>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        color: 'white',
        fontSize: 16,
    },
});
