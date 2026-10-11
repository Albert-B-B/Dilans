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
   - **🎯 Frit valg**: Har du taget 3 ølbongs, må du vælge din egen ret fra menuen. Grænsen kan justeres (🎯 *Frit valg efter X ølbong*) hvis den afhænger af personen.
   - **✏️ Ændringer**: Tag en ekstra ølbong for at lave 1 ændring til din ret (f.eks. *uden tomat*) via **🍺✏️ Ændring** på bestillingslisten.
5. **Accepter**: Når du overgiver dig til skæbnen, trykker du **Accepter Ret**, og retten føjes til køkkenets samlede bestillingsliste med dit ølbong-badge!
6. **Fortrudt?** Tryk **↩️ Fortryd** på din bestilling – også længe efter. Du får din tur tilbage og kan acceptere retten igen eller tage en ølbong og spinne igen.

---

## ✨ Funktioner

- **🎰 Mekanisk Slot Machine Reel**: Ruller med 3D gradient-masker, blød nedbremsning og cryptografisk hardware-entropi (`crypto.getRandomValues()`) med nul modulo-bias.
- **🍺 Parallel Ølbong-kø**:
  - Gå ud og drik din ølbong imens de næste gæster spinner i mellemtiden!
  - Husker din tidligere rullede ret, antal ølbongs og kostpræference når du genoptager din tur.
- **📋 Live Køkken Bestillingsliste**:
  - Tre visninger: Kronologisk spillerrækkefølge, samlet ordre grupperet til Dilan og **🏆 Ølbong-top**.
  - **🏆 Ølbong-top**: Leaderboard over aftenens ølbongs med 🥇🥈🥉 – inkl. dem der stadig drikker i køen.
  - **✏️ Ændringer** vises på bestillingen og kommer med i den kopierede tekst til Dilan (f.eks. `↳ 1 stk: uden tomat`).
  - **↩️ Fortryd**: Fjern en bestilling og giv spilleren turen tilbage med samme ret, ølbongs og kostfilter.
  - **⚠️ Dobbeltnavn-advarsel**: Spørger før der spinnes for et navn, som allerede har en bestilling.
  - Tæller af totalt antal retter og samlede antal ølbongs bundet til festen.
  - **Kopier Bestilling**: Kopiér hele bestillingen pænt formateret til udklipsholderen (inkl. advarsel hvis nogen stadig drikker i ølbong-køen).
  - Gemmes i `localStorage`, så listen ikke mistes hvis siden genindlæses.
- **📺 TV / Storskærmstilstand**: Skalér tekst og roulette op med et klik, så den er letlæselig på en storskærm eller projektor i køkkenet.
- **🔊 Web Audio Lydeffekter**:
  - Mekaniske klik der decelererer i takt med hjulet (øjeblikkelig 0ms start uden browser-lag).
  - Sejrsfanfare og konfetti når retten afsløres.
  - Drikkelyd ved ølbong-klik.
  - Lyd til/fra-knap i toppen.
- **🥗 Kostfiltre**:
  - **🌱 Vegetar**: Vælger kun kødfrie retter.
  - **🐟 Pescetar**: Tillader også fiskeretter.
  - **🥩 Uden oksekød**: Udelukker alle retter med oksekød, hakket kød, kødsauce, bøf og kebab. Nulstilles automatisk til ren tavle for næste gæst.

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
