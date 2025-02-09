import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phoneNumber", { length: 256 }), 
  email: varchar("email", { length: 256 }),
  linkedId: serial("linkedId"), 
  linkPrecedence: varchar("linkPrecedence", { length: 256 }) 
    .notNull()
    .$type<"primary" | "secondary">(),
  createdAt: timestamp("createdAt").defaultNow().notNull(), 
  updatedAt: timestamp("updatedAt").defaultNow().notNull(), 
  deletedAt: timestamp("deletedAt"), 
});