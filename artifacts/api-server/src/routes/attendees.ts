import { Router, type IRouter } from "express";
import {
  CreateAttendeeBody,
  CreateAttendeeResponse,
  VerifyAttendeeParams,
  VerifyAttendeeBody,
  VerifyAttendeeResponse,
} from "@workspace/api-zod";
import { db, attendeesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function toApi(a: typeof attendeesTable.$inferSelect) {
  return {
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    city: a.city,
    state: a.state,
    mobileNumber: a.mobileNumber,
    mobileVerified: a.mobileVerified,
    businessType: a.businessType,
    createdAt: a.createdAt.toISOString(),
  };
}

router.post("/attendees", async (req, res) => {
  const parsed = CreateAttendeeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid attendee details" });
    return;
  }
  const [row] = await db.insert(attendeesTable).values(parsed.data).returning();
  res.status(201).json(CreateAttendeeResponse.parse(toApi(row!)));
});

router.post("/attendees/:id/verify", async (req, res) => {
  const params = VerifyAttendeeParams.safeParse(req.params);
  const body = VerifyAttendeeBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid verification code" });
    return;
  }
  // Demo: any six-digit code verifies the attendee.
  const [row] = await db
    .update(attendeesTable)
    .set({ mobileVerified: true })
    .where(eq(attendeesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Attendee not found" });
    return;
  }
  res.json(VerifyAttendeeResponse.parse(toApi(row)));
});

export default router;
