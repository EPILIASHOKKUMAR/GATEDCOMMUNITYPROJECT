import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Circle, Marker, type LatLng, type MapPressEvent, type Region } from "react-native-maps";
import { useRouter } from "expo-router";
import { FEATURED_PROJECTS_DATA, type ProjectItem } from "./FeaturedProjectsPage";

const HYDERABAD: Region = {
  latitude: 17.425,
  longitude: 78.39,
  latitudeDelta: 0.32,
  longitudeDelta: 0.48,
};

const localityCoordinates: Record<string, LatLng> = {
  pocharam: { latitude: 17.498, longitude: 78.578 },
  mokila: { latitude: 17.371, longitude: 78.218 },
  financial: { latitude: 17.419, longitude: 78.341 },
  tellapur: { latitude: 17.464, longitude: 78.306 },
  hitec: { latitude: 17.443, longitude: 78.377 },
  narsingi: { latitude: 17.385, longitude: 78.365 },
  nallagandla: { latitude: 17.465, longitude: 78.315 },
  kokapet: { latitude: 17.392, longitude: 78.339 },
  miyapur: { latitude: 17.496, longitude: 78.356 },
  kondapur: { latitude: 17.46, longitude: 78.36 },
};

const getProjectCoordinate = (project: ProjectItem, index: number): LatLng => {
  const location = project.location.toLowerCase();
  const match = Object.entries(localityCoordinates).find(([key]) => location.includes(key));
  if (match) return match[1];
  return {
    latitude: HYDERABAD.latitude + ((index % 4) - 1.5) * 0.009,
    longitude: HYDERABAD.longitude + ((index % 5) - 2) * 0.012,
  };
};

