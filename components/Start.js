import React, {useState} from 'react';
import { View, Text, Pressable, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


//Colors added to const to make it easier to use
const colors = {
    black: "#090C08",
    purple: "#474056",
    grey: "#8A95A5",
    green: "#B9C6AE",
};

export default function Start(props) {

    //Use states to update the name and the background color
    let [name, setName] = useState();
    let [color, setColor] = useState();


        return (
            <View style={styles.container}>

                <ImageBackground source={require('../assets/Background-Image.png')} resizeMode='cover' style={styles.image}>

                    <Text style={styles.title}>Chat App</Text>

                    <View style={styles.form}> 
                    {/* User can introduce his name / username and it will appear in the Chat session */}
                        <TextInput
                            style={styles.input}
                            placeholder='Your Name'
                            value={name}
                            onChangeText={(name) => setName(name)}
                        />
                    {/* User can choose from four different background colors. Once once of them is pressed, the chat background will adapt */}
                        <Text style={styles.optionsText}>Choose Background Color:</Text>

                        <View style={styles.row}>

                            <TouchableOpacity 
                                style={[{backgroundColor: colors.black}, styles.buttonColor]}
                                onPress={() => setColor(colors.black)}
                            />
                            
                            <TouchableOpacity 
                                style={[{backgroundColor: colors.purple}, styles.buttonColor]}
                                onPress={() => setColor(colors.purple)}
                            />

                            <TouchableOpacity 
                                style={[{backgroundColor: colors.grey}, styles.buttonColor]}
                                onPress={() => setColor(colors.grey)}
                            />

                            <TouchableOpacity 
                                style={[{backgroundColor: colors.green}, styles.buttonColor]}
                                onPress={() => setColor(colors.green)}
                            />
                            

                        </View>
                        
                        <View style={styles.buttonSpace}>
                        {/* The Start Chatting button sends the user name and background color preference to Chat window */}
                        <Pressable
                            onPress={() => props.navigation.navigate('Chat', { name: name, color: color })}
                            style={({ pressed }) => [
                              {
                                backgroundColor: pressed
                                  ? '#585563'
                                  : '#757083'
                              },
                              styles.button
                            ]}
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </Pressable>

                        </View>
                        
                    </View>
                    
                </ImageBackground>
            </View>
        )
    }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    image: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    input: {
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 0,
        height: 50,
        color: '#757083',
        borderWidth: 1,
        width: '88%',
        marginTop: 30,
        marginBottom: 50,
        marginLeft: 20,

    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        color: 'white',
        marginTop: '20%',
        height: '45%',
    },
    form: {
        flex: 1,
        backgroundColor: 'white',
        width: '88%',
        marginBottom: '10%',
        justifyContent: 'center',
    },
    button: {
        fontSize: 16,
        color: 'white',
    },
    buttonSpace: {
        backgroundColor: '#757083',
        color: 'white',
        width: '88%',
        height: 60,
        marginLeft: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    optionsText: {
        marginLeft: 20,
        fontSize: 16,
        marginBottom: 25,
    },
    buttonColor: {
        marginLeft: 30,
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        margin: 'auto'
    }
})