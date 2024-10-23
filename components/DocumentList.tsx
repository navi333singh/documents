import React, { useEffect, useRef, useState } from "react";
import { Card, Chip } from "react-native-paper";
import { Text, View } from "@/components/Themed";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import namespace from "@/app/translations/namespace.js";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/components/CustomBottomSheetModal";
import { Feather, Entypo } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { DocumentCard } from "./DocumentCard";
import * as Haptics from "expo-haptics";
import { useSQLiteContext } from "expo-sqlite";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";

export function DocumentList() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => bottomSheetRef.current?.present();
  const [profile, setProfile] = useState(Array<string>);
  const [available, setAvailable] = useState(Array<boolean>);
  const [removeValue, setRemoveValue] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setRemoveValue(true);
    const fetchData = () => {
      const resp = SecureStore.getItem("profile") || '["Me"]';
      return JSON.parse(resp);
    };
    setProfile(fetchData());
  }, []);

  const db = useSQLiteContext();

  const onlyLettersAndNumbers = (str: string): boolean => {
    return /^[A-Za-z0-9]*$/.test(str);
  };

  const addChips = async (title: string, subtitle: string) => {
    // await CreatePDF("ID");
    Alert.prompt(title, subtitle, [
      {
        text: "Aggiungi",
        onPress: async (value) => {
          if (value != null) {
            if (onlyLettersAndNumbers(value)) {
              const clearValue: string = value?.trim() || "";
              setProfile([...profile, clearValue]);
              await SecureStore.setItemAsync(
                "profile",
                JSON.stringify([...profile, clearValue])
              );
            } else {
              addChips(
                "Nome non valido",
                "Inserisci un nome senza caratteri speciali o spazi"
              );
            }
          } else {
            addChips("Nome non valido", "Inserisci un nome valido");
          }
        },
      },
      {
        text: "annulla",
        style: "cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
    ]);
  };

  const removeChips = async (title: string, index: number, val: String) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(title, "", [
      {
        text: "Rimuovi",
        onPress: async () => {
          if (val != "Me") {
            let value = profile.splice(index, 1)[0];
            setProfile([...profile]);
            setRemoveValue(true);
            await SecureStore.setItemAsync(
              "profile",
              JSON.stringify([...profile])
            );
            console.log(value);
            deleteAllDocuments(value);
          }
        },
      },
      {
        text: "annulla",
        style: "cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
    ]);
  };

  const CreatePDF = async (document: string) => {
    const file1 = document + "-" + profile[0] + "-1";
    const file2 = document + "-" + profile[0] + "-2";
    const doc: any = await db.getAllAsync(
      `SELECT * FROM documents_base64 where key="${file1}" or key="${file2}"`
    );
    const imageFronte = "data:image/png;base64," + doc[0].value;
    const imageRetro = "data:image/png;base64," + doc[1].value;
    const html = `
        <html>
          <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          </head>
          <body style="text-align: center;">
            <img
            src=${imageFronte}
            style="width: 459px; height: 271px; margin-top: 150px; border-radius: 15px;" 
            alt="front"
            />
            <br>
            <img
            src=${imageRetro}
            style="width: 459px; height: 271px; margin-top: 70px; border-radius: 15px;" 
            alt="retro"
            />
          </body>
        </html>
      `;
    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
      dialogTitle: "Tessera Sanitaria",
    });
  };

  const selectChips = async (index: number) => {
    let value = profile.splice(index, 1)[0];
    setProfile([value, ...profile]);
    await SecureStore.setItemAsync(
      "profile",
      JSON.stringify([value, ...profile])
    );
    await checkDocuments(value);
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    //SecureStore.deleteItemAsync('profile');
  };

  const deleteAllDocuments = async (value: string) => {
    await SecureStore.deleteItemAsync("ID-" + value);
    await SecureStore.deleteItemAsync("TS-" + value);
    await SecureStore.deleteItemAsync("PAT-" + value);
    await SecureStore.deleteItemAsync("PP-" + value);
  };

  const checkDocuments = async (value: string) => {
    const id = (await SecureStore.getItemAsync("ID-" + value)) != null;
    const ts = (await SecureStore.getItemAsync("TS-" + value)) != null;
    const pat = (await SecureStore.getItemAsync("PAT-" + value)) != null;
    const pp = (await SecureStore.getItemAsync("PP-" + value)) != null;
    setAvailable([id, ts, pat, pp]);
  };

  return (
    <>
      <CustomBottomSheetModal ref={bottomSheetRef} user={profile[0]} />
      <View style={styles.scrollView}>
        <ScrollView
          horizontal={true}
          onContentSizeChange={(w, h) => {
            removeValue
              ? setRemoveValue(false)
              : scrollViewRef.current?.scrollTo({
                  x: w,
                  animated: true,
                });
          }}
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <Chip
            disabled={false}
            style={[styles.chips, { backgroundColor: "#dfccfc" }]}
            key={0}
          >
            <Text>{profile[0]}</Text>
          </Chip>
          {profile.map((value, index) => {
            if (index != 0) {
              return (
                <Chip
                  disabled={false}
                  style={styles.chips}
                  key={index}
                  onLongPress={() =>
                    removeChips("Rimuovi persona", index, value)
                  }
                  delayLongPress={500}
                  onPress={() => selectChips(index)}
                >
                  <Text>{value}</Text>
                </Chip>
              );
            }
          })}
        </ScrollView>
        {profile.length > 3 ? (
          <View
            style={{
              height: "100%",
              width: 1,
              backgroundColor: "#D0D0D0",
              marginRight: 5,
              marginLeft: 0,
            }}
          ></View>
        ) : (
          ""
        )}
        <Chip
          disabled={false}
          style={[styles.chips, { backgroundColor: "#ECECEC" }]}
          onPress={() => addChips("Aggiungi persona", "Inserisci il nome ")}
        >
          <Entypo name="plus" size={20} color="black" />
        </Chip>
      </View>
      {/* <Image style={{width: 300, height: 200}} source={{uri: image}}/> */}
      {available[0] || available[1] || available[2] || available[3] ? (
        <Card style={[styles.list, { marginBottom: 0 }]} mode="contained">
          <DocumentCard
            title={namespace.t("ID")}
            subtitle="18/04/2024"
            id="ID"
            key={1}
            user={profile[0]}
            disable={available[0]}
            firstFist={false}
            CreatePDF={CreatePDF}
          />
          <DocumentCard
            title={namespace.t("TS")}
            subtitle="18/04/2024"
            id="TS"
            key={2}
            user={profile[0]}
            disable={available[1]}
            firstFist={false}
            CreatePDF={CreatePDF}
          />
          <DocumentCard
            title={namespace.t("PAT")}
            subtitle="18/04/2024"
            id="PATENTE"
            key={3}
            user={profile[0]}
            disable={available[2]}
            firstFist={false}
            CreatePDF={CreatePDF}
          />
          <DocumentCard
            title={namespace.t("PP")}
            subtitle="18/04/2024"
            id="PP"
            key={4}
            user={profile[0]}
            disable={available[3]}
            firstFist={false}
            CreatePDF={CreatePDF}
          />
        </Card>
      ) : (
        ""
      )}
      <Card style={[styles.list, { marginTop: 15 }]} mode="contained">
        <DocumentCard
          title={namespace.t("ID")}
          subtitle="18/04/2024"
          id="ID"
          key={5}
          user={profile[0]}
          disable={available[0]}
          firstFist={true}
          CreatePDF={CreatePDF}
        />
        <DocumentCard
          title={namespace.t("TS")}
          subtitle="18/04/2024"
          id="TS"
          key={6}
          user={profile[0]}
          disable={available[1]}
          firstFist={true}
          CreatePDF={CreatePDF}
        />
        <DocumentCard
          title={namespace.t("PAT")}
          subtitle="18/04/2024"
          id="PATENTE"
          key={7}
          user={profile[0]}
          disable={available[2]}
          firstFist={true}
          CreatePDF={CreatePDF}
        />
        <DocumentCard
          title={namespace.t("PP")}
          subtitle="18/04/2024"
          id="PP"
          key={8}
          user={profile[0]}
          disable={available[3]}
          firstFist={true}
          CreatePDF={CreatePDF}
        />
      </Card>
      <View style={styles.upload}>
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Card.Content style={styles.iconCard}>
            <Feather name="upload" size={30} color="#6E47D5" />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "ManropeBold",
                marginTop: 10,
              }}
            >
              {namespace.t("UPLOAD_TITLE")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#A0A0A0",
                fontFamily: "ManropeRegular",
              }}
            >
              {namespace.t("UPLOAD_SUBTITLE")}
            </Text>
          </Card.Content>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "grey",
  },
  list: {
    height: "auto",
    margin: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    paddingVertical: 4,
  },
  upload: {
    marginTop: 10,
    height: "auto",
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    paddingVertical: 4,
  },
  iconCard: {
    margin: 15,
    alignItems: "center",
  },
  TextName: {
    textAlign: "left",
    width: "50%",
    opacity: 0.5,
  },
  TextOperation: {
    textAlign: "right",
    width: "50%",
    opacity: 0.5,
  },
  separator: {
    height: 1,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  chips: {
    backgroundColor: "white",
    marginRight: 10,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "none",
    marginTop: 10,
    marginHorizontal: 15,
  },
  image: {
    backgroundColor: "none",
    position: "absolute",
    zIndex: 1,
    flex: 1,
    paddingRight: 25,
    alignSelf: "flex-end",
  },
});
