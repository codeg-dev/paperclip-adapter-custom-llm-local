# Security Policy

## Secrets

This adapter intentionally rejects raw `apiKey` values in `adapterConfig`.
Use `apiKeyEnv` to reference an environment variable in the Paperclip server
process instead.

Do not open issues containing API keys, bearer tokens, proxy tokens, private
base URLs, local file paths, or private prompts. Redact sensitive values before
sharing logs.

## Reporting Vulnerabilities

Please report security issues privately to the repository owner through GitHub
Security Advisories when available. If advisories are not enabled, open a
minimal issue that does not include exploit details or secrets and request a
private contact path.
