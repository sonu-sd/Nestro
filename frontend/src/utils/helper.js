import axios from "axios";

const client = axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, 
  withCredentials:true

});
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

/**
 * Convert text into a URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
function generateSlug(text) {
    return text
        .trim()                                // Remove extra spaces
        .toLowerCase()                         // Convert to lowercase
        .normalize("NFD")                      // Separate accented characters
        .replace(/[\u0300-\u036f]/g, "")       // Remove accents
        .replace(/[^a-z0-9\s-]/g, "")          // Remove special characters
        .replace(/\s+/g, "-")                  // Replace spaces with hyphens
        .replace(/-+/g, "-")                   // Remove duplicate hyphens
        .replace(/^-|-$/g, "");                // Remove leading/trailing hyphens
}

export { client, generateSlug };