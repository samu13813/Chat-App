import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';


export default function Chat(props) {

    let { name, color } = props.route.params;
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        //Title is updated to match user name
        props.navigation.setOptions({ title: name });

        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: `${name} has entered the chat.`,
                createdAt: new Date(),
                system: true,
            },
        ])

    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    // Customize sender bubble color
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    return (
            // User background preference is updated to match selection
            <View style={[{ backgroundColor: color}, styles.container]}>
                <GiftedChat
                    renderBubble={renderBubble.bind()}
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {/* Avoid keyboard to hide chat on android devices */}
                { Platform.OS === 'androiod' ? <KeyboardAvoidingView behavior='height' /> : null}
            </View>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
