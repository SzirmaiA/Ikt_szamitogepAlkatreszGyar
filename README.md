# CorePulse – Számítógép-alkatrészgyár

Iskolai IKT-projekt: egy számítógép-alkatrészeket gyártó vállalat bemutatkozó weboldala.

## Indítás

Nyisd meg a gyökérmappában található `index.html` fájlt egy böngészőben. A projekt HTML-, CSS- és JavaScript-fájlokból áll, nincs szükség külön telepítésre.

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
│   ├── katalogus.css
│   ├── rolunk.css
│   └── style.css
├── js/
│   ├── animations.js
│   ├── katalogus.js
│   └── script.js
├── img/
│   ├── about/
│   ├── products/
│   └── egyéb képek
└── README.md
```

## Fájlok szerepe

- **index.html:** főoldal, a projekt belépési pontja.
- **pages/:** az összes további HTML-oldal.
- **css/:** közös, animációs és oldalspecifikus stíluslapok.
- **js/:** JavaScript-funkciók és animációk.
- **img/:** képek, a `products/` és `about/` mappákban külön csoportosítva.

A fájlok áthelyezése után a HTML-hivatkozások relatív útvonalai frissültek. A `pages/kapcsolat.html` és `css/kapcsolat.css` az eredeti projektben is üres; a későbbi munkához megmaradtak.
