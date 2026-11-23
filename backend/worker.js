const allowedSubjects = ["Termékinformáció", "Ajánlatkérés", "Együttműködés", "Egyéb kérdés"];

function send(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin"
    }
  });
}

function decodeContent(value) {
  const binary = atob(value.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

function encodeContent(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max + 1) : "";
}

async function requestGithub(env, method, body) {
  const repo = env.CONTACTS_REPO || "";
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) throw new Error("Hibás CONTACTS_REPO beállítás");
  const path = "data/kapcsolatok.json";
  const url = "https://api.github.com/repos/" + repo + "/contents/" + path;
  return fetch(url, {
    method,
    headers: {
      "Authorization": "Bearer " + env.GITHUB_TOKEN,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "CorePulse-Contact-Worker",
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "";
    if (!allowed || !origin || origin !== allowed) {
      return new Response("Tiltott eredet", { status: 403 });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }
    if (request.method !== "POST") return send({ ok: false, error: "Nem támogatott metódus." }, 405, origin);
    if (!env.GITHUB_TOKEN || !env.CONTACTS_REPO) {
      return send({ ok: false, error: "A kapcsolatfelvétel még nincs bekötve." }, 503, origin);
    }
    if (Number(request.headers.get("Content-Length") || 0) > 12000) {
      return send({ ok: false, error: "Túl nagy kérés." }, 413, origin);
    }
    let payload;
    try {
      payload = await request.json();
    } catch {
      return send({ ok: false, error: "Hibás adatformátum." }, 400, origin);
    }
    if (!payload || typeof payload !== "object") {
      return send({ ok: false, error: "Hibás adatformátum." }, 400, origin);
    }
    if (payload.website) return send({ ok: true }, 200, origin);
    const name = clean(payload.name, 100);
    const company = clean(payload.company, 120);
    const email = clean(payload.email, 254);
    const phone = clean(payload.phone, 40);
    const subject = clean(payload.subject, 100);
    const message = clean(payload.message, 3000);
    if (name.length < 2 || name.length > 100 ||
        company.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        phone.length > 40 ||
        !allowedSubjects.includes(subject) ||
        message.length < 5 || message.length > 3000 ||
        payload.consent !== true) {
      return send({ ok: false, error: "Ellenőrizd a kötelező mezőket." }, 400, origin);
    }
    const record = {
      id: crypto.randomUUID(),
      receivedAt: new Date().toISOString(),
      name,
      company,
      email,
      phone,
      subject,
      message,
      consent: true
    };
    for (let attempt = 0; attempt < 4; attempt++) {
      const current = await requestGithub(env, "GET");
      let sha;
      let data = [];
      if (current.status === 200) {
        const file = await current.json();
        sha = file.sha;
        try {
          data = JSON.parse(decodeContent(file.content));
        } catch {
          return send({ ok: false, error: "A tárolt JSON hibás. Nem írtunk felül adatot." }, 503, origin);
        }
        if (!Array.isArray(data)) return send({ ok: false, error: "A JSON tartalma nem tömb." }, 503, origin);
      } else if (current.status !== 404) {
        return send({ ok: false, error: "A GitHub adattár nem érhető el." }, 503, origin);
      }
      if (data.length >= 1000) {
        return send({ ok: false, error: "A gyűjtőfájl megtelt, archiválás szükséges." }, 503, origin);
      }
      data.push(record);
      const result = await requestGithub(env, "PUT", {
        message: "Kapcsolati megkeresés mentése",
        content: encodeContent(JSON.stringify(data, null, 2) + "\n"),
        ...(sha ? { sha } : {})
      });
      if (result.ok) return send({ ok: true, id: record.id }, 201, origin);
      if (result.status !== 409 && result.status !== 422) {
        return send({ ok: false, error: "Nem sikerült a GitHub-mentés." }, 503, origin);
      }
    }
    return send({ ok: false, error: "A tároló foglalt, próbáld meg újra." }, 503, origin);
  }
};
