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
      throw new Error("Network response was not OK");
    }
    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
