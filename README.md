# paperclip-adapter-custom-llm-local

Paperclip adapter for local or proxy LLM HTTP endpoints that speak either:

- OpenAI Chat Completions (`/chat/completions`)
- Anthropic Messages (`/messages`)

The adapter calls the endpoint directly from the Paperclip server. It does not
infer providers, rewrite model IDs, shell out to a CLI, or route through another
agent runtime.

## Features

- OpenAI-compatible and Anthropic-compatible transports
- Buffered, non-streaming requests
- Per-run instructions file loading
- `apiKeyEnv` secret handling only; raw `apiKey` is rejected
- Redacted auth/key/token/secret headers in adapter logs
- Paperclip config-schema support for the generic adapter form
- Environment diagnostics through Paperclip's `Test environment` button

## Installation

Install it from npm through the Paperclip adapter manager:

```text
Settings -> Adapters -> Install Adapter -> npm package
paperclip-adapter-custom-llm-local
```

Or install through the adapter API:

```bash
curl -X POST http://localhost:3100/api/adapters \
  -H "Content-Type: application/json" \
  -d '{"packageName":"paperclip-adapter-custom-llm-local"}'
```

If your Paperclip instance requires board authentication, include your normal
authorization headers with the request above.

For local development, install from a local directory through the same adapter
manager or by adding an entry to `~/.paperclip/adapter-plugins.json`:

```json
[
  {
    "packageName": "paperclip-adapter-custom-llm-local",
    "localPath": "/absolute/path/to/paperclip-adapter-custom-llm-local",
    "type": "custom_llm_local",
    "installedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

Restart Paperclip after changing the plugin list.

## Adapter Configuration

Once the adapter is installed and Paperclip has restarted, configuration fields appear automatically in the agent settings UI:

```text
Agent Settings → Adapter → Custom LLM (Local)
```

If the fields do not appear, make sure the adapter is installed and Paperclip has been restarted. If you installed from a local path, pull the latest code and restart Paperclip.

### Configuration fields

The following fields are rendered by Paperclip from the adapter's config schema:

Example for an OpenAI-compatible local proxy:

```json
{
  "adapterType": "custom_llm_local",
  "adapterConfig": {
    "model": "gpt-4.1-mini",
    "baseUrl": "http://127.0.0.1:8080/v1",
    "apiKeyEnv": "LOCAL_LLM_API_KEY",
    "transport": "openai_chat_completions",
    "timeoutSec": 300,
    "graceSec": 30,
    "instructionsFilePath": "/absolute/path/to/AGENTS.md"
  }
}
```

Example for an Anthropic-compatible endpoint:

```json
{
  "adapterType": "custom_llm_local",
  "adapterConfig": {
    "model": "claude-compatible-model",
    "baseUrl": "http://127.0.0.1:8080/v1",
    "apiKeyEnv": "LOCAL_LLM_API_KEY",
    "transport": "anthropic_messages",
    "timeoutSec": 300,
    "graceSec": 30
  }
}
```

### Fields

| Field | Required | Description |
| --- | --- | --- |
| `model` | Yes | Model ID sent verbatim to the endpoint. |
| `baseUrl` | Yes | Absolute `http` or `https` base URL. |
| `transport` | Yes | `openai_chat_completions` or `anthropic_messages`. |
| `apiKeyEnv` | No | Environment variable name containing the API key. |
| `instructionsFilePath` | No | Absolute path to a markdown instructions file. |
| `timeoutSec` | No | Request timeout in seconds. Defaults to `300`. |
| `graceSec` | No | Grace period before hard abort. Defaults to `30`. |
| `extraHeaders` | No | Additional string headers to merge into the request. |
| `modelAlias` | No | Optional display/canonical model alias in result JSON. |

## Model Names

The adapter passes `model` through unchanged. Some proxies expect bare model IDs
such as `gpt-4.1-mini`; others expect provider-prefixed IDs such as
`openai/gpt-4.1-mini`. Use the exact model string your endpoint accepts.

## llama.cpp

`llama-server` exposes both OpenAI-compatible `/v1/chat/completions` and
Anthropic-compatible `/v1/messages` APIs. Choose the adapter transport that
matches the endpoint you want to call.

For OpenAI Chat Completions:

```json
{
  "model": "your-llama-model",
  "baseUrl": "http://127.0.0.1:8080/v1",
  "transport": "openai_chat_completions"
}
```

For Anthropic Messages:

```json
{
  "model": "your-llama-model",
  "baseUrl": "http://127.0.0.1:8080/v1",
  "transport": "anthropic_messages"
}
```

## Security Notes

- Do not put API key values in `adapterConfig`.
- Set secrets in the Paperclip server process environment and reference them by
  name with `apiKeyEnv`.
- Headers whose names include `auth`, `key`, `token`, or `secret` are redacted in
  logs.
- Endpoint responses may contain prompt or completion text. Treat run logs as
  sensitive if your prompts contain private data.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

Before publishing, run:

```bash
npm run prepublishOnly
```

The `prepublishOnly` script typechecks, tests, builds, and scans the repository
for common secret and personal-path patterns.

## License

MIT
