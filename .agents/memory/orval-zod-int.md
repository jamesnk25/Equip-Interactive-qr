---
name: Orval zod.int() vs zod v3
description: Codegen breaks when OpenAPI uses `type: integer` because Orval emits zod v4 API against the workspace's zod v3 import
---

Rule: In `lib/api-spec/openapi.yaml`, use `type: number` instead of `type: integer`.

**Why:** Orval emits `zod.int()` (a Zod v4 API) for integer schemas, but `lib/api-zod` imports classic `zod` (v3.25 from the catalog), so `pnpm --filter @workspace/api-spec run codegen` fails at the chained typecheck with TS2339 `Property 'int' does not exist`.

**How to apply:** When writing or editing the OpenAPI spec, declare all numeric fields (including ids) as `type: number` / `type: ["number", "null"]`.
