import React, { Component } from "react";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
          isConnected: false,
        }
    
        // initializes the Firestore app
        if (!firebase.apps.length){
          firebase.initializeApp(firebaseConfig);
        }
        //Stores and retrieves the chat messages users send
        this.referenceChatMessages = firebase.firestore().collection("messages");
    
        this.referenceMessagesUser= null;
      }

      // Save messages to local storage
      async getMessages() {
        let messages = '';
        try {
          messages = await AsyncStorage.getItem('messages') || [];
          this.setState({
            messages: JSON.parse(messages)
          });
        } catch (error) {
          console.log(error.message);
        }
      };

      async saveMessages() {
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
          console.log(error.message);
        }
      };

      async deleteMessages() {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
      };

      componentDidMount() {
        
        let { name} = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
    
        // Reference to load messages via Firebase
        this.referenceChatMessages = firebase.firestore().collection("messages");

        NetInfo.fetch().then(connection => {
          if (connection.isConnected) {
            this.setState({ isConnected: true });
            console.log('online');
          } else {
            console.log('offline');
          };
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
      });        
    };
        
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
        this.saveMessages();
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
    
    // Render the default input toolbar when user is online
    renderInputToolbar(props) {
      if (this.state.isConnected == false) {
      } else {
        return(
          <InputToolbar
          {...props}
          />
        );
      }
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

    // stop listening to auth and collection changes
    componentWillUnmount() {
      this.authUnsubscribe();
    }
    
      render() {
        let { color, name } = this.props.route.params;
        return (
          <View style={[{ backgroundColor: color }, styles.container]}>
          <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          onSend={(messages) => this.onSend(messages)}
          user={{
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
