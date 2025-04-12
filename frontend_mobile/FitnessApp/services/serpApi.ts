import Constants from "expo-constants";

export async function fetchSerpImage(query: string): Promise<string> {
  const apiKey = Constants.expoConfig?.extra?.serp_api_key;
  //   console.log(apiKey);
  if (!apiKey) {
    console.error("API key is not defined in the environment variables.");
    return "";
  }
  const url = `https://serpapi.com/search.json?engine=google_images&google_domain=google.com&hl=en&gl=us&q=${encodeURIComponent(
    query
  )}&api_key=${apiKey}&per_page=1`;

  try {
    console.log("pinging serp api");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`SERP API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.images_results && data.images_results.length > 0) {
      return data.images_results[0].original; // Use the 'original' image URL
    }
    return "";
  } catch (error) {
    console.error("SERP API error:", error);
    return "";
  }
}
