import React, { Component } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    //Title is updated to match user name
    let name = this.props.route.params.name;

    this.setState({
      messages: [
        {
          _id: 1,
          text: "Welcome " + name + "!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: "User " + name + "has entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }
  //this function adds new chat messages to the state
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // Customize sender bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#191919",
          },
          left: {
            backgroundColor: '#68BBE3'
          },
        }}
      />
    );
  }

  render() {

    let bgColor = this.props.route.params.bgColor;

    return (
        // User background preference is updated to match selection
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* this fixes android keyboard */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
