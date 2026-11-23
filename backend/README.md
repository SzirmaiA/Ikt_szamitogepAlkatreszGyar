# Kapcsolat oldal és JSON-mentés

A `pages/kapcsolat.html` oldal külön `css/kapcsolat.css` és `js/kapcsolat.js` fájlokat használ. A képernyőn kétlépéses űrlap látható. A kliensoldali JavaScript egy biztonságos API-n keresztül küldi el a megadott adatokat.

## Miért van szükség szerveroldali részre?

A GitHub Pages statikus oldalként fut. JavaScriptből a nyilvános oldalra beépített GitHub-token bárki számára kiolvasható lenne. Név, e-mail cím és üzenet **nem kerülhet a nyilvános weboldal-repóba**, mert a felhasználók személyes adatait bárki láthatná.

A `backend/worker.js` egy Cloudflare Worker végpont, amely GitHub API-n keresztül **külön PRIVÁT GitHub-repóba** menti a megkereséseket a `data/kapcsolatok.json` fájlba. A fájlt automatikusan létrehozza az első sikeres mentéskor, és később bővíti.

## Beüzemelés

1. Hozz létre egy új **privát** GitHub-repót a megkereséseknek, például `SzirmaiA/CorePulse-Contacts`. Ne tedd nyilvánossá!
2. Hozz létre egy GitHub fine-grained personal access tokent, amely csak ehhez a privát repóhoz fér hozzá, `Contents: Read and write` jogosultsággal.
3. Hozz létre egy Cloudflare Worker projektet, és töltsd fel / állítsd be a `backend/worker.js` fájlt. A `backend/wrangler.toml` beállításai kiindulópontként szolgálnak.
4. A Worker környezeti változói között add meg a `CONTACTS_REPO` értékét (pl. `SzirmaiA/CorePulse-Contacts`), valamint az `ALLOWED_ORIGIN` értékét a weboldal tényleges HTTPS eredetével (pl. `https://szirmaia.github.io`, perjel nélkül).
5. A `GITHUB_TOKEN` értékét Cloudflare Worker **Secret**-ként add meg. **Soha ne írd forráskódba, wrangler.toml-be vagy HTML-be.**
6. A `pages/kapcsolat.html` `<meta name="contact-api-url" content="">` elemének `content` mezőjébe írd a telepített Worker teljes HTTPS URL-jét (pl. `https://corepulse-contact-api.<sajat-subdomain>.workers.dev`).
7. A `pages/kapcsolat.html` űrlapját a publikált weboldalról próbáld ki. Siker esetén az adat a privát repó `data/kapcsolatok.json` fájljában jelenik meg.

A `backend/wrangler.toml` fájlban szereplő példaneveket a saját értékeidre kell cserélni. A Cloudflare telepítése és a privát repó létrehozása nélkül az űrlap nem állítja, hogy sikeresen mentett: hibaüzenetet mutat.

## Biztonsági tudnivalók

- A **privát** adattár szükséges, mert a beküldött adatok személyes információkat tartalmaznak.
- Éles használat előtt ajánlott Cloudflare Turnstile CAPTCHA-t és IP-alapú rate limitinget beállítani, hogy ne tudják spamre használni a nyilvános űrlapot.
- Az űrlap adatkezelési tájékoztatója, az adatok törlésének folyamata és az adatmegőrzési idő szabályozása külön feladat, mielőtt valódi látogatók használják.
- A Worker csak a megadott `ALLOWED_ORIGIN` eredetről enged böngészős kérést; ez önmagában nem akadályozza meg a közvetlen API-kéréseket.
- Több egyidejű mentés esetén a Worker az ütközéseket korlátozott újrapróbálással kezeli. Nagy mennyiségű üzenethez célszerű adatbázist használni.

## JSON-példa

```json
[
  {
    "id": "auto-generated-uuid",
    "receivedAt": "2026-11-23T10:00:00.000Z",
    "name": "Teszt Felhasználó",
    "company": "Példa Kft.",
    "email": "teszt@example.com",
    "phone": "",
    "subject": "Termékinformáció",
    "message": "Szeretnék érdeklődni az alkatrészekről.",
    "consent": true
  }
]
```

Ez csak példa; valódi adatot ne commitolj a nyilvános repóba.
