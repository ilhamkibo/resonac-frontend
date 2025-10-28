// src/lib/utils/asyncHandler.ts
export async function asyncHandler<T>(
  promise: Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await promise;
  } catch (error: any) {
    console.error("Async Handler Caught:", error.message || error);
    // Kembalikan nilai fallback (opsional) agar tidak crash
    return fallback ?? ({} as T);
  }
}
