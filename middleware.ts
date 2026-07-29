import { next } from "@vercel/functions";

export const config = {
  matcher: "/panel-najmu/:path*",
};

function unauthorized(): Response {
  return new Response("Autoryzacja wymagana.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Panel najmu", charset="UTF-8"',
    },
  });
}

export default function middleware(request: Request) {
  const expectedUser = process.env.PANEL_NAJMU_USER;
  const expectedPassword = process.env.PANEL_NAJMU_PASSWORD;

  // Misconfigured deployment: fail closed rather than leaving the panel open.
  if (!expectedUser || !expectedPassword) {
    return unauthorized();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(authHeader.slice("Basic ".length));
  const separatorIndex = decoded.indexOf(":");
  const providedUser = decoded.slice(0, separatorIndex);
  const providedPassword = decoded.slice(separatorIndex + 1);

  if (providedUser !== expectedUser || providedPassword !== expectedPassword) {
    return unauthorized();
  }

  return next();
}
