export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`API GET request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}