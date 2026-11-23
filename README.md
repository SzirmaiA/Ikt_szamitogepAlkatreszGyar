# CorePulse – Számítógép-alkatrészgyár

KKSZKI Iskolai IKT-projekt: egy számítógép-alkatrészeket gyártó vállalat bemutatkozó weboldala.


## Linkek
- **Weboldal Linkje:** https://szirmaia.github.io/Ikt_szamitogepAlkatreszGyar/index.html
- **Figma Linkje:** https://www.figma.com/proto/XC5ws4o1oM5Aud5Tyn6gy3/Untitled?node-id=4-3684
- **Trello Linkje:** https://trello.com/b/Jaxh1N3f/projekt-munka

## Mappaszerkezet

```text
Ikt_szamitogepAlkatreszGyar/
├── index.html
├── pages/
│   ├── ajanlatkeres.html
│   ├── gyartasiFolyamat.html
│   ├── kapcsolat.html
│   ├── rolunk.html
│   └── termekek.html
├── css/
│   ├── ajanlatkeres.css
│   ├── animations.css
│   ├── gyartasiFolyamat.css
│   ├── kapcsolat.css
│   ├── termekek.css
│   ├── rolunk.css
│   └── style.css
├── js/
│   ├── animations.js
│   ├── kapcsolat.js
│   ├── katalogus.js
│   └── script.js
├── img/
│   ├── about/
│   ├── products/
│   └── egyéb képek
├── backend/
│   ├── worker.js
│   ├── wrangler.toml
│   └── README.md
└── README.md
```

## Fájlok szerepe

- **index.html:** főoldal, a projekt belépési pontja.
- **pages/:** az összes további HTML-oldal.
- **css/:** közös, animációs és oldalspecifikus stíluslapok. A Termékek oldal saját stílusai a `termekek.css` fájlban vannak.
- **js/:** JavaScript-funkciók és animációk.
- **img/:** képek, a `products/` és `about/` mappákban külön csoportosítva.

A fájlok áthelyezése után a HTML-hivatkozások relatív útvonalai frissültek. A `pages/kapcsolat.html` kétlépéses kapcsolatfelvételi űrlap. A JSON-ba mentéshez egy külön, biztonságosan telepített API szükséges; a `backend/README.md` tartalmazza a beüzemelést.
