import { Router, type IRouter } from "express";
import { GetIntelligenceSummaryResponse } from "@workspace/api-zod";
import { db, storiesTable, attendeesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// Synthetic baseline for the executive demo; live submissions are blended on top.
const BASELINE = {
  storiesShared: 1284,
  voiceCount: 796, // ~62%
  writtenCount: 488, // ~38%
  businessTypes: [
    { businessType: "Landscape Contractors", count: 501 },
    { businessType: "Dealers", count: 205 },
    { businessType: "Tree Care", count: 154 },
    { businessType: "Property / Fleet", count: 128 },
    { businessType: "Hardscape", count: 116 },
    { businessType: "Other", count: 180 },
  ],
  topThemes: [
    "Labor & Workforce",
    "Business Growth",
    "Equipment Productivity",
    "Fleet Costs",
    "Financing",
    "Technology Adoption",
  ],
  attendeeVoices: [
    {
      quote:
        "We're getting more work than we can handle, but finding crews is almost impossible.",
      businessType: "Landscape Contractor",
    },
    {
      quote:
        "I came here specifically looking for equipment that lets two people do what used to take four.",
      businessType: "Tree Care & Arborist Services",
    },
    {
      quote: "Fleet financing is becoming one of our biggest barriers to growth.",
      businessType: "Property & Fleet Management",
    },
  ],
};

router.get("/intelligence/summary", async (_req, res) => {
  const liveStories = await db
    .select({
      responseType: storiesTable.responseType,
      businessType: attendeesTable.businessType,
    })
    .from(storiesTable)
    .innerJoin(attendeesTable, eq(storiesTable.attendeeId, attendeesTable.id));

  const total = BASELINE.storiesShared + liveStories.length;
  const voice =
    BASELINE.voiceCount + liveStories.filter((s) => s.responseType === "voice").length;
  const written = total - voice;

  const typeCounts = new Map(BASELINE.businessTypes.map((b) => [b.businessType, b.count]));
  const mapType = (t: string): string => {
    if (t.startsWith("Landscape")) return "Landscape Contractors";
    if (t.includes("Dealer")) return "Dealers";
    if (t.startsWith("Tree")) return "Tree Care";
    if (t.startsWith("Property")) return "Property / Fleet";
    if (t.startsWith("Hardscape")) return "Hardscape";
    return "Other";
  };
  for (const s of liveStories) {
    const key = mapType(s.businessType);
    typeCounts.set(key, (typeCounts.get(key) ?? 0) + 1);
  }
  const topBusinessTypes = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([businessType, count]) => ({
      businessType,
      percent: Math.round((count / total) * 100),
    }));

  const data = GetIntelligenceSummaryResponse.parse({
    storiesShared: total,
    voicePercent: Math.round((voice / total) * 100),
    writtenPercent: Math.round((written / total) * 100),
    topBusinessTypes,
    topThemes: BASELINE.topThemes,
    emergingStoryHeadline: "LABOR IS BECOMING A PRODUCTIVITY PROBLEM",
    emergingStoryInsight:
      "Landscape contractors increasingly describe equipment and automation as a way to grow without proportionally increasing headcount.",
    attendeeVoices: BASELINE.attendeeVoices,
  });
  res.json(data);
});

export default router;
