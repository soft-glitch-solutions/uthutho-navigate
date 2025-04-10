
/**
 * Utility functions for Google Maps URL parsing
 */

/**
 * Parse a Google Maps URL to extract latitude and longitude coordinates
 * Handles various formats of Google Maps URLs
 */
export function parseGoogleMapsUrl(url: string): { latitude: number | null, longitude: number | null } {
  let latitude: number | null = null;
  let longitude: number | null = null;
  
  try {
    // Try to match the URL to extract coordinates
    
    // Format: https://www.google.com/maps/place/Location+Name/@-33.9248685,18.4240553,16z/
    // Or: https://maps.google.com/maps?q=-33.9248685,18.4240553
    // Or: https://goo.gl/maps/abcdefg with query parameters
    const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const regex2 = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    
    let match = url.match(regex1) || url.match(regex2);
    
    if (match && match.length >= 3) {
      latitude = parseFloat(match[1]);
      longitude = parseFloat(match[2]);
    } else {
      // Handle URLs like: https://www.google.com/maps?q=location
      // We can't extract coordinates from these directly
      console.warn("Could not extract coordinates from Google Maps URL");
    }
    
  } catch (error) {
    console.error("Error parsing Google Maps URL:", error);
  }
  
  return { latitude, longitude };
}

/**
 * Generate a Google Maps URL from latitude and longitude
 */
export function generateGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/place/${latitude},${longitude}`;
}

/**
 * Extract the location name from a Google Maps URL if possible
 */
export function extractLocationNameFromUrl(url: string): string | null {
  try {
    // Try to extract location name from URL
    // Format: https://www.google.com/maps/place/Location+Name/
    const regex = /maps\/place\/([^/@]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      // Replace plus signs with spaces and decode URL components
      return decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
  } catch (error) {
    console.error("Error extracting location name:", error);
  }
  
  return null;
}
