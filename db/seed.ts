import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // No seed data required for this application
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
