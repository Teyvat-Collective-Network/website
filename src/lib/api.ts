import { PUBLIC_API } from "$env/static/public";

export default async function (token: string | null, route: string, options?: RequestInit) {
    let request = route.startsWith("!");
    if (request) route = route.slice(1);

    const [method, real] = route.split(/\s+/);

    options ??= {};
    options.method = method;
    route = real;

    if (token) {
        options.headers ??= {};

        if (Array.isArray(options.headers)) options.headers.push(["authorization", token]);
        else if (options.headers instanceof Headers) options.headers.append("authorization", token);
        else options.headers.authorization = token;
    }

    const req = await fetch(`${PUBLIC_API}${route}`, options);
    if (request) return req;

    if (!req.ok) throw req.status;

    const text = await req.text();

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
