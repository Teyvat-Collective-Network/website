import { PUBLIC_API } from "$env/static/public";

export default async function (token: string, route: string, options?: RequestInit) {
    let request = route.startsWith("!");
    if (request) route = route.slice(1);

    if (token) {
        options ??= {};
        options.headers ??= {};

        if (Array.isArray(options.headers)) options.headers.push(["authorization", token]);
        else if (options.headers instanceof Headers) options.headers.append("authorization", token);
        else options.headers.authorization = token;
    }

    const req = await fetch(`${PUBLIC_API}${route}`, options);
    if (request) return req;

    if (!req.ok) throw req.status;
    return await req.json();
}
