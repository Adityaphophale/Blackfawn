export interface BusinessInfo {
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  cityState: string;
  fullAddress: string;
  email: string;
  phone: string;
  mapsUrl: string;
}

export const BRAND_LOGO = "/logo.jpg";
export const BRAND_FAVICON = "/favicon.jpg";

export const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  name: "BLACKFAWN",
  addressLine1: "Office No. 413, 4th Floor,",
  addressLine2: "Siddhivinayak Arcus,",
  addressLine3: "Bhayli Road,",
  cityState: "Bhayli, Vadodara.",
  fullAddress: `Office No. 413, 4th Floor,\nSiddhivinayak Arcus,\nBhayli Road,\nBhayli, Vadodara.`,
  email: "info@blackfawn.in",
  phone: "+91 9274821162",
  mapsUrl: "https://maps.google.com/?q=Office+No.+413,+4th+Floor,+Siddhivinayak+Arcus,+Bhayli+Road,+Bhayli,+Vadodara"
};

