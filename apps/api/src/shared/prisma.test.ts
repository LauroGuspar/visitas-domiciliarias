import { describe, expect, it } from "vitest";
import { createPrismaClient } from "./prisma.js";

describe("createPrismaClient", () => {
  it("constructs PrismaClient with a PostgreSQL adapter", async () => {
    const client = createPrismaClient(
      "postgresql://user:password@localhost:5432/db?schema=public"
    );

    expect(client).toBeDefined();
    await client.$disconnect();
  });
});
