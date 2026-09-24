import axios from "axios";

const client = axios.create({
  baseURL:
    typeof window === "undefined"
      ? `${(process.env.API_ORIGIN || "http://localhost:5000").replace(/\/$/, "")}/api`
      : "/api",
  timeout: 10000,
  withCredentials: true,
});

/**
 * Convert text into a URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
function generateSlug(text) {
  return text
    .trim() // Remove extra spaces
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Separate accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export { client, generateSlug };
