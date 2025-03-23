export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj || !path) return defaultValue;

  try {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined || result === null) return defaultValue;
    }

    return result as T;
  } catch {
    return defaultValue;
  }
}
