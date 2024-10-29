export default function getErrorMessage(error: unknown) {
  if (error instanceof Error) error.message;
  return String(error);
}
