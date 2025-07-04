import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { readFile, writeFile, mkdir, rm, access } from "fs/promises";
import { resolve, join } from "path";
import { generatePRPTool } from "../src/tools/generatePRP";

describe("generatePRP tool", () => {
  const tmpDir = resolve("tests/__tmp");
  const featurePath = join(tmpDir, "FEATURE.md");

  beforeAll(async () => {
    await mkdir(tmpDir, { recursive: true });
    await writeFile(featurePath, "## FEATURE\n\nTest feature", "utf8");
  });

  afterAll(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it("creates a PRP file and returns path", async () => {
    const result = await generatePRPTool.handler(
      { featureFile: featurePath },
      {}
    );
    expect(result.prpPath).toBeDefined();
    const exists = await access(result.prpPath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
    expect(Array.isArray(result.validationCommands)).toBe(true);
  });
});