import type { ServerAdapterModule } from "@paperclipai/adapter-utils";
import { execute, testEnvironment } from "./server/index.js";
import { getConfigSchema } from "./schema.js";

export { getConfigSchema } from "./schema.js";

export const type = "custom_llm_local";
export const label = "Custom LLM (Local)";
export const models = [];

export const agentConfigurationDoc = `
# Custom LLM (Local) Adapter

Calls local or proxy LLM endpoints directly via OpenAI-compatible or Anthropic-compatible HTTP APIs.
No provider inference is performed; the configured model ID is sent verbatim to the endpoint.

## Required fields
- **model** — model ID sent verbatim to the endpoint
- **baseUrl** — endpoint base URL, for example \`http://127.0.0.1:8080/v1\`
- **transport** — \`openai_chat_completions\` or \`anthropic_messages\`

## Optional fields
- **apiKeyEnv** — name of the env var holding the API key
- **instructionsFilePath** — absolute path to a markdown instructions file
- **timeoutSec** / **graceSec** — timeout control
- **modelAlias** — canonical model ID for display or records
- **extraHeaders** — additional HTTP headers

## Security
Never put raw API keys in adapterConfig. Use \`apiKeyEnv\` to reference a server environment variable.
`.trim();

export function createServerAdapter(): ServerAdapterModule {
  return {
    type,
    execute,
    testEnvironment,
    models,
    getConfigSchema,
    supportsInstructionsBundle: true,
    instructionsPathKey: "instructionsFilePath",
    agentConfigurationDoc,
  };
}
