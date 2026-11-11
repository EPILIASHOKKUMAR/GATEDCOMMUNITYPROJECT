import { API_BASE_URL, request } from "./api";

export interface PostPropertyPayload {
  title?: string;
  name?: string;
  property_type?: string;
  price?: number;
  location?: string;
  area?: string;
  description?: string;
  [key: string]: any;
}

export const propertyApi = {
  /**
   * Post/create property in general property listings (/api/v1/endpoints/properties)
   */
  postProperty: (data: PostPropertyPayload) =>
    request(`${API_BASE_URL}/api/v1/endpoints/properties/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Get all listed properties
   */
  getProperties: () =>
    request(`${API_BASE_URL}/api/v1/endpoints/properties/`),

  /**
   * Get property by ID
   */
  getPropertyById: (id: string | number) =>
    request(`${API_BASE_URL}/api/v1/endpoints/properties/${id}`),
};

export default propertyApi;

