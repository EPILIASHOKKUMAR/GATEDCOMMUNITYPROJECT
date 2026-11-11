## Author : Preetham Lanka
## Date : 11th November 2026
# API Architecture & Integration Pattern

## 1. Overview & Philosophy

This application connects to the GatedPlus backend services using a modular, decoupled API architecture. All endpoints are strongly typed, handle authentication headers, and provide bidirectional transformations between backend `snake_case` payloads and frontend `camelCase` models.

The store layer uses an **Optimistic & Resilient Fallback Pattern**:
- When the backend is reachable, live data is fetched, created, and mutated on the server.
- If the network is offline or the backend is in local development mode, the store gracefully falls back to local cached state without breaking or crashing the mobile UI.

---

## 2. Environment Configuration

All API requests rely on Expo's public environment variable loaded from `.env`:

```ini
# .env
EXPO_PUBLIC_API_URL=https://api.gatedplus.com
```

In code, this is accessed via:
```ts
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "https://api.gatedplus.com"
).replace(/\/$/, "");
```

---

## 3. Directory Structure

```
src/api/
├── api.ts              # Core HTTP request client, auth headers, and token management
├── protectionApi.ts    # "Protect My Property" endpoints, mappers, and TypeScript models
├── propertyApi.ts      # General property marketplace endpoints (postProperty, etc.)
└── index.ts            # Central barrel export for all APIs
```

---

## 4. Core Components & What Was Built

### 4.1 Base Request Client (`src/api/api.ts`)
- **`getAuthHeaders()`**: Automatically injects `Authorization: Bearer <token>` from the in-memory token manager, `globalThis`, or `localStorage` (when running on web).
- **`setAuthToken(token)`** / **`getAuthToken()`**: Clean token setter/getter for login & logout workflows.
- **`request<T>(endpointOrUrl, options)`**:
  - Automatically prepends `API_BASE_URL` when passed a relative route.
  - Merges default authentication and `Content-Type: application/json` headers.
  - Automatically decodes JSON errors or raw response text on non-2xx status codes.
  - Correctly handles `204 No Content` responses without throwing JSON parse errors.

```ts
import { request } from "@/api/api";

const data = await request<MyResponseType>("/api/v1/endpoints/my-resource", {
  method: "POST",
  body: JSON.stringify(payload),
});
```

---

### 4.2 Protection API (`src/api/protectionApi.ts`)
Ported and adapted from the web reference (`protectionApi.js`), providing full CRUD for property safety:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/endpoints/protection/properties` | Create new property for surveillance |
| `GET` | `/api/v1/endpoints/protection/properties` | Fetch all user's protected/registered properties |
| `GET` | `/api/v1/endpoints/protection/properties/{uid}` | Fetch details of a specific property |
| `PUT` | `/api/v1/endpoints/protection/properties/{uid}` | Update property information |
| `DELETE` | `/api/v1/endpoints/protection/properties/{uid}` | Remove a property record |
| `PATCH` | `/api/v1/endpoints/protection/properties/{uid}/activate` | Activate protection plan (Weekly / Monthly) |
| `GET` | `/api/v1/endpoints/protection/active` | Fetch all properties with active guard status |
| `POST` | `/api/v1/endpoints/protection/reports` | Submit field audit inspection report |
| `GET` | `/api/v1/endpoints/protection/reports` | Fetch all inspection audit logs |
| `GET` | `/api/v1/endpoints/protection/reports/{propertyId}` | Fetch audit logs scoped to a single property |
| `DELETE` | `/api/v1/endpoints/protection/reports/detail/{reportId}` | Delete an inspection report |

#### Bidirectional Mappers:
- `toFrontendProperty(item)`: Maps backend `uid`, `survey_number`, `boundary_type`, `protection_status`, etc. into strongly typed `PropertyItem`.
- `toBackendProperty(data, isUpdate)`: Converts frontend `PropertyItem` fields into the snake_case payload expected by the FastAPI/Django backend.
- `toFrontendReport(item)`: Maps backend audit logs into `InspectionReport` objects, computing checklist verification states.
- `toBackendReport(data)`: Prepares audit submissions for backend ingestion.

---

### 4.3 General Property API (`src/api/propertyApi.ts`)
Ported from `propertyapi.js` for general listings:
- `postProperty(data)`: `POST /api/v1/endpoints/properties/`
- `getProperties()`: `GET /api/v1/endpoints/properties/`
- `getPropertyById(id)`: `GET /api/v1/endpoints/properties/{id}`

---

## 5. UI Integration & Store Pattern (`usePropertyStore`)

UI screens do **not** call raw fetch requests directly inside JSX. Instead, they interact via the reactive store in `src/pages/ProtectProperty/propertyStore.ts`:

```tsx
import { usePropertyStore } from "@/pages/ProtectProperty/propertyStore";

export function MyScreen() {
  const { properties, reports, loading, refresh, addProperty, deleteProperty, activatePlan } = usePropertyStore();

  const handleSave = async (data) => {
    const saved = await addProperty(data); // Sends API request and updates state
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* UI components */}
    </ScrollView>
  );
}
```

### Store Lifecycle:
1. **Mount**: Synchronously initializes with default state, then triggers an async background sync with `fetchProperties()` and `fetchReports()`.
2. **Mutations**: `addProperty`, `activatePlan`, and `deleteProperty` invoke the respective `protectionApi` endpoints.
3. **Pull-to-Refresh**: Every list screen (`ListProperty`, `SavedProperties`, `ActiveProtection`, `PropertyReports`) includes `<RefreshControl>` wired to `refresh()`.

---

## 6. How to Follow This Pattern for New Features

When adding new backend endpoints or modules (e.g. `communityApi`, `referralApi`, `userApi`), follow these 5 steps:

### Step 1: Define Models & Types
Create TypeScript interfaces matching both frontend domain models and API responses.

```ts
export interface CommunityEvent {
  id: string;
  title: string;
  eventDate: string;
  location: string;
}
```

### Step 2: Create the API Module in `src/api/`
Create a new file (e.g., `src/api/communityApi.ts`):

```ts
import { API_BASE_URL, request } from "./api";
import { CommunityEvent } from "@/types";

export const toFrontendEvent = (item: any): CommunityEvent => ({
  id: String(item.id || item.uid),
  title: item.title,
  eventDate: item.event_date,
  location: item.location,
});

export const communityApi = {
  getEvents: (): Promise<CommunityEvent[]> =>
    request(`${API_BASE_URL}/api/v1/endpoints/community/events`).then((items) =>
      items.map(toFrontendEvent)
    ),

  createEvent: (data: Partial<CommunityEvent>): Promise<CommunityEvent> =>
    request(`${API_BASE_URL}/api/v1/endpoints/community/events`, {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        event_date: data.eventDate,
        location: data.location,
      }),
    }).then(toFrontendEvent),
};
```

### Step 3: Export from `src/api/index.ts`
```ts
export * from "./api";
export * from "./protectionApi";
export * from "./propertyApi";
export * from "./communityApi"; // Add new export here
```

### Step 4: Wire to Store or Screen Hook
Provide graceful error handling and local state synchronization.

```ts
try {
  const events = await communityApi.getEvents();
  setEvents(events);
} catch (err) {
  console.warn("communityApi.getEvents failed, using cache:", err);
}
```

### Step 5: Verify with TypeScript & Linter
Always run before submitting code:
```bash
npx tsc --noEmit
npx eslint "src/api/**/*.{ts,tsx}"
```

