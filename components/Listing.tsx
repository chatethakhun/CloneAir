import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

type ListingProps = {
  data: any[];
  category: string;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  textAndIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
});

const renderItem = ({ item }: { item: Listing }) => {
  return (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={{ gap: 5, marginVertical: 16 }}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        >
          <Animated.Image
            source={{ uri: item.medium_url }}
            style={style.image}
          />
          <TouchableOpacity
            style={{ position: "absolute", right: 30, top: 30 }}
          >
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>

          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <View style={style.textAndIcon}>
                <Ionicons name="star" size={24} color="#000" />
                <Text style={{ fontWeight: "bold" }}>
                  {item.review_scores_rating / 20}
                </Text>
              </View>
            </View>
            <Text>{item.room_type}</Text>
            <View style={style.textAndIcon}>
              <Text>${item.price}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

const Listing = ({ data = [], category }: ListingProps) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log({ category });
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <View style={style.container}>
      <FlatList data={isLoading ? [] : data} renderItem={renderItem} />
    </View>
  );
};

export default Listing;
