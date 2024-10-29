export default function extractStringValue(
  value: string,
  regex: RegExp,
): string {
  return value.match(regex)?.[1] ?? '';
}
