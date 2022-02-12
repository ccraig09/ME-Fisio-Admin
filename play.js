<Appbar.Header
  style={{
    width: "100%",
    //height:
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 50,
  }}
>
  {/* <Appbar.Action
  icon="arrow-left"
  color={Colors.primaryColor}
  onPress={() => navigation.goBack()}
/> */}
  <Avatar.Text size={24} label="XD" />
  <Appbar.Content
    title="ME Fisio"
    titleStyle={{
      fontWeight: "bold",
      fontSize: 25,
      color: "white",
    }}
  />
  {/* <Appbar.Action icon="dots-vertical" onPress={null} color={"white"} /> */}
  {/* title="ME Fisio"
  titleStyle={{
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
  }} */}
  {/* /> */}
</Appbar.Header>;

import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const DrawerContent = (props) => {
  const [active, setActive] = useState("");
  // console.log("first", props.screenName);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar.Image
              source={{
                uri: "https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg",
              }}
              size={50}
            />
            <Title style={styles.title}>Mayra Ameller</Title>
            <Caption style={styles.caption}>Fisioterapeuta</Caption>
            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  47
                </Paragraph>
                <Caption style={styles.caption}>Clientes</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  27
                </Paragraph>
                <Caption style={styles.caption}>Citas</Caption>
              </View>
            </View>
          </View>
          {/* <Drawer.Section style={styles.drawerSection}>
            <Drawer.Item
              // style={{ backgroundColor: Colors.primary }}
              active={props.screenName === "Home"}
              // onPress={() => {
              //   setActive("first");
              // }}
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="calendar-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Calendario"
              onPress={() => {
                props.navigation.navigate("HomeTabs");
              }}
            />
            <Drawer.Item
              // style={{ backgroundColor: Colors.primary }}
              active={active === "second"}
              onPress={() => {
                setActive("second");
              }}
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="account-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Profile"
              // onPress={() => {}}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="tune" color={color} size={size} />
              )}
              label="Preferencias"
              onPress={() => {}}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="file" color={color} size={size} />
              )}
              label="Exportar"
              onPress={() => {
                navigation.navigate("Pdf");
              }}
            />
          </Drawer.Section> */}
          {/* <Drawer.Section title="Preferencias"> */}

          {/* <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Modo Oscuro</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple> */}
          {/* </Drawer.Section> */}
          <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
            <DrawerItemList {...props} />
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.drawerSectionBottom}>
        <Drawer.Item
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
          label="Cerrar Sesión"
          onPress={() => {}}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerSectionBottom: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
});
export default DrawerContent;
