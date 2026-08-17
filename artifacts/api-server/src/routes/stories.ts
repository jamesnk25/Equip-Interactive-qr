import { Router, type IRouter } from "express";
import {
  CreateStoryBody,
  CreateStoryResponse,
  ListStoriesResponse,
  AddFollowUpParams,
  AddFollowUpBody,
  AddFollowUpResponse,
} from "@workspace/api-zod";
import { db, storiesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

const THEME_KEYWORDS: Array<[string, string[]]> = [
  ["Labor & Workforce", ["labor", "hiring", "crew", "people", "workforce", "staff", "headcount", "workers"]],
  ["Business Growth", ["grow", "growth", "scale", "expand", "revenue", "customers"]],
  ["Equipment Productivity", ["equipment", "machine", "productivity", "automation", "autonomous", "mower"]],
  ["Fleet Costs", ["fleet", "maintenance", "fuel", "truck"]],
  ["Financing", ["financing", "finance", "loan", "capital", "cost", "price"]],
  ["Technology Adoption", ["technology", "software", "tech", "app", "smart", "battery", "electric"]],
];

const POSITIVE = ["love", "great", "excited", "amazing", "impressed", "helpful", "best"];
const NEGATIVE = ["hard", "harder", "problem", "impossible", "struggle", "barrier", "can't", "cant", "frustrat", "expensive"];

function analyze(text: string | null | undefined, interests: string[] | null | undefined) {
  const lower = (text ?? "").toLowerCase();
  let detectedTheme: string | null = null;
  for (const [theme, words] of THEME_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) {
      detectedTheme = theme;
      break;
    }
  }
  if (!detectedTheme && interests && interests.length > 0) {
    detectedTheme = interests[0] ?? null;
  }
  let sentiment: string = "neutral";
  if (POSITIVE.some((w) => lower.includes(w))) sentiment = "positive";
  if (NEGATIVE.some((w) => lower.includes(w))) sentiment = "negative";
  return { detectedTheme, sentiment: lower ? sentiment : null };
}

function toApi(s: typeof storiesTable.$inferSelect) {
  return {
    id: s.id,
    attendeeId: s.attendeeId,
    responseType: s.responseType,
    writtenResponse: s.writtenResponse,
    voiceDurationSeconds: s.voiceDurationSeconds,
    promptShown: s.promptShown,
    selectedInterests: s.selectedInterests,
    followUpPrompt: s.followUpPrompt,
    followUpResponse: s.followUpResponse,
    sentiment: s.sentiment,
    detectedTheme: s.detectedTheme,
    createdAt: s.createdAt.toISOString(),
  };
}

router.post("/stories", async (req, res) => {
  const parsed = CreateStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid story" });
    return;
  }
  const { detectedTheme, sentiment } = analyze(
    parsed.data.writtenResponse,
    parsed.data.selectedInterests,
  );
  const [row] = await db
    .insert(storiesTable)
    .values({ ...parsed.data, detectedTheme, sentiment })
    .returning();
  res.status(201).json(CreateStoryResponse.parse(toApi(row!)));
});

router.get("/stories", async (_req, res) => {
  const rows = await db
    .select()
    .from(storiesTable)
    .orderBy(desc(storiesTable.createdAt))
    .limit(50);
  res.json(ListStoriesResponse.parse(rows.map(toApi)));
});

router.post("/stories/:id/followup", async (req, res) => {
  const params = AddFollowUpParams.safeParse(req.params);
  const body = AddFollowUpBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid follow-up" });
    return;
  }
  const [row] = await db
    .update(storiesTable)
    .set({
      followUpPrompt: body.data.followUpPrompt,
      followUpResponse: body.data.followUpResponse ?? null,
    })
    .where(eq(storiesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  res.json(AddFollowUpResponse.parse(toApi(row)));
});

export default router;
