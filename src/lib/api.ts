import { PUBLIC_API } from "$env/static/public";

export default async function (token: string | null, route: string, body?: any, reason?: string | null) {
    let request = route.startsWith("!");
    if (request) route = route.slice(1);

    console.log(`=> API: ${route}`, ...(body ? [body] : []));

    const [method, real] = route.split(/\s+/);

    const options: RequestInit & { headers: Record<string, string> } = { method, headers: {} };

    if (token) options.headers.Authorization = `Bearer ${token}`;

    if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    if (reason) options.headers["X-Audit-Log-Reason"] = reason;

    const req = await fetch(`${PUBLIC_API}${real}`, options);
    if (request) return req;

    if (!req.ok) {
        const res = await req.json();
        console.error(route, res);
        throw res.message ?? res;
    }

    const text = await req.text();

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
