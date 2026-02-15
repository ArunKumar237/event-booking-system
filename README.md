# Event Booking System

## Overview
Event Booking System is a full-stack application for booking predefined event time slots in a weekly calendar view.
It uses Django + DRF on the backend and Angular standalone components on the frontend.

Core capabilities include:
- Session-based login/logout and CSRF-safe API access
- Weekly timeslot browsing and booking
- User preferences
- Admin-only API module for user, booking, and timeslot management

## Implemented Features

### User APIs (`/api/`)
- `POST /api/login/`
- `GET /api/me/`
- `POST /api/logout/`
- `GET /api/csrf/`
- `GET /api/categories/`
- `GET /api/timeslots/`
- `POST /api/timeslots/{id}/book/`
- `POST /api/timeslots/{id}/unsubscribe/`
- `GET /api/preferences/`
- `POST /api/preferences/`

### Admin APIs (`/api/admin/`)
Protected with DRF `IsAdminUser` (staff/admin only):
- `GET /api/admin/users/` (list users)
- `PATCH /api/admin/users/{id}/` (activate/deactivate user)
- `GET /api/admin/bookings/` (all bookings with user + timeslot info)
- `GET /api/admin/timeslots/` (all timeslots admin view)

### Booking Integrity
- Booking/unsubscribe uses DB transactions with `select_for_update()` to prevent concurrent race issues.

## Production Readiness (Implemented)
- Environment-based settings via `python-decouple`
  - `SECRET_KEY`
  - `DEBUG`
  - `ALLOWED_HOSTS`
  - CORS/CSRF origin settings
  - security toggles and API defaults
- Secure production defaults/toggles:
  - `SESSION_COOKIE_SECURE`
  - `CSRF_COOKIE_SECURE`
  - `SECURE_SSL_REDIRECT`
  - `SECURE_HSTS_*`
  - `X_FRAME_OPTIONS`, `SECURE_CONTENT_TYPE_NOSNIFF`, `SECURE_REFERRER_POLICY`
- DRF defaults configured:
  - `SessionAuthentication`
  - Global pagination (`PageNumberPagination`, configurable page size)
  - Optional throttling via env
- Centralized DRF exception handling:
  - standardized error response format:
    - `{"status": "error", "message": "..."}`
- Basic Django logging configuration for runtime and request errors.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Angular 21 (standalone), TypeScript, RxJS |
| Backend | Django 6, Django REST Framework |
| DB | SQLite (default local) |
| API Docs | drf-yasg (`/swagger/`, `/redoc/`) |
| Auth | Django session auth + CSRF |

## Local Setup

### Prerequisites
- Node.js 20+
- npm
- Python 3.12+
- `venv` + `pip`

### Backend
```bash
cd backend
python -m venv ../venv
# Windows PowerShell
..\venv\Scripts\Activate.ps1
# macOS/Linux
# source ../venv/bin/activate

pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Frontend
```bash
cd frontend/event-booking-ui
npm install
npm run start:proxy
```

### URLs
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8000`
- Django Admin: `http://localhost:8000/admin/`
- Swagger: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Environment Variables
See `backend/.env.example` for all supported keys.

Key variables:
- `DJANGO_ENV` (`development` or `production`)
- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `CSRF_TRUSTED_ORIGINS`
- `API_PAGE_SIZE`
- `DRF_THROTTLE_ANON_RATE`, `DRF_THROTTLE_USER_RATE`
- `DJANGO_LOG_LEVEL`

## Project Structure
```text
event-booking-system/
|-- backend/
|   |-- event_booking/          # Django project config
|   |-- events/                 # Domain app (models/views/serializers/admin)
|   |-- .env.example
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/
|   `-- event-booking-ui/
|       |-- src/app/
|       |-- proxy.conf.json
|       |-- angular.json
|       `-- package.json
`-- README.md
```

## Notes
- Existing user-facing API contract and behavior are preserved while adding admin and production readiness features.
- Automated tests are currently minimal and should be expanded for stronger release confidence.
