import { DISCORD_INTERFACE } from "$env/static/private";

export default async function (route: string, options?: RequestInit) {
    let request = route.startsWith("!");
    if (request) route = route.slice(1);

    console.log(`=> BOT: ${route}`);

    const [method, real] = route.split(/\s+/);

    options ??= {};
    options.method = method;
    route = real;

    const req = await fetch(`${DISCORD_INTERFACE}${route}`, options);
    if (request) return req;

    if (!req.ok) {
        console.error(route, await req.json());
        throw req.status;
    }

    return await req.json();
}
