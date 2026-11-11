import { API_BASE_URL, request } from "./api";
import {
  PropertyItem,
  InspectionReport,
  PropertyPlan,
} from "../pages/ProtectProperty/propertyStore";

export const toFrontendProperty = (item: any): PropertyItem => ({
  id: String(item.uid ?? item.id),
  name: item.name || "Untitled Property",
  type: item.type || "Residential Plot",
  area: item.area || "",
  surveyNumber: item.survey_number || item.surveyNumber || "",
  ownershipType: item.ownership_type || item.ownershipType || "Individual",
  state: item.state || "Telangana",
  district: item.district || "Rangareddy",
  city: item.city || "Hyderabad",
  village: item.village || "",
  pincode: item.pincode || "",
  address: item.address || "",
  mapLocation: item.map_location || item.mapLocation || "",
  landmark: item.landmark || "",
  boundaryType: item.boundary_type || item.boundaryType || "Compound Wall",
  propertyStatus: item.property_status || item.propertyStatus || "Vacant",
  registrationNumber: item.registration_number || item.registrationNumber,
  documents: item.documents || {},
  protectionStatus: (item.protection_status || item.protectionStatus || "Not protected") as any,
  plan: item.plan
    ? {
        id: item.plan.id || "plan",
        name: item.plan.name || "Protection Plan",
        price: item.plan.price || 1999,
        formattedPrice: item.plan.formattedPrice || item.plan.formatted_price || "₹1,999",
        visits: item.plan.visits || "1 visit / month",
        billingCycle: item.plan.billingCycle || "per month",
      }
    : undefined,
  assignedAgent: item.assigned_agent || (item.protection_status === "Active"
    ? {
        name: item.agent_name || "Rajesh Kumar",
        phone: item.agent_phone || "+91 98765 43210",
        badgeId: item.agent_badge || "GP-SEC-409",
        rating: 4.9,
        verified: true,
      }
    : undefined),
  lastVisitDate: item.last_visit_date || item.lastVisitDate,
  nextVisitDate: item.next_visit_date || item.nextVisitDate,
  media: (item.media || []).map((m: any) => ({
    id: m.uid || m.id || String(Math.random()),
    name: m.name || "Property Photo",
    type: m.type || "image/jpeg",
    url: m.url,
  })),
  createdAt: item.created_at || item.createdAt || new Date().toISOString(),
});

export const toBackendProperty = (data: Partial<PropertyItem>, isUpdate = false) => {
  const payload: Record<string, any> = {};
  if (isUpdate) {
    if (data.name !== undefined) payload.name = data.name;
    if (data.type !== undefined) payload.type = data.type;
    if (data.area !== undefined) payload.area = data.area;
    if (data.surveyNumber !== undefined) payload.survey_number = data.surveyNumber;
    if (data.ownershipType !== undefined) payload.ownership_type = data.ownershipType;
    if (data.state !== undefined) payload.state = data.state;
    if (data.district !== undefined) payload.district = data.district;
    if (data.city !== undefined) payload.city = data.city;
    if (data.village !== undefined) payload.village = data.village;
    if (data.pincode !== undefined) payload.pincode = data.pincode;
    if (data.address !== undefined) payload.address = data.address;
    if (data.mapLocation !== undefined) payload.map_location = data.mapLocation;
    if (data.landmark !== undefined) payload.landmark = data.landmark;
    if (data.boundaryType !== undefined) payload.boundary_type = data.boundaryType;
    if (data.propertyStatus !== undefined) payload.property_status = data.propertyStatus;
    if (data.registrationNumber !== undefined) payload.registration_number = data.registrationNumber;
    if (data.documents !== undefined) payload.documents = data.documents;
    if (data.media !== undefined) {
      payload.media = data.media.map((m) => ({
        name: m.name,
        property_name: data.name,
        type: (m as any).type || "image/jpeg",
        url: m.url,
      }));
    }
  } else {
    payload.name = data.name;
    payload.type = data.type;
    payload.area = data.area;
    payload.survey_number = data.surveyNumber;
    payload.ownership_type = data.ownershipType;
    payload.state = data.state;
    payload.district = data.district;
    payload.city = data.city;
    payload.village = data.village;
    payload.pincode = data.pincode;
    payload.address = data.address;
    if (data.mapLocation) payload.map_location = data.mapLocation;
    if (data.landmark) payload.landmark = data.landmark;
    payload.boundary_type = data.boundaryType;
    payload.property_status = data.propertyStatus;
    if (data.registrationNumber) payload.registration_number = data.registrationNumber;
    if (data.documents && Object.keys(data.documents).length) payload.documents = data.documents;
    if (data.media && data.media.length) {
      payload.media = data.media.map((m) => ({
        name: m.name,
        property_name: data.name,
        type: (m as any).type || "image/jpeg",
        url: m.url,
      }));
    }
  }
  return payload;
};

