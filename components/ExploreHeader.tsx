import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";

const categories = [
  {
    name: "Tiny homes",
    icon: "home",
  },
  {
    name: "Cabins",
    icon: "house-siding",
  },
  {
    name: "Trending",
    icon: "local-fire-department",
  },
  {
    name: "Play",
    icon: "videogame-asset",
  },
  {
    name: "City",
    icon: "apartment",
  },
  {
    name: "Beachfront",
    icon: "beach-access",
  },
  {
    name: "Countryside",
    icon: "nature-people",
  },
];

const style = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 5 : 0,
  },
  container: {
    backgroundColor: "#fff",
    height: 140,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 10,
  },
  categories: {
    flex: 1,
    marginTop: 12,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  categoryItemTitle: {
    fontSize: 12,
    color: "#666",

    paddingBottom: 5,
  },
});

type ExploreHeaderProps = {
  onChangeCategory: (category: string) => void;
};

const ExploreHeader = ({ onChangeCategory }: ExploreHeaderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);

  const onChange = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChangeCategory(categories[index].name);
  };
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        <View style={style.searchContainer}>
          <TouchableOpacity style={style.filterInput}>
            <Ionicons name="search" size={24} />
            <View>
              <Text>Where to?</Text>
              <Text>Anywhere - any week</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={style.filterButton}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>

        <View style={style.categories}>
          <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              gap: 20,
              paddingHorizontal: 16,
              flexGrow: 1,
            }}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                ref={(el) => (itemsRef.current[index] = el)}
                style={[
                  style.categoryItem,
                  { borderBottomWidth: activeIndex === index ? 3 : 0 },
                ]}
                onPress={() => onChange(index)}
                key={index}
              >
                <MaterialIcons size={24} name={category.icon as any} />
                <Text style={style.categoryItemTitle}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExploreHeader;
