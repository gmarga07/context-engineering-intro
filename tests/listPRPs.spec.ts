import { describe, it, expect } from "@jest/globals";
import { listPRPsTool } from "../src/tools/listPRPs";

describe("listPRPs tool", () => {
  it("returns an array of files", async () => {
    const result = await listPRPsTool.handler({}, {});
    expect(Array.isArray(result.files)).toBe(true);
  });
});