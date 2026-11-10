import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  Pressable,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_WIDTH = SCREEN_WIDTH - 36;

// Keep the header balanced on narrow and wide phones.
const HEADER_LOGO_WIDTH = Math.min(164, Math.max(96, SCREEN_WIDTH * 0.37));
const COMPACT_HEADER = SCREEN_WIDTH < 380;

const C = {
  green: colors.green,
  darkGreen: colors.darkGreen,
  navy: colors.navy,
  blue: colors.blue,
  white: colors.white,
  muted: colors.textMuted,
  border: colors.border,
  lightGreen: colors.lightGreen,
};

// IMAGE CAROUSEL
const slides = [
  {
    id: "1",
    image: require("../../assets/images/home-banner-1.png"),
    tag: "FIND YOUR DREAM HOME",
    title: "A home that feels like yours",
    subtitle: "Explore beautiful properties in your favourite locations.",
    button: "Explore Homes",
  },
  {
    id: "2",
    image: require("../../assets/images/home-banner-2.png"),
    tag: "PREMIUM PROPERTIES",
    title: "Discover better living",
    subtitle: "Find premium homes designed around your lifestyle.",
    button: "View Properties",
  },
  {
    id: "3",
    image: require("../../assets/images/home-banner-3.png"),
    tag: "NEW PROJECTS",
    title: "Your next chapter starts here",
    subtitle: "Discover exciting residential projects and communities.",
    button: "Explore Projects",
  },
  {
    id: "4",
    image: require("../../assets/images/home-banner-4.png"),
    tag: "GATED COMMUNITIES",
    title: "Find your perfect community",
    subtitle: "Explore homes where comfort meets community living.",
    button: "Explore Communities",
  },
];

// GET STARTED WITH - FIVE CARDS
const quickActions = [
  {
    title: "Post Property",
    icon: "home-plus-outline",
    color: "#DB6580",
    background: "#FFF0F3",
  },
  {
    title: "Protect Property",
    icon: "shield-check-outline",
    color: "#0B9870",
    background: "#E7F7F0",
  },
  {
    title: "Friends Community",
    icon: "account-group-outline",
    color: "#8258D7",
    background: "#F1ECFF",
  },
  {
    title: "Refer & Earn",
    icon: "gift-outline",
    color: "#D58B25",
    background: "#FFF5E5",
  },
  {
    title: "Services",
    icon: "view-grid-outline",
    color: "#2879D9",
    background: "#EAF3FF",
  },
];

// POPULAR TOOLS
const popularTools = [
  {
    title: "EMI Calculator",
    subtitle: "Plan your home loan",
    icon: "calculator-variant-outline",
    color: "#2879D9",
    background: "#EAF3FF",
  },
  {
    title: "Property Value",
    subtitle: "Check property prices",
    icon: "chart-line",
    color: "#0B9870",
    background: "#E7F7F0",
  },
  {
    title: "Loan Eligibility",
    subtitle: "Check your eligibility",
    icon: "bank-outline",
    color: "#8258D7",
    background: "#F1ECFF",
  },
  {
    title: "Saved Properties",
    subtitle: "View your favourites",
    icon: "heart-outline",
    color: "#DB6580",
    background: "#FFF0F3",
  },
];

