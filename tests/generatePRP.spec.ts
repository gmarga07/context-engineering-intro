import fs from "fs/promises";
import path from "path";
import { generatePRPTool } from "../src/tools/generatePRP";

describe("generatePRP tool", () => {
  const tmpDir = path.resolve("tests/__tmp");
  const featurePath = path.join(tmpDir, "FEATURE.md");

  beforeAll(async () => {
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(featurePath, "## FEATURE\n\nTest feature", "utf8");
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it("creates a PRP file and returns path", async () => {
    const result = await generatePRPTool.handler(
      { featureFile: featurePath },
      {}
    );
    expect(result.prpPath).toBeDefined();
    const exists = await fs
      .access(result.prpPath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
    expect(Array.isArray(result.validationCommands)).toBe(true);
  });
});