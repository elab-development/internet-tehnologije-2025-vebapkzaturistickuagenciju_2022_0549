# Veb Aplikacija za Turističku Agenciju

Fullstack web aplikacija za upravljanje turističkom agencijom, razvijena kao seminarski rad u okviru predmeta Internet Tehnologije 2025.

## O aplikaciji

Aplikacija omogućava korisnicima pregled i rezervaciju turističkih aranžmana, a administratorima i agentima upravljanje aranžmanima, rezervacijama, korisnicima i popustima.

### Uloge korisnika

- **Admin** — upravljanje korisnicima, aranžmanima, kategorijama i popustima
- **Agent** — upravljanje aranžmanima i rezervacijama
- **Klijent** — pregled aranžmana i pravljenje rezervacija

### Tehnologije

- **Frontend & Backend:** Next.js 16 (App Router, TypeScript)
- **Baza podataka:** PostgreSQL
- **ORM:** Prisma
- **Autentifikacija:** JWT
- **Stilizacija:** Tailwind CSS
- **Kontejnerizacija:** Docker, Docker Compose

---

## Pokretanje aplikacije

### Preduslovi

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/) (za lokalni razvoj)

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/elab-development/internet-tehnologije-2025-vebapkzaturistickuagenciju_2022_0549.git
cd internet-tehnologije-2025-vebapkzaturistickuagenciju_2022_0549/flashcards-webapp
```

### 2. Podešavanje environment varijabli

Kreiraj `.env` fajl u `flashcards-webapp/` folderu:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flashcards
JWT_SECRET=tvoj_tajni_kljuc
```

### 3. Lokalni build

```bash
npm install
npx prisma generate
npm run build
```

### 4. Pokretanje sa Docker Compose

```bash
docker-compose up
```

Aplikacija je dostupna na: **http://localhost:3000**

### 5. Punjenje baze test podacima (opciono)

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flashcards" npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

#### Test kredencijali

| Uloga   | Email                  | Lozinka    |
|---------|------------------------|------------|
| Admin   | admin@agencija.com     | admin123   |
| Agent   | agent@agencija.com     | agent123   |
| Klijent | petar@gmail.com        | klijent123 |

---

## Struktura projekta

```
flashcards-webapp/
├── src/
│   ├── app/
│   │   ├── api/          # REST API rute
│   │   ├── admin/        # Admin panel
│   │   ├── agent/        # Agent panel
│   │   ├── arrangements/ # Pregled aranžmana
│   │   ├── login/        # Prijava
│   │   └── register/     # Registracija
│   ├── components/       # Reusable komponente
│   └── lib/              # Prisma klijent, auth utils
├── prisma/
│   ├── schema.prisma     # Šema baze podataka
│   ├── migrations/       # Migracije
│   └── seed.ts           # Test podaci
├── Dockerfile
└── docker-compose.yml
```

## API Endpointi

| Metoda | Endpoint                    | Opis                        |
|--------|-----------------------------|-----------------------------|
| POST   | /api/auth/login             | Prijava korisnika           |
| POST   | /api/auth/register          | Registracija korisnika      |
| GET    | /api/arrangements           | Lista aranžmana             |
| POST   | /api/arrangements           | Kreiranje aranžmana         |
| GET    | /api/arrangements/:id       | Detalji aranžmana           |
| PUT    | /api/arrangements/:id       | Izmena aranžmana            |
| DELETE | /api/arrangements/:id       | Brisanje aranžmana          |
| GET    | /api/reservations           | Lista rezervacija           |
| POST   | /api/reservations           | Kreiranje rezervacije       |
| GET    | /api/categories             | Lista kategorija            |
| GET    | /api/discounts              | Lista popusta               |
| GET    | /api/users                  | Lista korisnika (admin)     |

## Git grane

- `main` — stabilna produkciona verzija
- `develop` — integraciona grana
- `feature/auth` — autentifikacija i autorizacija
- `feature/arrangements` — upravljanje aranžmanima