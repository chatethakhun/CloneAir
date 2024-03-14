import { Dimensions, Share, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, useNavigation } from "expo-router";
import listing from "@/assets/data/airbnb.json";
import { useCallback, useLayoutEffect, useMemo } from "react";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import themeStyle from "@/constants/Style";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");
const imageHeight = 200;

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  const item = useMemo(
    () => (listing as Listing[]).find((item: Listing) => item.id === id),
    [id]
  );
  const navigation = useNavigation();

  const shareListing = useCallback(async () => {
    try {
      await Share.share({
        title: item!.name,
        url: item!.listing_url,
      });
    } catch (error) {
      console.error(error);
    }
  }, [item]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View style={{ backgroundColor: "red" }} />
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: "transparent",
          }}
        >
          <TouchableOpacity style={styles.roundedButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareListing} style={styles.roundedButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.roundedButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useScrollViewOffset(scrollRef);

  const animateImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-imageHeight, 0, imageHeight],
            [-imageHeight / 2, 0, imageHeight * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-imageHeight, 0, imageHeight],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: item!.xl_picture_url }}
          style={[styles.image, animateImageStyle]}
        />
        <View style={styles.contentContainer}>
          <Text style={[styles.fontBold, { fontSize: 24 }]}>{item!.name}</Text>
          <Text style={styles.fontBold}>
            {item!.room_type} in {item!.smart_location}
          </Text>
          <Text>
            {item?.guests_included} guests, {item?.bedrooms} bedrooms,{" "}
            {item?.beds} beds, {item?.bathrooms} bathrooms
          </Text>
          <View style={themeStyle.textWithIcon}>
            <Ionicons name="star" size={16} />
            <Text style={styles.fontBold}>
              {item!.review_scores_rating / 20} reviews
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Animated.Image
              source={{ uri: item!.host_picture_url }}
              style={styles.hostImage}
            />
            <View>
              <Text style={styles.fontBold}>Hosted by {item!.host_name}</Text>
              <Text>Host since {item!.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text>{item!.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={styles.actions} entering={FadeInDown.delay(200)}>
        <View style={styles.actionContent}>
          <View>
            <Text style={styles.fontBold}>${item!.price}</Text>
            <Text style={styles.fontBold}>{item!.host_since}</Text>
          </View>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.textBtn}>Reverse</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width,
    height: imageHeight,
  },
  fontBold: {
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 5,
    paddingBottom: 10,
  },
  divider: {
    marginVertical: 5,
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#000",
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actions: {
    width,
    height: 60,
    paddingHorizontal: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  textBtn: {
    color: "#fff",
  },
  roundedButton: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "white",
  },
});
