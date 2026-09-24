const pickCity = (result) =>
  result.city || result.town || result.village || result.municipality || result.county || "";

export const reverseGeocode = async (req, res) => {
  const latitude = Number(req.query.lat);
  const longitude = Number(req.query.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 ||
      !String(req.query.lat ?? "").trim() || !String(req.query.lon ?? "").trim()) {
    return res.status(400).json({ success: false, message: "Valid coordinates are required." });
  }

  if (!process.env.GEOAPIFY_API_KEY) {
    return res.status(503).json({ success: false, message: "Location lookup is not configured. Enter your address manually." });
  }

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
    url.search = new URLSearchParams({
      lat: String(latitude), lon: String(longitude), format: "json",
      lang: "en", limit: "1", apiKey: process.env.GEOAPIFY_API_KEY,
    }).toString();
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
    const data = await response.json();
    const result = data.results?.[0];
    if (!result || result.country_code?.toLowerCase() !== "in") {
      return res.status(422).json({ success: false, message: "We could not find an address in India here. Enter it manually." });
    }

    return res.json({
      success: true,
      address: {
        adressLine: [result.housenumber, result.street || result.address_line1 || result.suburb]
          .filter(Boolean).join(", "),
        city: pickCity(result),
        state: result.state || "",
        pincode: /^\d{6}$/.test(result.postcode || "") ? result.postcode : "",
      },
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    return res.status(502).json({ success: false, message: "Location lookup is unavailable. Enter your address manually." });
  }
};
