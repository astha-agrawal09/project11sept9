// fakeData.js
import axios from "axios";
import { faker } from "@faker-js/faker";

// Strapi API URL
const API_URL = "http://localhost:1337/api/businesses";

// Number of records
const TOTAL = 30000;

// Strapi token (replace with your actual admin/user token if auth required)
const STRAPI_TOKEN = ""; // e.g. "Bearer eyJhbGciOi..." or leave empty if public

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN && { Authorization: STRAPI_TOKEN }),
  },
});

// Helper to generate a fake business
function generateBusiness() {
  return {
    name: faker.company.name()
  };
}

// Insert businesses in batches
async function insertBusinesses() {
  const batchSize = 100; // adjust batch size if server struggles
  let created = 0;

  for (let i = 0; i < TOTAL; i += batchSize) {
    const batch = [];
    for (let j = 0; j < batchSize; j++) {
      if (i + j >= TOTAL) break;
      batch.push({ data: generateBusiness() });
    }

    try {
      await Promise.all(batch.map((b) => api.post("", b)));
      created += batch.length;
      console.log(`Inserted: ${created}/${TOTAL}`);
    } catch (err) {
      console.error("Error inserting batch:", err.response?.data || err.message);
      process.exit(1);
    }
  }

  console.log("✅ Done inserting businesses!");
}

insertBusinesses();
