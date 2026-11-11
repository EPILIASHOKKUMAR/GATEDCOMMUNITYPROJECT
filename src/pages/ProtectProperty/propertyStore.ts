import { useState, useEffect, useCallback } from "react";
import { protectionApi } from "@/api/protectionApi";

export interface PropertyPlan {
  id: string;
  name: string;
  tag: string;
  visits: string;
  price: number;
  formattedPrice: string;
  billingCycle: string;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  formattedTotal: string;
  frequencyText: string;
  description: string;
  benefits: string[];
}

export interface AssignedAgent {
  name: string;
  phone: string;
  badgeId: string;
  rating: number;
  verified: boolean;
}

export interface PropertyItem {
  id: string;
  name: string;
  type: string;
  area: string;
  surveyNumber: string;
  registrationNumber?: string;
  ownershipType: string;
  boundaryType: string;
  propertyStatus: string;
  state: string;
  district: string;
  city: string;
  village: string;
  pincode: string;
  address: string;
  landmark?: string;
  mapLocation?: string;
  protectionStatus: "Active" | "Pending" | "Not protected";
  plan?: {
    id: string;
    name: string;
    price: number;
    formattedPrice: string;
    visits: string;
    billingCycle?: string;
  };
  assignedAgent?: AssignedAgent;
  lastVisitDate?: string;
  nextVisitDate?: string;
  createdAt: string;
  documents?: Record<string, string[]>;
  media?: { id: string; name: string; url: string }[];
}

export interface InspectionReport {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
  agentName: string;
  agentBadge: string;
  date: string;
  status: "VERIFIED" | "UNDER_REVIEW";
  severity: "NORMAL" | "WARNING" | "CRITICAL";
  notes: string;
  coordinates: string;
  photos: { id: string; title: string; url: string }[];
  checks: { label: string; passed: boolean }[];
}

export const PROTECTION_PLANS: PropertyPlan[] = [
  {
    id: "weekly",
    name: "Weekly Plan",
    tag: "Most Popular",
    visits: "4 visits / month",
    price: 4999,
    formattedPrice: "₹4,999",
    billingCycle: "per month",
    gstPercentage: 18,
    gstAmount: 899.82,
    totalAmount: 5898.82,
    formattedTotal: "₹5,899",
    frequencyText: "Weekly physical inspection (every 7 days)",
    description:
      "Ideal for high-value open land, active construction boundaries, and properties requiring regular monitoring.",
    benefits: [
      "4 physical on-ground inspections / month",
      "High-res photo & video verification",
      "GPS geo-tagged audit report for every visit",
      "Assigned dedicated field inspection agent",
      "Boundary wall & encroachment checks",
      "Instant security alert notifications",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    tag: "Standard",
    visits: "1 visit / month",
    price: 1999,
    formattedPrice: "₹1,999",
    billingCycle: "per month",
    gstPercentage: 18,
    gstAmount: 359.82,
    totalAmount: 2358.82,
    formattedTotal: "₹2,359",
    frequencyText: "Monthly physical inspection (every 30 days)",
    description:
      "Perfect for long-term farm land, rural plots, and general boundary monitoring.",
    benefits: [
      "1 physical on-ground inspection / month",
      "Photo & video inspection report",
      "GPS geo-tagged audit log",
      "Assigned dedicated field agent",
      "Boundary wall condition verification",
      "Standard email & SMS audit reports",
    ],
  },
];

const INITIAL_PROPERTIES: PropertyItem[] = [
  {
    id: "prop-1",
    name: "Silver Valley Villa Plot",
    type: "Residential Plot",
    area: "1,200 Sq. Yards",
    surveyNumber: "SY-482/2B",
    registrationNumber: "REG-2023-TS-9812",
    ownershipType: "Individual",
    boundaryType: "Compound Wall",
    propertyStatus: "Vacant",
    state: "Telangana",
    district: "Rangareddy",
    city: "Hyderabad",
    village: "Mokila",
    pincode: "501503",
    address: "Plot 42, Sector 3, Silver Valley Enclave, Mokila",
    landmark: "Near Indus International School",
    mapLocation: "17.4435° N, 78.3772° E",
    protectionStatus: "Active",
    plan: {
      id: "weekly",
      name: "Weekly Plan",
      price: 4999,
      formattedPrice: "₹4,999",
      visits: "4 visits / month",
    },
    assignedAgent: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      badgeId: "GP-SEC-409",
      rating: 4.9,
      verified: true,
    },
    lastVisitDate: "Yesterday, 11:30 AM",
    nextVisitDate: "Nov 18, 2026",
    createdAt: "2026-09-15T10:00:00Z",
  },
  {
    id: "prop-2",
    name: "Kondapur Farm Land",
    type: "Farm Land",
    area: "2.5 Acres",
    surveyNumber: "SY-118/A",
    registrationNumber: "REG-2022-TS-4410",
    ownershipType: "Joint Ownership",
    boundaryType: "Fencing",
    propertyStatus: "Agricultural Use",
    state: "Telangana",
    district: "Rangareddy",
    city: "Hyderabad",
    village: "Kondapur",
    pincode: "500084",
    address: "Survey No 118, Near Lake View Road, Kondapur",
    landmark: "Behind Botanical Gardens",
    mapLocation: "17.4589° N, 78.3512° E",
    protectionStatus: "Active",
    plan: {
      id: "monthly",
      name: "Monthly Plan",
      price: 1999,
      formattedPrice: "₹1,999",
      visits: "1 visit / month",
    },
    assignedAgent: {
      name: "Vikram Reddy",
      phone: "+91 94401 23456",
      badgeId: "GP-SEC-312",
      rating: 4.8,
      verified: true,
    },
    lastVisitDate: "Nov 04, 2026",
    nextVisitDate: "Dec 04, 2026",
    createdAt: "2026-10-01T08:30:00Z",
  },
  {
    id: "prop-3",
    name: "Shamshabad Highway Land",
    type: "Open Land",
    area: "3,500 Sq. Yards",
    surveyNumber: "SY-204/C",
    registrationNumber: "REG-2024-TS-1102",
    ownershipType: "Individual",
    boundaryType: "Open Boundary",
    propertyStatus: "Vacant",
    state: "Telangana",
    district: "Rangareddy",
    city: "Shamshabad",
    village: "Rallaguda",
    pincode: "501218",
    address: "Survey 204, Airport Approach Road",
    landmark: "Opposite Decathlon Shamshabad",
    mapLocation: "17.2403° N, 78.4294° E",
    protectionStatus: "Not protected",
    createdAt: "2026-11-02T14:15:00Z",
  },
];

