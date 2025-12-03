// // src/lib/utils/asyncHandler.ts
// export async function asyncHandler<T>(
//   promise: Promise<T>,
//   fallback?: T
// ): Promise<T> {
//   try {
//     return await promise;
//   } catch (error: any) {
//     console.error("Async Handler Caught:", error.message || error);
//     // Kembalikan nilai fallback (opsional) agar tidak crash
//     return fallback ?? ({} as T);
//   }
// }

export async function asyncHandler<T>(
  promise: Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await promise;
  } catch (error: unknown) {
    let message = "Unknown error";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (typeof error === "object" && error !== null) {
      message = JSON.stringify(error);
    }

    console.error("Async Handler Caught:", message);

    return fallback ?? ({} as T);
  }
}
