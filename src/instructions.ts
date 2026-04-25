import fs from "node:fs/promises";
import type { CustomLlmError } from "./errors.js";

export async function loadInstructions(instructionsFilePath: string): Promise<string> {
  try {
    return await fs.readFile(instructionsFilePath, "utf-8");
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    const error: CustomLlmError = {
      code: "CONFIG_INVALID",
      message: `Cannot read instructions file "${instructionsFilePath}": ${reason}`,
      meta: { path: instructionsFilePath, reason },
    };
    throw error;
  }
}
