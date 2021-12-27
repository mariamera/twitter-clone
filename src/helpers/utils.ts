function logError(error: any) {
  let errorMessage = "Failed to do something exceptional";

  if (error instanceof Error) {
    errorMessage = error.message;
  }
  return `error while changing like: ${errorMessage}`;
}

export { logError };
