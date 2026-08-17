import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { attendeesTable } from "./attendees";

export const storiesTable = pgTable("stories", {
  id: serial("id").primaryKey(),
  attendeeId: integer("attendee_id")
    .notNull()
    .references(() => attendeesTable.id),
  responseType: text("response_type").notNull(), // "voice" | "written"
  writtenResponse: text("written_response"),
  voiceDurationSeconds: integer("voice_duration_seconds"),
  promptShown: text("prompt_shown"),
  selectedInterests: jsonb("selected_interests").$type<string[]>(),
  followUpPrompt: text("follow_up_prompt"),
  followUpResponse: text("follow_up_response"),
  sentiment: text("sentiment"),
  detectedTheme: text("detected_theme"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStorySchema = createInsertSchema(storiesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof storiesTable.$inferSelect;
