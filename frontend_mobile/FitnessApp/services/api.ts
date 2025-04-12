import { BACKEND_API_URL } from "./config";

// services/api.ts
export async function generatePlan(userData: any): Promise<any> {
  try {
    console.log("Sending data to URL :", BACKEND_API_URL);
    console.log("Data to send:", userData);
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      // Try to get details about the error from the response body.
      let errorDetails: string = "";
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson, null, 2);
      } else {
        errorDetails = await response.text();
      }
      
      // Build a detailed error message including status code and details.
      throw new Error(
        `Request failed with status code ${response.status}. ${errorDetails}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
