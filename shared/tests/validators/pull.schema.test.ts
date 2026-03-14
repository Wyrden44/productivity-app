import { pullSchema } from "../../src/pull/pull.schema";
import { describe, it, expect } from "vitest";

describe("pullSchema", () => {
  it("accepts a valid timestamp", () => {
    const result = pullSchema.safeParse({ lastSyncedAt: 1709485351 });
    expect(result.success).toBe(true);
  });

  it("accepts zero (first sync)", () => {
    const result = pullSchema.safeParse({ lastSyncedAt: 0 });
    expect(result.success).toBe(true);
  });

  it("rejects negative numbers", () => {
    const result = pullSchema.safeParse({ lastSyncedAt: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects floating point numbers", () => {
    const result = pullSchema.safeParse({ lastSyncedAt: 123.456 });
    expect(result.success).toBe(false);
  });

  it("rejects non-number types", () => {
    const result = pullSchema.safeParse({ lastSyncedAt: "2024-01-01" });
    expect(result.success).toBe(false);
  });
});
