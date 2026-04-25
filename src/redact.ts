const SENSITIVE_HEADER_RE = /auth|key|token|secret/i;

export function redactSensitive(headers: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    safe[name] = SENSITIVE_HEADER_RE.test(name) ? "[REDACTED]" : value;
  }
  return safe;
}