const INITIAL_REPORTS: InspectionReport[] = [
  {
    id: "rep-101",
    propertyId: "prop-1",
    propertyName: "Silver Valley Villa Plot",
    propertyLocation: "Mokila, Hyderabad",
    agentName: "Rajesh Kumar",
    agentBadge: "GP-SEC-409",
    date: "Yesterday, 11:30 AM",
    status: "VERIFIED",
    severity: "NORMAL",
    notes:
      "All boundary pillars verified and stable. No sign of illegal intrusion, debris dumping, or encroachment. Fencing along northern edge is fully secure.",
    coordinates: "17.4435° N, 78.3772° E (±3m accuracy)",
    photos: [
      {
        id: "p1",
        title: "Main Entrance & Marker Stone",
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "p2",
        title: "Northern Boundary Wall",
        url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80",
      },
    ],
    checks: [
      { label: "Marker stones intact", passed: true },
      { label: "No unauthorized entry / dumping", passed: true },
      { label: "Boundary wall condition verified", passed: true },
      { label: "Surrounding vegetation clear", passed: true },
    ],
  },
  {
    id: "rep-102",
    propertyId: "prop-2",
    propertyName: "Kondapur Farm Land",
    propertyLocation: "Kondapur, Hyderabad",
    agentName: "Vikram Reddy",
    agentBadge: "GP-SEC-312",
    date: "Nov 04, 2026, 03:15 PM",
    status: "UNDER_REVIEW",
    severity: "WARNING",
    notes:
      "Minor debris and construction soil noticed deposited near eastern perimeter wire fencing. Alert submitted to neighboring developer for removal.",
    coordinates: "17.4589° N, 78.3512° E (±4m accuracy)",
    photos: [
      {
        id: "p3",
        title: "Eastern Perimeter Wire Fencing",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
      },
    ],
    checks: [
      { label: "Marker stones intact", passed: true },
      { label: "No unauthorized entry", passed: true },
      { label: "Boundary wall condition verified", passed: false },
      { label: "Debris / Encroachment check", passed: false },
    ],
  },
];

