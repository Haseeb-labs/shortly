[README(2).md](https://github.com/user-attachments/files/26231149/README.2.md)
# snip.io — URL Shortener

A simple URL shortener built with FastAPI on the backend and React on the frontend. Paste a long URL, get a short one back. That's it.

---

## What's inside

```
project/
├── main.py           — FastAPI backend
├── urls.db           — SQLite database (auto-created on first run)
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
└── requirements.txt
```

---

## Prerequisites

Make sure you have these installed before starting:

- Python 3.10 or higher — https://www.python.org/downloads
- Node.js 18 or higher — https://nodejs.org
- pip (comes with Python)

You can check your versions by running:

```bash
python --version
node --version
npm --version
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Haseeb-labs/shortly.git
cd shortly
```

### 2. Set up the backend

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
```

Activate it:

On Windows:
```bash
.venv\Scripts\activate
```

On Mac or Linux:
```bash
source .venv/bin/activate
```

Install the required packages:

```bash
pip install fastapi uvicorn sqlalchemy pydantic
```

### 3. Set up the frontend

```bash
cd frontend
npm install
cd ..
```

---

## Running locally

You need two terminals running at the same time.

**Terminal 1 — start the backend:**

```bash
uvicorn main:app --reload
```

The API will be running at http://localhost:8000

**Terminal 2 — start the frontend:**

```bash
cd frontend
npm start
```

The app will open automatically at http://localhost:3000

---

## How it works

- Visit http://localhost:3000 in your browser
- Paste any long URL into the input field and click Shorten
- You get a short URL like `http://localhost:8000/abc123`
- Visiting that short URL redirects you to the original
- All your links are listed on the page with copy and delete options

---

## API endpoints

If you want to use the backend directly:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/shorten` | Create a short URL |
| GET | `/all` | List all URLs |
| GET | `/{short_code}` | Redirect to original URL |
| DELETE | `/delete/{short_code}` | Delete a short URL |

Interactive API docs are available at http://localhost:8000/docs while the backend is running.

---

## Common issues

**Port already in use**

If you get an error saying port 8000 is in use, kill the process or run the backend on a different port:

```bash
uvicorn main:app --reload --port 8001
```

**npm install fails**

Delete the `node_modules` folder and `package-lock.json` inside the frontend folder and try again:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Database errors**

The `urls.db` file is created automatically. If something seems broken, delete it and restart the backend — it will be recreated fresh:

```bash
rm urls.db
uvicorn main:app --reload
```

---

## Tech stack

- Backend: FastAPI, SQLAlchemy, SQLite, Pydantic
- Frontend: React, plain CSS
