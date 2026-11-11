import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomNavBar } from "@/components/BottomNavBar";
import { usePropertyStore } from "./propertyStore";
import { C, styles } from "./ProtectPage.styles";

export default function ProtectPage() {
  const router = useRouter();
  const { properties, reports } = usePropertyStore();

  const activeCount = properties.filter((p) => p.protectionStatus === "Active").length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color={C.navy}
            />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Protect My Property</Text>
            <Text style={styles.headerSubtitle}>
              Property safety management
            </Text>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => router.push("/property-reports" as any)}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color={C.navy}
            />
          </Pressable>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={C.white}
              />
              <Text style={styles.heroBadgeText}>GATEDPLUS PROTECTION</Text>
            </View>

            <Text style={styles.heroTitle}>
              Your Property,{"\n"}Our Responsibility.
            </Text>

            <Text style={styles.heroDescription}>
              Secure your valuable land & plots with regular on-ground
              inspections, geo-tagged audits and 24/7 guard surveillance.
            </Text>

            <Pressable
              style={styles.addPropertyButton}
              onPress={() => router.push("/add-property" as any)}
            >
              <MaterialCommunityIcons name="plus" size={20} color={C.green} />
              <Text style={styles.addPropertyButtonText}>Add Property</Text>
            </Pressable>
          </View>

          <View style={styles.heroIconContainer}>
            <MaterialCommunityIcons
              name="shield-home"
              size={92}
              color="#A6E6CE"
            />
          </View>
        </View>

        {/* STATISTICS */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsContainer}>
          <Pressable
            style={styles.statCard}
            onPress={() => router.push("/saved-properties" as any)}
          >
            <View style={[styles.statIcon, { backgroundColor: C.lightBlue }]}>
              <MaterialCommunityIcons
                name="home-city-outline"
                size={23}
                color={C.blue}
              />
            </View>
            <Text style={styles.statNumber}>{properties.length}</Text>
            <Text style={styles.statLabel}>Total Properties</Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() => router.push("/active-protection" as any)}
          >
            <View style={[styles.statIcon, { backgroundColor: C.lightGreen }]}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={23}
                color={C.green}
              />
            </View>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Protected</Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() => router.push("/property-reports" as any)}
          >
            <View style={[styles.statIcon, { backgroundColor: "#FFF4E5" }]}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={23}
                color={C.orange}
              />
            </View>
            <Text style={styles.statNumber}>{reports.length}</Text>
            <Text style={styles.statLabel}>Visit Reports</Text>
          </Pressable>
        </View>

        {/* MAIN ENTRY BUTTONS */}
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <View style={styles.actionsGrid}>
          {/* 1. Add Property */}
          <ActionCard
            icon="home-plus-outline"
            title="Add Property"
            subtitle="Register new plot or land"
            color={C.green}
            onPress={() => router.push("/add-property" as any)}
          />

          {/* 2. Saved Properties */}
          <ActionCard
            icon="bookmark-outline"
            title="Saved Properties"
            subtitle={`${properties.length} properties saved`}
            color={C.blue}
            onPress={() => router.push("/saved-properties" as any)}
          />

          {/* 3. Active Protection */}
          <ActionCard
            icon="shield-lock-outline"
            title="Active Protection"
            subtitle={`${activeCount} active subscriptions`}
            color="#D68B29"
            onPress={() => router.push("/active-protection" as any)}
          />

          {/* 4. Visit Reports */}
          <ActionCard
            icon="file-document-check-outline"
            title="Visit Reports"
            subtitle={`${reports.length} inspection logs`}
            color="#8B5CC7"
            onPress={() => router.push("/property-reports" as any)}
          />
        </View>

        {/* MY PROPERTIES PREVIEW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Properties</Text>
          <Pressable onPress={() => router.push("/list-property" as any)}>
            <Text style={styles.viewAllText}>View All ({properties.length})</Text>
          </Pressable>
        </View>

        {properties.slice(0, 3).map((property) => (
          <Pressable
            key={property.id}
            style={styles.propertyCard}
            onPress={() => {
              if (property.protectionStatus === "Active") {
                router.push({
                  pathname: "/property-reports" as any,
                  params: { propertyId: property.id },
                });
              } else {
                router.push({
                  pathname: "/payment" as any,
                  params: { propertyId: property.id },
                });
              }
            }}
          >
            <View style={styles.propertyIcon}>
              <MaterialCommunityIcons
                name={
                  property.protectionStatus === "Active"
                    ? "shield-check"
                    : "home-city"
                }
                size={28}
                color={
                  property.protectionStatus === "Active" ? C.green : C.blue
                }
              />
            </View>

            <View style={styles.propertyDetails}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={15}
                  color={C.muted}
                />
                <Text style={styles.propertyLocation} numberOfLines={1}>
                  {property.address || `${property.village}, ${property.city}`}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  property.protectionStatus === "Active"
                    ? styles.protectedBadge
                    : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    property.protectionStatus === "Active"
                      ? styles.protectedText
                      : styles.pendingText,
                  ]}
                >
                  {property.protectionStatus === "Active"
                    ? "Protected"
                    : property.protectionStatus}
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={C.muted}
            />
          </Pressable>
        ))}

        {/* RECENT ACTIVITY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Inspection Activity</Text>
          <Pressable onPress={() => router.push("/property-reports" as any)}>
            <Text style={styles.viewAllText}>Reports</Text>
          </Pressable>
        </View>

        <View style={styles.activityCard}>
          {reports.slice(0, 3).map((report, idx) => (
            <React.Fragment key={report.id}>
              {idx > 0 && <View style={styles.activityDivider} />}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/property-reports" as any,
                    params: { propertyId: report.propertyId },
                  })
                }
              >
                <ActivityItem
                  icon={
                    report.severity === "WARNING"
                      ? "alert-circle-outline"
                      : "clipboard-check-outline"
                  }
                  title={report.propertyName}
                  description={report.notes}
                  time={report.date}
                  color={
                    report.severity === "WARNING" ? C.orange : C.green
                  }
                />
              </Pressable>
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.footerText}>Powered by GatedPlus Security</Text>
      </ScrollView>

      <BottomNavBar activeTab="protect" />
    </SafeAreaView>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + "15" }]}>
        <MaterialCommunityIcons name={icon} size={26} color={color} />
      </View>

      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
  color,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color + "15" }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>

      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription} numberOfLines={2}>
          {description}
        </Text>
      </View>

      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}

export { ProtectPage, ProtectPage as ProtectScreen };
