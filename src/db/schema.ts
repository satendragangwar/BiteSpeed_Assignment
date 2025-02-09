import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 256 }), // Changed to camelCase
  email: varchar("email", { length: 256 }),
  linkedId: serial("linkedId"), // Changed to camelCase
  linkPrecedence: varchar("linkPrecedence", { length: 256 }) // Changed to camelCase
    .notNull()
    .$type<"primary" | "secondary">(),
  createdAt: timestamp("createdAt").defaultNow().notNull(), // Changed to camelCase
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), // Changed to camelCase
  deletedAt: timestamp("deletedAt"), // Changed to camelCase
});