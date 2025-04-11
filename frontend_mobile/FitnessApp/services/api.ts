import { BACKEND_DOMAIN_URL } from "./config";

// services/api.ts
export async function generatePlan(userData: any): Promise<any> {
    try {
        console.log(userData);
        console.log(`getting from ${BACKEND_DOMAIN_URL}`);
    //     const response = await fetch(BACKEND_DOMAIN_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(userData),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Network response was not OK');
    //   }
    //   return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
  