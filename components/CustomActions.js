import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewPropTypes,
} from "react-native";

import { connectActionSheet } from "@expo/react-native-action-sheet";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import communication features
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

// Action sheet with options
class CustomAction extends React.Component {
  state = {
    image: null,
    location: null,
  };

  //Function to upload images to Firebase
  uploadImageFetch = async (uri) => {
    // fetch from given URI & transform data in blob
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    // create storage reference
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const storage = getStorage();
    //images will be uploaded in the subfolder "images"
    const storageRef = ref(storage, `images/${imageName}`);
    // store blob content in storage
    await uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    // get image URL from storage
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  // CAMERA FEATURES
  //
  imagePicker = async () => {
    // expo permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    try {
      if (status === "granted") {
        // pick image
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images",
        }).catch((error) => console.log(error));
        // canceled process
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: "Images",
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // GEOLOCATION FEATURES
  //
  getLocation = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION_FOREGROUND
    );
    try {
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({});

        if (result) {
          this.props.onSend({
            location: {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // ACTION SHEET

  onActionPress = () => {
    const options = [
      "Choose Image From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.imagePicker();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Here you can choose to send an image or your location."
        style={styles.container}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomAction.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomAction.defaultProps = {
  onSend: () => {},
  options: {},
  renderIcon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomAction.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  renderIcon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};

const CustomActions = connectActionSheet(CustomAction);

export default CustomActions;