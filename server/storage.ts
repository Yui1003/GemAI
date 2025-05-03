// This file contains the storage interface for the application
// Since we don't need database operations for this application, 
// we're just providing a simple empty implementation

import { db } from "@db";

export const storage = {
  // We don't need to store anything for this application as we're just
  // proxying requests to OpenRouter API and returning responses directly
};
