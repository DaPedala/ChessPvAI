# ChessPvAI

Play chess against the Stockfish engine with real-time move analysis, a full game history, and a global leaderboard. Built with SvelteKit and PostgreSQL, with Stockfish running entirely in the browser via Web Worker — no server-side computation required for gameplay.

---

## Prerequisites

Before you begin, make sure the following are installed:

- [Node.js](https://nodejs.org/) — v18 or later
- [PostgreSQL](https://www.postgresql.org/download/) — v14 or later

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/DaPedala/ChessPvAI.git
cd ChessPvAI
```

### 2. Install dependencies

```bash
npm install
```

---

## Database setup

### 3. Install PostgreSQL

Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).  
During installation, you will be asked to set a password for the default `postgres` user. **Write it down — you will need it in step 6.**  
You do not need to start the server manually at the end of the installer; PostgreSQL runs as a background service automatically.

Once installed, verify that `psql` is available in your terminal:

```bash
psql --version
```

> **Windows:** If the command is not found, add the PostgreSQL `bin` folder to your system `PATH`  
> (e.g. `C:\Program Files\PostgreSQL\16\bin`), then restart your terminal.

### 4. Create the database

```bash
psql -U postgres -c "CREATE DATABASE chesspvai;"
```

Enter your `postgres` password when prompted.

### 5. Apply the schema

```bash
psql -U postgres -d chesspvai -f schema.sql
```

This creates the `users`, `sessions`, `games`, and `moves` tables.

### 6. Configure environment variables

Create a file named `.env` in the project root with the following content:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/chesspvai
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

---

## Running the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit |
| Language | TypeScript |
| Chess engine | Stockfish (Web Worker) |
| Move validation | chess.js |
| Database | PostgreSQL |
| Auth | bcryptjs + session cookies |

---

## Troubleshooting

**`psql` not found**  
Add the PostgreSQL `bin` directory to your `PATH` and restart your terminal.

**Database connection error**  
Double-check that the password and port in your `.env` file match what you configured during PostgreSQL installation. The default port is `5432`.

**`Cannot find module 'dotenv'`**  
Run `npm install dotenv` and try again.

---
---

# ChessPvAI — Română

Joacă șah împotriva motorului Stockfish cu analiză în timp real a mutărilor, istoric complet al partidelor și clasament global. Construit cu SvelteKit și PostgreSQL, cu Stockfish rulând integral în browser prin Web Worker — nu este necesară nicio procesare pe server pentru joc.

---

## Cerințe prealabile

Asigură-te că ai instalate următoarele:

- [Node.js](https://nodejs.org/) — v18 sau mai nou
- [PostgreSQL](https://www.postgresql.org/download/) — v14 sau mai nou

---

## Instalare

### 1. Clonează depozitul

```bash
git clone https://github.com/DaPedala/ChessPvAI.git
cd ChessPvAI
```

### 2. Instalează dependențele

```bash
npm install
```

---

## Configurarea bazei de date

### 3. Instalează PostgreSQL

Descarcă și instalează PostgreSQL de la [postgresql.org](https://www.postgresql.org/download/).  
În timpul instalării, vei fi rugat să setezi o parolă pentru utilizatorul implicit `postgres`. **Reține-o — vei avea nevoie de ea la pasul 6.**  
Nu trebuie să pornești serverul manual la finalul instalării; PostgreSQL rulează automat ca serviciu de fundal.

După instalare, verifică că `psql` este disponibil în terminal:

```bash
psql --version
```

> **Windows:** Dacă comanda nu este recunoscută, adaugă folderul `bin` al PostgreSQL în variabila de sistem `PATH`  
> (ex: `C:\Program Files\PostgreSQL\16\bin`), apoi repornește terminalul.

### 4. Creează baza de date

```bash
psql -U postgres -c "CREATE DATABASE chesspvai;"
```

Introdu parola utilizatorului `postgres` când este cerută.

### 5. Aplică schema

```bash
psql -U postgres -d chesspvai -f schema.sql
```

Această comandă creează tabelele `users`, `sessions`, `games` și `moves`.

### 6. Configurează variabilele de mediu

Creează un fișier numit `.env` în rădăcina proiectului cu următorul conținut:

```env
DATABASE_URL=postgresql://postgres:PAROLA_TA@localhost:5432/chesspvai
```

Înlocuiește `PAROLA_TA` cu parola setată în timpul instalării PostgreSQL.

---

## Pornirea aplicației

```bash
npm run dev
```

Deschide [http://localhost:5173](http://localhost:5173) în browser.

---

## Tehnologii folosite

| Strat | Tehnologie |
|---|---|
| Framework | SvelteKit |
| Limbaj | TypeScript |
| Motor de șah | Stockfish (Web Worker) |
| Validare mutări | chess.js |
| Bază de date | PostgreSQL |
| Autentificare | bcryptjs + cookie de sesiune |

---

## Probleme frecvente

**`psql` nu este recunoscut**  
Adaugă directorul `bin` al PostgreSQL în `PATH` și repornește terminalul.

**Eroare de conexiune la baza de date**  
Verifică că parola și portul din fișierul `.env` corespund cu cele configurate în timpul instalării PostgreSQL. Portul implicit este `5432`.

**`Cannot find module 'dotenv'`**  
Rulează `npm install dotenv` și încearcă din nou.