const distanceKm = (a: LatLng, b: LatLng) => {
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

export default function SearchMapPage() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef<any>(null);
  const [searchText, setSearchText] = useState("");
  const [voiceVisible, setVoiceVisible] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [areaCenter, setAreaCenter] = useState<LatLng | null>(null);
  const [radiusKm, setRadiusKm] = useState(2);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!isListening) {
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.25, duration: 650, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [isListening, pulseAnim]);

  const projectPoints = useMemo(
    () => FEATURED_PROJECTS_DATA.map((project, index) => ({ project, coordinate: getProjectCoordinate(project, index) })),
    []
  );
  const matchingProjects = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return projectPoints.filter(({ project, coordinate }) => {
      const matchesText = !query || `${project.title} ${project.location} ${project.configuration} ${project.tag}`.toLowerCase().includes(query);
      const matchesArea = !areaCenter || distanceKm(areaCenter, coordinate) <= radiusKm;
      return matchesText && matchesArea;
    });
  }, [projectPoints, searchText, areaCenter, radiusKm]);

  const startVoiceSearch = () => {
    setVoiceQuery("");
    setVoiceVisible(true);
    setIsListening(true);
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = "en-IN";
          recognition.onresult = (event: any) => setVoiceQuery(Array.from(event.results).map((result: any) => result[0].transcript).join(""));
          recognition.onend = () => setIsListening(false);
          recognition.onerror = () => setIsListening(false);
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          setIsListening(false);
        }
      }
    }
  };

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch { /* Recognition may already be stopped. */ }
    setIsListening(false);
  };

  const closeVoiceSearch = () => {
    stopListening();
    setVoiceVisible(false);
  };

  const applyVoiceSearch = () => {
    stopListening();
    if (voiceQuery.trim()) setSearchText(voiceQuery.trim());
    setVoiceVisible(false);
  };

  const handleMapPress = (event: MapPressEvent) => {
    if (!drawMode) return;
    const center = event.nativeEvent.coordinate;
    setAreaCenter(center);
    setDrawMode(false);
    setSelectedProject(null);
  };

  const startDrawingArea = () => {
    setDrawMode(true);
    setAreaCenter(null);
    setSelectedProject(null);
  };

  const selectProject = (project: ProjectItem, coordinate: LatLng) => {
    setSelectedProject(project.id);
    mapRef.current?.animateToRegion({ ...coordinate, latitudeDelta: 0.045, longitudeDelta: 0.045 }, 350);
  };

  const openProject = (id: string) => router.push({ pathname: "/project-details", params: { id } });

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topArea}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={23} color="#087D4A" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={'Search "Hyderabad", properties, projects...'}
            placeholderTextColor="#8996A6"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            accessibilityLabel="Search properties and locations"
          />
          {searchText.length > 0 && <Pressable onPress={() => setSearchText("")} accessibilityLabel="Clear search"><MaterialCommunityIcons name="close-circle" size={19} color="#9AA5B1" /></Pressable>}
          <Pressable onPress={startVoiceSearch} style={styles.micButton} accessibilityRole="button" accessibilityLabel="Voice search">
            <MaterialCommunityIcons name="microphone" size={22} color="#087D4A" />
          </Pressable>
        </View>
        <Text style={styles.searchHint}>Explore homes on the map around Hyderabad</Text>
      </View>

      <View style={styles.mapArea}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={HYDERABAD}
          mapType="standard"
          onPress={handleMapPress}
          showsCompass
          showsScale
          rotateEnabled={false}
          toolbarEnabled={false}
        >
          {areaCenter && <Circle center={areaCenter} radius={radiusKm * 1000} strokeColor="rgba(8,125,74,0.9)" fillColor="rgba(8,125,74,0.16)" strokeWidth={2} />}
          {matchingProjects.map(({ project, coordinate }) => (
            <Marker
              key={project.id}
              coordinate={coordinate}
              title={project.title}
              description={`${project.location} · ${project.price}`}
              pinColor={project.id === selectedProject ? "#0B6B43" : "#16A05D"}
              onPress={() => setSelectedProject(project.id)}
            />
          ))}
          {areaCenter && <Marker coordinate={areaCenter} pinColor="#1D4ED8" title="Selected search area" />}
        </MapView>

        <View style={styles.mapTopControls}>
          <Pressable style={[styles.drawButton, drawMode && styles.drawButtonActive]} onPress={drawMode ? () => setDrawMode(false) : startDrawingArea}>
            <MaterialCommunityIcons name={drawMode ? "close" : "circle-edit-outline"} size={18} color={drawMode ? "#FFFFFF" : "#087D4A"} />
            <Text style={[styles.drawButtonText, drawMode && styles.drawButtonTextActive]}>{drawMode ? "Cancel drawing" : "Draw search area"}</Text>
          </Pressable>
          {areaCenter && <Pressable style={styles.clearAreaButton} onPress={() => { setAreaCenter(null); setSelectedProject(null); }}><Text style={styles.clearAreaText}>Clear</Text></Pressable>}
        </View>

        {drawMode && <View pointerEvents="none" style={styles.drawHint}><MaterialCommunityIcons name="gesture-tap" size={17} color="#087D4A" /><Text style={styles.drawHintText}>Tap the map to place your search circle</Text></View>}

        {areaCenter && <View style={styles.radiusControl}>
          <Text style={styles.radiusTitle}>SEARCH RADIUS</Text>
          <View style={styles.radiusOptions}>
            {[1, 2, 5, 10].map((radius) => (
              <Pressable key={radius} onPress={() => setRadiusKm(radius)} style={[styles.radiusOption, radiusKm === radius && styles.radiusOptionActive]}>
                <Text style={[styles.radiusOptionText, radiusKm === radius && styles.radiusOptionTextActive]}>{radius} km</Text>
              </Pressable>
            ))}
          </View>
        </View>}

      </View>

      <View style={styles.resultsPanel}>
        <View style={styles.resultsHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultsTitle}>{areaCenter ? "Homes in this area" : "Homes on the map"}</Text>
            <Text style={styles.resultsSubtitle}>{matchingProjects.length} {matchingProjects.length === 1 ? "project" : "projects"} found{areaCenter ? ` within ${radiusKm} km` : ""}</Text>
          </View>
          {matchingProjects.length > 0 && <MaterialCommunityIcons name="map-marker-multiple" size={22} color="#087D4A" />}
        </View>
        {matchingProjects.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            {matchingProjects.map(({ project }) => (
              <Pressable key={project.id} style={[styles.projectCard, selectedProject === project.id && styles.projectCardSelected]} onPress={() => openProject(project.id)}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.projectName} numberOfLines={1}>{project.title}</Text>
                  <MaterialCommunityIcons name="map-marker-check" size={18} color="#087D4A" />
                </View>
                <View style={styles.cardLocationRow}><MaterialCommunityIcons name="map-marker-outline" size={14} color="#748195" /><Text style={styles.projectLocation} numberOfLines={1}>{project.location}</Text></View>
                <View style={styles.cardBottomRow}><Text style={styles.projectPrice} numberOfLines={1}>{project.price}</Text><Text style={styles.cardDetails}>Details <MaterialCommunityIcons name="arrow-right" size={12} color="#087D4A" /></Text></View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyResults}><MaterialCommunityIcons name="home-search-outline" size={22} color="#8693A2" /><Text style={styles.emptyText}>No projects found here. Try a wider area or another search.</Text></View>
        )}
      </View>

      <Modal visible={voiceVisible} transparent animationType="fade" onRequestClose={closeVoiceSearch}>
        <View style={styles.voiceOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeVoiceSearch} />
          <View style={styles.voiceCard}>
            <Pressable style={styles.voiceClose} onPress={closeVoiceSearch}><MaterialCommunityIcons name="close" size={21} color="#64748B" /></Pressable>
            <Text style={styles.voiceTitle}>{isListening ? "Listening..." : "Try saying something"}</Text>
            <View style={styles.transcriptBox}><TextInput autoFocus value={voiceQuery} onChangeText={setVoiceQuery} placeholder="Listening... or use your keyboard mic" placeholderTextColor="#97A1AE" style={styles.transcriptInput} returnKeyType="search" onSubmitEditing={applyVoiceSearch} /></View>
            <View style={styles.voiceMicWrap}>
              {isListening && <Animated.View style={[styles.voicePulse, { transform: [{ scale: pulseAnim }] }]} />}
              <Pressable style={[styles.voiceMic, isListening && styles.voiceMicActive]} onPress={isListening ? stopListening : startVoiceSearch}><MaterialCommunityIcons name="microphone" size={32} color="#FFFFFF" /></Pressable>
            </View>
            {voiceQuery.trim().length > 0 && <Pressable style={styles.voiceApply} onPress={applyVoiceSearch}><Text style={styles.voiceApplyText}>Search for “{voiceQuery}”</Text><MaterialCommunityIcons name="arrow-right" size={17} color="#FFFFFF" /></Pressable>}
            <Text style={styles.voiceHint}>{isListening ? "Speak clearly into your microphone" : "Tap the microphone to speak again"}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8F7" },
  topArea: { paddingHorizontal: 15, paddingTop: 9, paddingBottom: 10, backgroundColor: "#FFFFFF" },
  searchBox: { minHeight: 54, borderRadius: 17, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DFE8E2", paddingLeft: 14, paddingRight: 9, flexDirection: "row", alignItems: "center", shadowColor: "#173A27", shadowOpacity: 0.05, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  searchInput: { flex: 1, minWidth: 0, paddingHorizontal: 10, color: "#172238", fontSize: 13 },
  micButton: { width: 38, height: 38, borderRadius: 13, backgroundColor: "#EAF7EF", alignItems: "center", justifyContent: "center" },
  searchHint: { marginTop: 7, marginLeft: 3, color: "#7D8997", fontSize: 11, fontWeight: "500" },
  mapArea: { flex: 1, minHeight: 270, backgroundColor: "#E6EBE7", overflow: "hidden" },
  mapTopControls: { position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  drawButton: { minHeight: 42, paddingHorizontal: 13, borderRadius: 14, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", gap: 7, shadowColor: "#10251A", shadowOpacity: 0.14, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  drawButtonActive: { backgroundColor: "#087D4A" },
  drawButtonText: { color: "#087D4A", fontSize: 12, fontWeight: "800" },
  drawButtonTextActive: { color: "#FFFFFF" },
  clearAreaButton: { backgroundColor: "#FFFFFF", paddingHorizontal: 13, paddingVertical: 10, borderRadius: 12, elevation: 3 },
  clearAreaText: { color: "#5F6C7C", fontSize: 12, fontWeight: "800" },
  drawHint: { position: "absolute", top: 64, alignSelf: "center", backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 6, elevation: 3 },
  drawHintText: { color: "#26374B", fontSize: 11, fontWeight: "700" },
  radiusControl: { position: "absolute", left: 12, bottom: 35, backgroundColor: "#FFFFFF", borderRadius: 15, padding: 10, elevation: 4, shadowColor: "#10251A", shadowOpacity: 0.14, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  radiusTitle: { color: "#778394", fontSize: 8, fontWeight: "900", letterSpacing: 0.8, marginBottom: 7, marginLeft: 2 },
  radiusOptions: { flexDirection: "row", gap: 5 },
  radiusOption: { minWidth: 40, paddingHorizontal: 7, paddingVertical: 7, borderRadius: 9, alignItems: "center", backgroundColor: "#F0F3F1" },
  radiusOptionActive: { backgroundColor: "#087D4A" },
  radiusOptionText: { color: "#526176", fontSize: 10, fontWeight: "800" },
  radiusOptionTextActive: { color: "#FFFFFF" },
  resultsPanel: { backgroundColor: "#F6F8F7", paddingTop: 13, paddingBottom: 10 },
  resultsHeader: { paddingHorizontal: 16, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  resultsTitle: { color: "#172238", fontSize: 16, fontWeight: "900" },
  resultsSubtitle: { color: "#7D8997", fontSize: 11, marginTop: 3, fontWeight: "500" },
  cardsRow: { paddingHorizontal: 15, gap: 10, paddingBottom: 3 },
  projectCard: { width: 252, minHeight: 105, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5EBE7", borderRadius: 15, padding: 12, justifyContent: "space-between" },
  projectCardSelected: { borderColor: "#087D4A", backgroundColor: "#F3FBF6" },
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between" },
  projectName: { color: "#172238", fontSize: 13, fontWeight: "900", flex: 1 },
  cardLocationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 6 },
  projectLocation: { flex: 1, color: "#748195", fontSize: 10, fontWeight: "600" },
  cardBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 7, gap: 8 },
  projectPrice: { color: "#087D4A", fontSize: 11, fontWeight: "900", flex: 1 },
  cardDetails: { color: "#087D4A", fontSize: 10, fontWeight: "800" },
  emptyResults: { minHeight: 80, marginHorizontal: 15, backgroundColor: "#FFFFFF", borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, paddingHorizontal: 14 },
  emptyText: { color: "#667386", fontSize: 11, flexShrink: 1 },
  voiceOverlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.52)", justifyContent: "center", alignItems: "center", padding: 24 },
  voiceCard: { width: "100%", maxWidth: 420, borderRadius: 25, backgroundColor: "#FFFFFF", padding: 22, alignItems: "center" },
  voiceClose: { alignSelf: "flex-end", width: 35, height: 35, borderRadius: 12, backgroundColor: "#F1F5F3", alignItems: "center", justifyContent: "center" },
  voiceTitle: { color: "#172238", fontSize: 18, fontWeight: "900", marginTop: 5, marginBottom: 16 },
  transcriptBox: { width: "100%", minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: "#DDE7E1", backgroundColor: "#F8FAF9", justifyContent: "center", paddingHorizontal: 12 },
  transcriptInput: { color: "#172238", fontSize: 13, paddingVertical: 10 },
  voiceMicWrap: { width: 88, height: 88, alignItems: "center", justifyContent: "center", marginTop: 24 },
  voicePulse: { position: "absolute", width: 78, height: 78, borderRadius: 39, backgroundColor: "rgba(8,125,74,0.15)" },
  voiceMic: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#087D4A", alignItems: "center", justifyContent: "center", elevation: 4 },
  voiceMicActive: { backgroundColor: "#0B9A5B" },
  voiceApply: { minHeight: 46, width: "100%", marginTop: 15, paddingHorizontal: 13, borderRadius: 13, backgroundColor: "#087D4A", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  voiceApplyText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800", flex: 1 },
  voiceHint: { color: "#7D8997", fontSize: 11, marginTop: 15 },
});
