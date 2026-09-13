# 🍕 Dilan's Roulette

Velkommen til **Dilan's Roulette**! En digital casino-spinner skabt til køkkenfesterne på **Rigshospitalets Kollegium (RHK)**.

Det lokale pizzeria, *Dilan's Pizzaria*, har et gigantisk menukort med et hav af retter. Når der skal bestilles mad til festen, overlades valget til rouletten – men der er en hage...

---

## 🍻 Reglerne

1. **Indtast navn**: Skriv hvem der spinner (f.eks. Jonas).
2. **Spin hjulet**: Tryk på **Spin Hjulet** og se slot-maskinen rulle.
3. **Du spiser hvad du rammer**: Det du lander på, er din ret.
4. **Ølbong-reglen (The Catch)**:
   - Vil du for alt i verden ikke have retten?
   - **Tag en ølbong** 🍺 for at få et re-spin!
   - Rammer du igen noget du ikke vil have? Endnu en ølbong = endnu et re-spin (indtil du fysisk ikke kan drikke mere øl).
5. **Accepter**: Når du overgiver dig til skæbnen, trykker du **Accepter Ret**, og retten føjes til køkkenets samlede bestillingsliste med dit ølbong-badge!

---

## ✨ Funktioner

- **🎰 Mekanisk Slot Machine Reel**: Ruller med 3D gradient-masker og blød nedbremsning med pixel-perfekt centrering.
- **🍺 Ølbong-tæller & Re-spin knap**: Holder styr på, hvor mange ølbongs hver person har bundet for at undgå deres ret.
- **📋 Live Køkken Bestillingsliste**:
  - Samlet oversigt over hvem der skal have hvad.
  - Tæller af totalt antal retter og samlede antal ølbongs bundet til festen.
  - **Kopier Bestilling**: Kopiér hele bestillingen pænt formateret til udklipsholderen (klar til SMS/opkald til Dilan).
  - Gemmes i `localStorage`, så listen ikke mistes hvis siden genindlæses.
- **📺 TV / Storskærmstilstand**: Skalér tekst og roulette op med et klik, så den er letlæselig på en storskærm eller projektor i køkkenet.
- **🔊 Web Audio Lydeffekter**:
  - Mekaniske klik der decelererer i takt med hjulet.
  - Sejrsfanfare og konfetti når retten afsløres.
  - Drikkelyd ved ølbong-klik.
  - Lyd til/fra-knap i toppen.
- **🥗 Kostfiltre**:
  - **Vegetar**: Vælger kun kødfrie retter.
  - **Pescetar**: Tillader også fiskeretter.

---

## 🚀 Kom i gang

Ingen server eller installation nødvendig:

1. Åbn `index.html` direkte i din browser (dobbeltklik på filen).
2. Tryk på **Spin Hjulet** og gør ølbongen klar!

---

## 📁 Projektstruktur

```text
dilans-app/
├── index.html       # Hovedside med layout og komponenter
├── css/
│   └── style.css    # Mørkt casino/arcade-tema, neoneffekter og TV-mode
└── js/
    ├── menuData.js  # Hele Dilans menukort og kategorilogik
    ├── audio.js     # Web Audio API syntese til lydeffekter (ingen MP3-filer)
    ├── confetti.js  # Letvægts inline canvas partikelkonfetti
    └── app.js       # Spillets logik, hjulmekanik og bestillingsliste
```
