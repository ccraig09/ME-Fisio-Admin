import React from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View,
  StyleSheet,
} from "react-native";
import styled from "styled-components";

export const NoteBlock = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <TouchableCmp onPress={props.onSelect} onLongPress={props.longPress}>
      <View style={styles.shadow}>
        <Item>
          <Text>{props.title}</Text>
        </Item>
      </View>
    </TouchableCmp>
  );
};

export default NoteBlock;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOpacity: 0.56,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
});

const Item = styled.View`
  background: #5b91a6;
  height: 60px;
  width: 110px;
  padding: 12px 16px 12px;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  margin-top: 10px;
`;
const Text = styled.Text`
  font-size: 13px;
  font-weight: 600;
  position: absolute;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;
