import { Link } from "expo-router";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { images } from "../constants/Image";
import { View } from "./Themed";
import { BlurView } from "expo-blur";
import namespace from "@/app/translations/namespace.js";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function DocumentCard(props: {
  title?: string;
  subtitle?: string;
  id: string;
  user: string;
  disable: boolean;
  firstFist: boolean;
  CreatePDF: Function;
}) {
  return (
    <>
      {!props.firstFist && props.disable ? (
        <Link
          href={{
            pathname: "/modal",
            params: { type: props.id, user: props.user },
          }}
          asChild
        >
          <Card style={styles.card} mode="contained">
            <Card.Title
              title={props.title || "deafult"}
              titleStyle={styles.title}
              subtitle={props.subtitle || "deafult"}
              subtitleStyle={styles.subtitle}
              left={() => (
                <Avatar.Image
                  style={styles.icon}
                  size={48}
                  source={images(props.id)}
                />
              )}
              right={(prop) => (
                <MaterialIcons
                  {...prop}
                  name="ios-share"
                  color="#272D2D"
                  style={{ marginRight: 15 }}
                  onPress={() => {
                    props.CreatePDF(props.id);
                  }}
                />
              )}
            />
          </Card>
        </Link>
      ) : (
        ""
      )}
      {props.firstFist && !props.disable ? (
        <Card style={styles.card} mode="contained" disabled={true}>
          <BlurView
            style={{
              position: "absolute",
              overflow: "hidden",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              borderRadius: 10,
            }}
            tint="systemChromeMaterial"
          >
            <Card.Content style={styles.iconCard}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "ManropeSemiBold",
                  marginBottom: 10,
                  color: "#374151",
                  letterSpacing: 1,
                }}
              >
                {props.title + " " + namespace.t("NOT_AVAILABLE")}
              </Text>
            </Card.Content>
          </BlurView>
          <Card.Title
            style={styles.notAvailable}
            title={props.title || "deafult"}
            titleStyle={styles.title}
            subtitle={props.subtitle || "deafult"}
            subtitleStyle={styles.subtitle}
            left={() => (
              <Avatar.Image
                style={styles.icon}
                size={48}
                source={images(props.id)}
              />
            )}
            right={(props) => (
              <IconButton
                {...props}
                icon="tray-arrow-down"
                onPress={() => {}}
              />
            )}
          />
        </Card>
      ) : (
        ""
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
    backgroundColor: "#ffffff",
    borderRadius: 30,
  },
  icon: {
    backgroundColor: "#FFFFFF",
  },
  subtitle: {
    fontFamily: "ManropeRegular",
    color: "#737d88",
  },
  title: {
    fontFamily: "ManropeBold",
  },
  notAvailable: {
    margin: 4,
    backgroundColor: "#ffffff",
    borderRadius: 30,
  },
  iconCard: {
    alignItems: "center",
  },
});