export default function HomePage() {
  const router = useRouter();

  const carouselRef = useRef<any>(null);
  const activeSlideRef = useRef(0);

  const [activeSlide, setActiveSlide] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [quickActionsWidth, setQuickActionsWidth] = useState(SCREEN_WIDTH);
  // Size cards so three are fully visible and roughly half of the next card
  // peeks in from the right, making the horizontal carousel discoverable.
  const quickCardWidth = Math.max(1, (quickActionsWidth - 34 - 30) / 3.5);

  // AUTOMATIC CAROUSEL
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex =
        (activeSlideRef.current + 1) % slides.length;

      activeSlideRef.current = nextIndex;
      setActiveSlide(nextIndex);

      carouselRef.current?.scrollTo({
        x: nextIndex * CAROUSEL_WIDTH,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // UPDATE ACTIVE SLIDE WHEN USER SWIPES
  const handleCarouselScroll = (event: any) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / CAROUSEL_WIDTH);

    if (index >= 0 && index < slides.length) {
      activeSlideRef.current = index;
      setActiveSlide(index);
    }
  };

  // SEARCH
  const handleSearch = () => {
    if (!searchText.trim()) {
      Alert.alert(
        "Search",
        "Please enter a location or property name."
      );
      return;
    }

    Alert.alert(
      "Search",
      "Coming soon"
    );
  };

  // TEMPORARY BUTTON ACTION
const handleAction = (name: string) => {
  if (name === "Protect Property") {
    router.push("/protect");
    return;
  }

  if (name === "Refer & Earn") {
    router.push("/Refer");
    return;
  }

  Alert.alert(name, "Coming soon");
};

  // MANUAL CAROUSEL DOT
  const changeSlide = (index: number) => {
    activeSlideRef.current = index;
    setActiveSlide(index);

    carouselRef.current?.scrollTo({
      x: index * CAROUSEL_WIDTH,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContent}
        stickyHeaderIndices={[2]}
        keyboardShouldPersistTaps="handled"
      >
      {/* SCROLLING HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerBrand}
          onPress={() => router.replace("/home")}
        >
          <Image
            source={require("@/assets/images/gatedplusLogo.jpeg")}
            style={[styles.brandLogo, { width: HEADER_LOGO_WIDTH }]}
            resizeMode="contain"
          />
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Protect Property"
            onPress={() => router.push("/protect")}
            style={({ pressed }) => [styles.protectButton, pressed && styles.cardPressed]}
          >
            <MaterialCommunityIcons name="shield-half-full" size={18} color={C.green} />
            <Text
              style={styles.protectButtonText}
              numberOfLines={1}
              allowFontScaling={false}
            >
              Protect Property
            </Text>
          </Pressable>
          <Pressable
            style={styles.notificationButton}
            onPress={() => handleAction("Notifications")}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              color={C.navy}
            />

            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

        {/* IMAGE CAROUSEL */}
        <View style={styles.carouselSection}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled={false}
            snapToInterval={CAROUSEL_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleCarouselScroll}
          >
            {slides.map((slide) => (
              <View
                key={slide.id}
                style={styles.slideWrapper}
              >
                <ImageBackground
                  source={slide.image}
                  style={styles.slideImage}
                  imageStyle={styles.slideImageRadius}
                  resizeMode="cover"
                >
                  <View style={styles.slideOverlay} />

                  <View style={styles.slideContent}>
                    <View style={styles.slideTag}>
                      <Text style={styles.slideTagText}>
                        {slide.tag}
                      </Text>
                    </View>

                    <Text style={styles.slideTitle}>
                      {slide.title}
                    </Text>

                    <Text style={styles.slideSubtitle}>
                      {slide.subtitle}
                    </Text>

                    <Pressable
                      style={styles.slideButton}
                      onPress={() => handleAction(slide.button)}
                    >
                      <Text style={styles.slideButtonText}>
                        {slide.button}
                      </Text>

                      <MaterialCommunityIcons
                        name="arrow-right"
                        size={17}
                        color={C.green}
                      />
                    </Pressable>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>

          {/* CAROUSEL INDICATORS */}
          <View style={styles.dotsContainer}>
            {slides.map((slide, index) => (
              <Pressable
                key={slide.id}
                onPress={() => changeSlide(index)}
                style={[
                  styles.dot,
                  activeSlide === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.stickySearch}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconBox}>
            <MaterialCommunityIcons
              name="magnify"
              size={25}
              color={C.green}
            />
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder='Search "Hyderabad", properties, projects...'
            placeholderTextColor="#91A0B1"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          <Pressable
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <MaterialCommunityIcons
              name="arrow-right"
              size={21}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        </View>

        {/* GET STARTED WITH */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>
                Get started with
              </Text>

              <Text style={styles.sectionSubtitle}>
                Explore everything GatedPlus offers
              </Text>
            </View>

            <View style={styles.sectionHeadingIcon}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={24}
                color={C.green}
              />
            </View>
          </View>

          {/* SWIPEABLE ROW - THREE CARDS VISIBLE */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            onLayout={(event) => setQuickActionsWidth(event.nativeEvent.layout.width)}
            contentContainerStyle={styles.quickActionsRow}
            snapToInterval={quickCardWidth + 10}
            decelerationRate="fast"
            keyboardShouldPersistTaps="handled">
            {quickActions.map((item) => (
              <Pressable
                key={item.title}
                style={({ pressed }) => [
                  styles.quickCard,
                  { width: quickCardWidth },
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleAction(item.title)}
              >
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: item.background },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>

                <Text style={styles.quickTitle}>
                  {item.title}
                </Text>

              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* FEATURED PROJECTS */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredHeading}>
            <View>
              <Text style={styles.sectionTitle}>
                Featured Projects
              </Text>

              <Text style={styles.sectionSubtitle}>
                Explore highlighted properties
              </Text>
            </View>

            <Pressable
              onPress={() => handleAction("All Projects")}
            >
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>

          {/* ANUHAR APPLE TOWERS */}
          <Pressable
            style={({ pressed }) => [
              styles.projectCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleAction("Anuhar Apple Towers")}
          >
            <View style={styles.projectImageContainer}>
              <Image
                source={{
                  uri: "https://online.fliphtml5.com/kojwp/xuwj/files/shot.jpg",
                }}
                style={styles.projectImage}
                resizeMode="cover"
              />

              <View style={styles.projectImageOverlay}>
                <Text style={styles.projectTag}>
                  FEATURED PROJECT
                </Text>
              </View>
            </View>

            <View style={styles.projectDetails}>
              <View style={styles.projectTitleRow}>
                <Text style={styles.projectTitle}>
                  Anuhar Apple Towers
                </Text>

                <MaterialCommunityIcons
                  name="heart-outline"
                  size={23}
                  color={C.muted}
                />
              </View>

              <View style={styles.projectLocation}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color={C.green}
                />

                <Text style={styles.projectLocationText}>
                  Pocharam, Hyderabad
                </Text>
              </View>

              <Text style={styles.projectConfiguration}>
                2, 2.5 & 3 BHK Apartments
              </Text>

              <View style={styles.projectPriceRow}>
                <Text style={styles.projectPriceLabel}>
                  Price
                </Text>

                <Text style={styles.projectPrice}>
                  Price on Request
                </Text>
              </View>

              <View style={styles.projectDivider} />

              <Text style={styles.projectHighlightsTitle}>
                Project Highlights
              </Text>

              <View style={styles.projectHighlights}>
                <View style={styles.highlightItem}>
                  <MaterialCommunityIcons
                    name="domain"
                    size={17}
                    color={C.green}
                  />
                  <Text style={styles.highlightText}>
                    50,000 sq. ft. clubhouse
                  </Text>
                </View>

                <View style={styles.highlightItem}>
                  <MaterialCommunityIcons
                    name="pool"
                    size={17}
                    color={C.green}
                  />
                  <Text style={styles.highlightText}>
                    Swimming pools
                  </Text>
                </View>

                <View style={styles.highlightItem}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={17}
                    color={C.green}
                  />
                  <Text style={styles.highlightText}>
                    Gym and indoor games
                  </Text>
                </View>

                <View style={styles.highlightItem}>
                  <MaterialCommunityIcons
                    name="badminton"
                    size={17}
                    color={C.green}
                  />
                  <Text style={styles.highlightText}>
                    Badminton and cricket nets
                  </Text>
                </View>

                <View style={styles.highlightItem}>
                  <MaterialCommunityIcons
                    name="tree-outline"
                    size={17}
                    color={C.green}
                  />
                  <Text style={styles.highlightText}>
                    Gardens and jogging track
                  </Text>
                </View>

                <View style={styles.highlightItem}>
                  <MaterialCommunityIcons
                    name="book-open-page-variant-outline"
                    size={17}
                    color={C.green}
                  />
                  <Text style={styles.highlightText}>
                    Library and indoor activities
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.projectButton}
                onPress={() => handleAction("Anuhar Apple Towers")}
              >
                <Text style={styles.projectButtonText}>
                  View Project Details
                </Text>

                <MaterialCommunityIcons
                  name="arrow-right"
                  size={18}
                  color={C.white}
                />
              </Pressable>
            </View>
          </Pressable>
        </View>

        {/* POPULAR TOOLS */}
        <View style={styles.toolsSection}>
          <View style={styles.toolsHeading}>
            <View style={styles.toolsTitleArea}>
              <View style={styles.toolsIcon}>
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={27}
                  color="#D99B32"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Popular Tools
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Make smarter property decisions
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => handleAction("All Tools")}
            >
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>

          <View style={styles.toolsGrid}>
            {popularTools.map((item) => (
              <Pressable
                key={item.title}
                style={({ pressed }) => [
                  styles.toolCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleAction(item.title)}
              >
                <View
                  style={[
                    styles.toolIcon,
                    { backgroundColor: item.background },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={27}
                    color={item.color}
                  />
                </View>

                <View style={styles.toolTextArea}>
                  <Text style={styles.toolTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.toolSubtitle}>
                    {item.subtitle}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={C.muted}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.white,
  },

  // HEADER
  header: {
    minHeight: 74,
    paddingHorizontal: COMPACT_HEADER ? 9 : 14,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
  },

  headerBrand: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    marginRight: COMPACT_HEADER ? 5 : 8,
  },

  brandLogo: {
    height: 36,
    maxWidth: "100%",
  },

  brandMark: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -1,
  },

  brandGated: {
    color: C.darkGreen,
  },

  brandPlus: {
    color: C.navy,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: COMPACT_HEADER ? 5 : 8,
    flexShrink: 0,
    marginLeft: 0,
  },

  protectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 42,
    paddingHorizontal: COMPACT_HEADER ? 8 : 11,
    maxWidth: COMPACT_HEADER ? 120 : 154,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#8AE4C3",
    backgroundColor: "#E9FBF3",
    flexShrink: 1,
  },

  protectButtonText: {
    color: C.navy,
    fontSize: COMPACT_HEADER ? 11 : 13,
    fontWeight: "700",
    flexShrink: 1,
    includeFontPadding: false,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    width: 7,
    height: 7,
    backgroundColor: "#E34D59",
    borderRadius: 4,
    top: 7,
    right: 8,
    borderWidth: 1,
    borderColor: C.white,
  },

  // MAIN CONTENT
  mainScroll: {
    flex: 1,
  },

  mainContent: {
    paddingBottom: 10,
  },

  // CAROUSEL
  carouselSection: {
    paddingTop: 12,
  },

  slideWrapper: {
    width: CAROUSEL_WIDTH,
    height: 235,
    marginHorizontal: 18,
    borderRadius: 19,
    overflow: "hidden",
  },

  slideImage: {
    flex: 1,
    justifyContent: "flex-end",
  },

  slideImageRadius: {
    borderRadius: 19,
  },

  slideOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(5, 24, 43, 0.43)",
  },

  slideContent: {
    paddingHorizontal: 19,
    paddingBottom: 21,
    alignItems: "flex-start",
  },

  slideTag: {
    backgroundColor: "rgba(7, 132, 91, 0.95)",
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginBottom: 11,
  },

  slideTagText: {
    color: C.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  slideTitle: {
    color: C.white,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 29,
    maxWidth: "95%",
  },

  slideSubtitle: {
    color: "#F0F5FA",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
    maxWidth: "95%",
  },

  slideButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 13,
  },

  slideButtonText: {
    color: C.green,
    fontSize: 10,
    fontWeight: "900",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
    marginBottom: 13,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#C8D5E2",
  },

  activeDot: {
    width: 22,
    backgroundColor: C.green,
  },

  // SEARCH
  stickySearch: {
    backgroundColor: C.white,
    paddingVertical: 10,
    zIndex: 10,
  },

  searchContainer: {
    height: 57,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: "#CFE2EE",
    borderRadius: 15,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#2C6688",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 9,
    elevation: 3,
  },

  searchIconBox: {
    width: 34,
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    color: C.navy,
    fontSize: 13,
    height: "100%",
  },

  searchButton: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },

  // SECTION HEADINGS
  section: {
    marginTop: 29,
  },

  sectionHeading: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: C.navy,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  sectionSubtitle: {
    color: C.muted,
    fontSize: 12,
    marginTop: 5,
  },

  sectionHeadingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: C.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  // QUICK ACTIONS - FIRST ROW
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 10,
    gap: 10,
  },

quickCard: {
    flexShrink: 0,
    height: 136,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "#E8EEF4",
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 5,
    shadowColor: "#244B68",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 3,
  },

  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  quickTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: C.navy,
    textAlign: "center",
  },

  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  // FEATURED PROJECTS
  featuredSection: {
    marginTop: 30,
    paddingHorizontal: 16,
  },

  featuredHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  viewAll: {
    color: C.blue,
    fontSize: 13,
    fontWeight: "900",
  },

  projectCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6EEF4",
    overflow: "hidden",
    shadowColor: "#244B68",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  projectImageContainer: {
    height: 190,
    position: "relative",
    backgroundColor: "#E8EEF3",
  },

  projectImage: {
    width: "100%",
    height: "100%",
  },

  projectImageOverlay: {
    position: "absolute",
    top: 13,
    left: 13,
    backgroundColor: C.green,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 7,
  },

  projectTag: {
    color: C.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  projectDetails: {
    padding: 15,
  },

  projectTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  projectTitle: {
    flex: 1,
    color: C.navy,
    fontSize: 19,
    fontWeight: "900",
  },

  projectLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 4,
  },

  projectLocationText: {
    color: C.muted,
    fontSize: 12,
  },

  projectConfiguration: {
    color: C.navy,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
  },

  projectPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  projectPriceLabel: {
    color: C.muted,
    fontSize: 12,
  },

  projectPrice: {
    color: C.green,
    fontSize: 14,
    fontWeight: "900",
  },

  projectDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 15,
  },

  projectHighlightsTitle: {
    color: C.navy,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 12,
  },

  projectHighlights: {
    gap: 11,
  },

  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  highlightText: {
    color: "#526477",
    fontSize: 11,
    flex: 1,
  },

  projectButton: {
    height: 46,
    backgroundColor: C.green,
    borderRadius: 12,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  projectButtonText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "900",
  },

  // POPULAR TOOLS
  toolsSection: {
    marginTop: 29,
    backgroundColor: "#EFF8FC",
    paddingTop: 23,
    paddingBottom: 23,
  },

  toolsHeading: {
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 19,
  },

  toolsTitleArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
  },

  toolsIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFF4D9",
    alignItems: "center",
    justifyContent: "center",
  },

  toolsGrid: {
    paddingHorizontal: 16,
    gap: 11,
  },

  toolCard: {
    minHeight: 76,
    backgroundColor: C.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E6EEF4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 10,
    gap: 12,
  },

  toolIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  toolTextArea: {
    flex: 1,
  },

  toolTitle: {
    color: C.navy,
    fontSize: 13,
    fontWeight: "900",
  },

  toolSubtitle: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },


});
export { HomePage, HomePage as HomeScreen };