// Reactive singleton state
let propertiesState: PropertyItem[] = [...INITIAL_PROPERTIES];
let reportsState: InspectionReport[] = [...INITIAL_REPORTS];
let hasInitializedFromApi = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const propertyStore = {
  getProperties: () => propertiesState,
  getReports: () => reportsState,

  fetchProperties: async (): Promise<PropertyItem[]> => {
    try {
      const serverProperties = await protectionApi.getProperties();
      if (Array.isArray(serverProperties) && serverProperties.length > 0) {
        propertiesState = serverProperties;
        notify();
        return serverProperties;
      }
    } catch (err) {
      console.warn("Backend protection API getProperties failed, using local/cached state:", err);
    }
    return propertiesState;
  },

  fetchReports: async (propertyId?: string): Promise<InspectionReport[]> => {
    try {
      const serverReports = await protectionApi.getReports(propertyId);
      if (Array.isArray(serverReports) && serverReports.length > 0) {
        if (propertyId) {
          // Merge scoped reports
          const otherReports = reportsState.filter((r) => r.propertyId !== propertyId);
          reportsState = [...serverReports, ...otherReports];
        } else {
          reportsState = serverReports;
        }
        notify();
        return serverReports;
      }
    } catch (err) {
      console.warn("Backend protection API getReports failed, using local/cached state:", err);
    }
    return reportsState;
  },

  addProperty: async (
    property: Omit<PropertyItem, "id" | "createdAt" | "protectionStatus"> & Partial<PropertyItem>
  ): Promise<PropertyItem> => {
    let saved: PropertyItem;
    try {
      saved = await protectionApi.createProperty(property);
    } catch (err) {
      console.warn("Backend protectionApi.createProperty failed, using local fallback:", err);
      saved = {
        ...property,
        id: property.id || `prop-${Date.now()}`,
        createdAt: property.createdAt || new Date().toISOString(),
        protectionStatus: property.protectionStatus || "Not protected",
      } as PropertyItem;
    }

    propertiesState = [saved, ...propertiesState];
    notify();
    return saved;
  },

  updateProperty: async (id: string, updates: Partial<PropertyItem>): Promise<void> => {
    try {
      const updated = await protectionApi.updateProperty(id, updates);
      propertiesState = propertiesState.map((p) => (p.id === id ? updated : p));
    } catch (err) {
      console.warn("Backend protectionApi.updateProperty failed, updating locally:", err);
      propertiesState = propertiesState.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
    }
    notify();
  },

  deleteProperty: async (id: string): Promise<void> => {
    try {
      await protectionApi.deleteProperty(id);
    } catch (err) {
      console.warn("Backend protectionApi.deleteProperty failed, deleting locally:", err);
    }
    propertiesState = propertiesState.filter((p) => p.id !== id);
    reportsState = reportsState.filter((r) => r.propertyId !== id);
    notify();
  },

  activatePlan: async (propertyId: string, plan: PropertyPlan): Promise<void> => {
    const prop = propertiesState.find((p) => p.id === propertyId);
    if (!prop) return;

    try {
      const activated = await protectionApi.activateProtection(propertyId, plan);
      propertiesState = propertiesState.map((p) =>
        p.id === propertyId ? activated : p
      );
    } catch (err) {
      console.warn("Backend activateProtection failed, applying locally:", err);
      const assignedAgent: AssignedAgent = {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        badgeId: `GP-SEC-${Math.floor(100 + Math.random() * 900)}`,
        rating: 4.9,
        verified: true,
      };

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (plan.id === "weekly" ? 7 : 30));

      propertiesState = propertiesState.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              protectionStatus: "Active",
              plan: {
                id: plan.id,
                name: plan.name,
                price: plan.price,
                formattedPrice: plan.formattedPrice,
                visits: plan.visits,
                billingCycle: plan.billingCycle,
              },
              assignedAgent,
              lastVisitDate: "Scheduled soon",
              nextVisitDate: nextDate.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : p
      );
    }
    notify();
  },

  addReport: async (report: any): Promise<InspectionReport> => {
    let created: InspectionReport;
    try {
      created = await protectionApi.createReport(report);
    } catch (err) {
      console.warn("Backend createReport failed, saving locally:", err);
      created = report;
    }
    reportsState = [created, ...reportsState];
    notify();
    return created;
  },
};

export function usePropertyStore() {
  const [properties, setProperties] = useState<PropertyItem[]>(propertiesState);
  const [reports, setReports] = useState<InspectionReport[]>(reportsState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = () => {
      setProperties([...propertiesState]);
      setReports([...reportsState]);
    };
    listeners.add(handler);

    // Initial background sync with backend if not already done
    if (!hasInitializedFromApi) {
      hasInitializedFromApi = true;
      Promise.all([
        propertyStore.fetchProperties(),
        propertyStore.fetchReports(),
      ]).catch(() => {});
    }

    return () => {
      listeners.delete(handler);
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        propertyStore.fetchProperties(),
        propertyStore.fetchReports(),
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    properties,
    reports,
    loading,
    refresh,
    fetchProperties: propertyStore.fetchProperties,
    fetchReports: propertyStore.fetchReports,
    addProperty: propertyStore.addProperty,
    updateProperty: propertyStore.updateProperty,
    deleteProperty: propertyStore.deleteProperty,
    activatePlan: propertyStore.activatePlan,
    addReport: propertyStore.addReport,
  };
}
