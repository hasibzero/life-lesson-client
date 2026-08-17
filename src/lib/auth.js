import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME );

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
   emailAndPassword: { 
    enabled: true, 
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: "user", // Default role for new users
      },
      isBlocked: {
        defaultValue: false, // Default blocked status for new users
      },
      plan: {
        defaultValue: "free", // Default blocked status for new users
      },
      // Add any additional fields you want to store in the user object here
    },
  }
});