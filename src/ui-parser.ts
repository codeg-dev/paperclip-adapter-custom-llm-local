export function parseStdoutLine(line: string, ts: string) {
  const trimmed = line.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[custom-llm-local]")) {
    return [{ kind: "system", ts, text: trimmed }];
  }

  return [{ kind: "stdout", ts, text: trimmed }];
}
