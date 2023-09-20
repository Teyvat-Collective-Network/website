import { PUBLIC_API } from "$env/static/public";

export default async function (token: string | null, route: string, body?: any, options?: RequestInit) {
    let request = route.startsWith("!");
    if (request) route = route.slice(1);

    const [method, real] = route.split(/\s+/);

    options ??= {};
    options.method = method;

    if (token) {
        options.headers ??= {};

        if (Array.isArray(options.headers)) options.headers.push(["authorization", token]);
        else if (options.headers instanceof Headers) options.headers.append("authorization", token);
        else options.headers.authorization = token;
    }

    if (body) options.body = JSON.stringify(body);

    const req = await fetch(`${PUBLIC_API}${real}`, options);
    if (request) return req;

    if (!req.ok) {
        console.error(route, await req.json());
        throw req.status;
    }

    const text = await req.text();

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
