import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const attendeesTable = pgTable("attendees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  mobileVerified: boolean("mobile_verified").notNull().default(false),
  businessType: text("business_type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAttendeeSchema = createInsertSchema(attendeesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAttendee = z.infer<typeof insertAttendeeSchema>;
export type Attendee = typeof attendeesTable.$inferSelect;
