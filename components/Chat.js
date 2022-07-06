import React, { Component } from "react";
<<<<<<< Updated upstream
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
=======
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { View, StyleSheet, KeyboardAvoidingView} from 'react-native';

//adding firebase google database
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

    //configurations to allow this app to connect to Cloud Firestore database
    const firebaseConfig = {
      apiKey: "AIzaSyAcqnc9fm0HY7_aHSmmABHmlBzpa1UlhuA",
      authDomain: "chatapp-9f4d7.firebaseapp.com",
      projectId: "chatapp-9f4d7",
      storageBucket: "chatapp-9f4d7.appspot.com",
      messagingSenderId: "307696379468",
    };

    class Chat extends Component {
      constructor(){
        super();
        this.state ={
          messages: [],
          uid: 0,
          user: {
            _id: "",
            name: "",
            avatar: "",
          },
        }
    
        // initializes the Firestore app
        if (!firebase.apps.length){
          firebase.initializeApp(firebaseConfig);
        }
        //Stores and retrieves the chat messages users send
        this.referenceChatMessages = firebase.firestore().collection("messages");
    
        this.referenceMessagesUser= null;
      }
      componentDidMount() {
        
        let { name} = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
    
        // Reference to load messages via Firebase
        this.referenceChatMessages = firebase.firestore().collection("messages");
    
        // Authenticates user via Firebase
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
              avatar: "https://placeimg.com/140/140/any",
          },
          });
          this.referenceMessagesUser = firebase
                    .firestore()
                    .collection("messages")
                    .where("uid", '==', this.state.uid);
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
      });
    }
    
    // stop listening to auth and collection changes
    componentWillUnmount() {
      this.authUnsubscribe();
      this.unsubscribe();
    }
    
     // Adds messages to cloud storage
     addMessages() {
      const message = this.state.messages[0];
      this.referenceChatMessages.add({
        uid: this.state.uid,
        _id: message._id,
        text: message.text || "",
        createdAt: message.createdAt,
        user: message.user,
      });
    }
    
    onSend(messages = []) {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),() => {
        this.addMessages();
      });
    }
    
    onCollectionUpdate = (querySnapshot) => {
      const messages = [];
      // go through each document
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        let data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user,
        });
      });
      this.setState({
        messages: messages
      });
    }
    
    // Customize the color of the sender bubble
    renderBubble(props) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#ADD8E6'
            }
          }}
        />
      )
    }
    
      render() {
        let { color, name } = this.props.route.params;
        return (
          <View style={[{ backgroundColor: color }, styles.container]}>
          <GiftedChat
>>>>>>> Stashed changes
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
<<<<<<< Updated upstream
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
=======
            _id: this.state.user._id,
            name: name,
             avatar: this.state.user.avatar 
    
          }}
        />
         {/* Avoid keyboard to overlap text messages on older Andriod versions  */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
        );
      }
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
    })
    
    export default Chat;
>>>>>>> Stashed changes
