import { BOT_API } from "$env/static/private";

export default async function (token: string | null, route: string, options?: RequestInit) {
    let request = route.startsWith("!");
    if (request) route = route.slice(1);

    console.log(`=> BOT: ${route}`);

    const [method, real] = route.split(/\s+/);

    options ??= {};
    options.method = method;
    route = real;

    if (token) {
        options.headers ??= {};

        if (Array.isArray(options.headers)) options.headers.push(["Authorization", `Bearer ${token}`]);
        else if (options.headers instanceof Headers) options.headers.append("Authorization", `Bearer ${token}`);
        else options.headers.Authorization = `Bearer ${token}`;
    }

    const req = await fetch(`${BOT_API}${route}`, options);
    if (request) return req;

    if (!req.ok) {
        console.error(route, await req.json());
        throw req.status;
    }

    return await req.json();
}