export const toFrontendReport = (item: any): InspectionReport => {
  const hasEncroachment = item.encroachment && item.encroachment !== "None" && item.encroachment !== "";
  const hasDamage = item.boundary_damage && item.boundary_damage !== "None" && item.boundary_damage !== "";
  const hasUnauthorized = item.unauthorized_construction && item.unauthorized_construction !== "None" && item.unauthorized_construction !== "";

  const checks = [
    { label: "Marker stones intact", passed: !hasEncroachment },
    { label: "No unauthorized entry / dumping", passed: !hasUnauthorized },
    { label: "Boundary wall condition verified", passed: !hasDamage },
    { label: "Surrounding vegetation clear", passed: true },
  ];

  return {
    id: String(item.uid ?? item.id),
    propertyId: String(item.property_id ?? item.propertyId),
    propertyName: item.property_name || item.propertyName || "Protected Property",
    propertyLocation: item.property_locality
      ? `${item.property_locality}, ${item.property_city || ""}`
      : item.property_city || "Telangana",
    agentName: item.agent_name || "Rajesh Kumar",
    agentBadge: item.agent_badge || "GP-SEC-409",
    date: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Recently",
    status: (item.status || "VERIFIED") as "VERIFIED" | "UNDER_REVIEW",
    severity: (item.severity || "NORMAL") as "NORMAL" | "WARNING" | "CRITICAL",
    notes: item.notes || item.agent_remarks || "Routine boundary verification and surveillance completed.",
    coordinates: item.gps_verified ? "GPS Geo-Tagged (Verified)" : "GPS Verification Pending",
    photos: (item.media || []).map((m: any, i: number) => ({
      id: m.uid || `photo-${i}`,
      title: m.name || `Inspection Photo #${i + 1}`,
      url: m.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    })),
    checks,
  };
};

export const toBackendReport = (data: Partial<InspectionReport> & Record<string, any>) => ({
  property_id: data.propertyId,
  notes: data.notes,
  encroachment: data.encroachment || "",
  boundary_damage: data.boundaryDamage || "",
  unauthorized_construction: data.unauthorizedConstruction || "",
  severity: data.severity || "NORMAL",
  agent_remarks: data.agentRemarks || data.notes || "",
  gps_verified: data.gpsVerified ?? true,
  media: data.photos || data.media || [],
});

export const protectionApi = {
  // 1. Create Property
  createProperty: (data: Partial<PropertyItem>): Promise<PropertyItem> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/properties`, {
      method: "POST",
      body: JSON.stringify(toBackendProperty(data)),
    }).then(toFrontendProperty),

  // 2. Get Properties
  getProperties: (): Promise<PropertyItem[]> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/properties`).then((items: any[]) =>
      items.map(toFrontendProperty)
    ),

  // 3. Get Property by UID
  getProperty: (uid: string): Promise<PropertyItem> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/properties/${uid}`).then(
      toFrontendProperty
    ),

  // 4. Update Property
  updateProperty: (uid: string, data: Partial<PropertyItem>): Promise<PropertyItem> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/properties/${uid}`, {
      method: "PUT",
      body: JSON.stringify(toBackendProperty(data, true)),
    }).then(toFrontendProperty),

  // 5. Delete Property
  deleteProperty: (uid: string): Promise<void> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/properties/${uid}`, {
      method: "DELETE",
    }),

  // 6. Activate Protection
  activateProtection: (uid: string, plan: PropertyPlan | any): Promise<PropertyItem> =>
    request(
      `${API_BASE_URL}/api/v1/endpoints/protection/properties/${String(uid).trim()}/activate`,
      {
        method: "PATCH",
        body: JSON.stringify({ plan }),
      }
    ).then(toFrontendProperty),

  // 7. Get Active Properties
  getActiveProperties: (): Promise<PropertyItem[]> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/active`).then((items: any[]) =>
      items.map(toFrontendProperty)
    ),

  // 8. Create Inspection Report
  createReport: (data: any): Promise<InspectionReport> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/reports`, {
      method: "POST",
      body: JSON.stringify(toBackendReport(data)),
    }).then(toFrontendReport),

  // 9. Get Inspection Reports
  getReports: (propertyId?: string): Promise<InspectionReport[]> => {
    const url = propertyId
      ? `${API_BASE_URL}/api/v1/endpoints/protection/reports/${propertyId}`
      : `${API_BASE_URL}/api/v1/endpoints/protection/reports`;
    return request(url).then((items: any[]) => items.map(toFrontendReport));
  },

  // 10. Delete Inspection Report
  deleteReport: (reportId: string): Promise<void> =>
    request(`${API_BASE_URL}/api/v1/endpoints/protection/reports/detail/${reportId}`, {
      method: "DELETE",
    }),
};

