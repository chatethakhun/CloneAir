import { SafeAreaView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Listing from "@/components/Listing";
import data from '@/assets/data/airbnb.json';
import { useMemo, useState } from "react";

export default function Page() {
  
  const [category, setCategory] = useState("Trending")
  const listData = useMemo(() => data as Listing[], [])
  
  return (
    <View style={{  flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onChangeCategory={(text: string) => setCategory(text)} />,
        }}
      />

      <Listing data={listData} category={category} />
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
