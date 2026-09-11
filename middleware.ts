import { next } from "@vercel/functions";

// `/panel-najmu/protokol/*` i `/panel-najmu/shared/*` (plus kilka
// konkretnych statycznych assetów) są celowo WYŁĄCZONE z Basic Auth — to
// publiczna, samoobsługowa strona protokołu dla najemcy (patrz
// client/public/panel-najmu/protokol/), chroniona nie Basic Authem tylko
// hasłem do jednego konkretnego protokołu (Cloud Function
// verifyProtocolPassword). Cała reszta panelu (js/app.js z pełnym dostępem
// operatorskim, index.html, itd.) zostaje za Basic Authem jak dotąd.
export const config = {
  matcher: [
    "/panel-najmu",
    "/panel-najmu/((?!protokol/|shared/|css/style\\.css|fonts/|img/logo\\.png|img/van-diagram\\.png).*)",
  ],
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
