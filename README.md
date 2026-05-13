# Learning Platform MVP

A minimal viable product (MVP) for an AI-based learning platform that includes user authentication, lesson generation, lesson history, and an admin dashboard.

---

# Features

- User registration and login with JWT authentication
- Category and subcategory selection
- AI-generated lessons (or mock AI mode)
- Personal lesson history
- Admin dashboard for managing users, categories, subcategories, and lessons
- REST API built with FastAPI
- Docker-based local deployment

---

# Tech Stack

- **Backend:** Python + FastAPI
- **Frontend:** React + Vite
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **UI Library:** PrimeReact
- **Authentication:** JWT
- **Environment Management:** dotenv
- **Containerization:** Docker Compose

---

# Architecture

- The React frontend communicates with the FastAPI backend through REST APIs.
- PostgreSQL stores users, categories, subcategories, and lesson data.
- JWT is used for authentication and authorization.
- SQLAlchemy manages database operations.

---

# Project Structure

```text
frontend/               React + Vite frontend
python_backend/         FastAPI backend
docker-compose.yml      Docker services configuration
.env.example            Example environment variables
```

---

# Prerequisites

- Docker and Docker Compose

Optional for local development without Docker:
- Node.js and npm
- Python 3.11+

---

# Installation and Setup

## 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

## 2. Create the environment file

### Linux / macOS

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

---

## 3. Configure environment variables

Update `.env` with your local values:

```env
POSTGRES_USER=learning_user
POSTGRES_PASSWORD=learning_password
POSTGRES_DB=learning_platform

DATABASE_URL=postgresql://learning_user:learning_password@postgres:5432/learning_platform

SECRET_KEY=change-me-in-production

USE_MOCK_AI=true
OPENAI_API_KEY=your_openai_api_key_here

FIRST_ADMIN_NAME=admin
FIRST_ADMIN_LAST_NAME=admin
FIRST_ADMIN_PHONE=0500000000
FIRST_ADMIN_PASSWORD=admin123
```

> Important:  
> The `.env` file contains secrets and should not be committed to Git.

---

## 4. Run the system

```bash
docker compose up -d
```

---

## 5. Access the application

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

---

# Running Without Docker

## Backend

```bash
cd python_backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Frontend

```bash
cd frontend

npm install
npm run dev
```

> Make sure the `DATABASE_URL` in `.env` points to an active PostgreSQL database.

---

# Database Import

To import the provided database dump:

```bash
docker compose exec -T postgres psql -U learning_user learning_platform < db_dump.sql
```

Make sure:
- `db_dump.sql` is located in the project root directory
- `.env` contains the correct database credentials

---

# Important API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/token` | User login |
| GET | `/auth/me` | Current user details |
| GET | `/categories/` | List categories |
| GET | `/subcategories/` | List subcategories |
| GET | `/subcategories/category/{category_id}` | Subcategories by category |
| GET | `/prompts/` | Lesson history |
| POST | `/prompts/` | Generate a new lesson |
| GET | `/users/` | List users (admin only) |

---

# Admin Account

If the following environment variables are defined, the backend automatically creates an admin account during startup:

```env
FIRST_ADMIN_NAME=admin
FIRST_ADMIN_LAST_NAME=admin
FIRST_ADMIN_PHONE=0500000000
FIRST_ADMIN_PASSWORD=admin123
```

---

# Data Persistence

The PostgreSQL service uses a Docker volume named `postgres_data`.

This means:
- Database data is stored locally on your machine
- Data is not automatically pushed to Git
- Other users will not receive your local database unless you export or share it

---

# Notes

- The system uses JWT authentication.
- OAuth authentication is not implemented.
- AI lesson generation can work with OpenAI or mock mode.
- It is recommended to start the database and backend before opening the frontend.

---

# Troubleshooting

## Common Issues

### Docker Compose Fails to Start
- Ensure Docker and Docker Compose are installed and running.
- Check if ports 5173 (frontend), 8000 (backend), and 5432 (database) are available.
- Run `docker compose logs` to view error messages.

### Database Connection Errors
- Verify `.env` file exists and contains correct values.
- Ensure PostgreSQL container is running: `docker compose ps`.
- Check database logs: `docker compose logs postgres`.

### Frontend Not Loading
- Confirm backend is running on port 8000.
- Check browser console for errors.
- Ensure `VITE_API_BASE_URL` is set correctly if needed.

### Backend Errors
- Check backend logs: `docker compose logs python_backend`.
- Ensure all Python dependencies are installed.
- Verify database migrations have run.

### AI Service Not Working
- If using OpenAI, ensure `OPENAI_API_KEY` is set in `.env`.
- Switch to mock mode by setting `USE_MOCK_AI=true`.

---

# Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m "feat: add your feature"`.
4. Push to your branch: `git push origin feature/your-feature`.
5. Create a Pull Request.

## Code Style
- Follow PEP 8 for Python code.
- Use ESLint for JavaScript/React code.
- Write clear commit messages following conventional commits.

---

# License

This project is licensed under the MIT License - see the LICENSE file for details.

---

# GitHub Description

```text
Minimal AI-based learning platform with user authentication, lesson generation, lesson history, and admin management. Built with FastAPI, React/Vite, PostgreSQL, and Docker.
```