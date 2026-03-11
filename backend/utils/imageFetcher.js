import fetch from 'node-fetch';

/**
 * Fetches a high-quality food image from Unsplash.
 * @param {string} query - The food name or restaurant style to search for.
 * @returns {Promise<string>} - The image URL.
 */
export const fetchFoodImage = async (query) => {
  try {
    // We'll use a public search endpoint or a placeholder logic if no key is provided
    // For production, the user should provide an UNSPLASH_ACCESS_KEY
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      // Use a working generic static food image from unsplash as a safe fallback
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
    }

    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&orientation=landscape&per_page=1`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
  } catch (error) {
    console.error("Image Fetcher Error:", error);
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"; // Ultimate fallback
  }
};
