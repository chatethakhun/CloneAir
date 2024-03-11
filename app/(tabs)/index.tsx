import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";

export default function Page() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        header: () => <ExploreHeader onChangeCategory={() => {}}/>
      }}/>

      <Text>List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
