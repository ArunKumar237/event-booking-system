# Event Booking System

## Overview
Event Booking System is a full-stack web application for booking predefined event time slots in a weekly calendar view.  
Users can set category preferences, filter slots, subscribe to available events, and unsubscribe from their own bookings.  
The backend enforces booking integrity so each slot can be booked by only one user at a time.  
The application uses session-based authentication and CSRF protection with a proxy-based frontend integration to keep requests same-origin during development.

## Features

### User Features
- Select event preferences across `Cat 1`, `Cat 2`, and `Cat 3`
- View event slots in a weekly calendar
- Filter slots by category
- Subscribe to available slots
- Unsubscribe from booked slots
- See booked/unavailable slots and booking owner details

### Admin Features
- Access Django Admin to manage event data
- Add and maintain time slots
- View all slots with category, start/end time, and booking owner
- Manage users and categories

### Security Highlights
- CSRF protection enabled in Django middleware
- Explicit CSRF cookie bootstrap endpoint (`/api/csrf/`)
- Session-based authentication (`login`, `me`, `logout`)
- Backend authorization checks prevent users from unsubscribing other users
- Booking guard ensures only one user can book a slot at a time
- Frontend uses relative API URLs (`/api/...`) instead of hardcoded absolute hosts

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 (standalone components), TypeScript, RxJS |
| Backend | Django 6, Django REST Framework |
| Database | SQLite (default for local development) |
| API Docs | drf-yasg (Swagger/ReDoc endpoints configured) |
| Auth | Django session authentication |
| Security | Django CSRF middleware + same-origin proxy flow |
| Tooling | npm, Angular CLI, Python venv |

## Architecture
The frontend communicates with the backend using relative paths (`/api/...`) through an Angular proxy configuration. In local development, Angular runs on `localhost:4200` and proxies API traffic to Django on `localhost:8000`, avoiding cross-origin API URLs in client code.  
Session cookies and CSRF cookies are sent with `withCredentials: true`, and the backend validates authentication/authorization for protected operations (booking, unsubscribe, preferences).

## Getting Started

### Prerequisites
- Node.js `20+`
- npm `10+` (or compatible with your Node installation)
- Python `3.12+`
- `pip` and `venv`

### Backend Setup
```bash
cd backend
python -m venv ../venv
# Windows PowerShell
..\venv\Scripts\Activate.ps1
# macOS/Linux
# source ../venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Frontend Setup
```bash
cd frontend/event-booking-ui
npm install
npm run start:proxy
```

### Running the Application
- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8000`
- Django Admin: `http://localhost:8000/admin`
- Swagger UI: `http://localhost:8000/swagger/`

## API Notes
- Frontend calls use relative URLs such as:
  - `/api/timeslots/`
  - `/api/timeslots/:id/book/`
  - `/api/timeslots/:id/unsubscribe/`
  - `/api/preferences/`
- Proxy config (`proxy.conf.json`) forwards `/api` to `http://localhost:8000`.
- This design keeps client code environment-friendly and avoids hardcoding backend origins.

## Security Considerations
- CSRF protection is active (`CsrfViewMiddleware`) and the frontend initializes CSRF cookie acquisition via `/api/csrf/`.
- Session authentication is used for login state; authenticated endpoints require valid session cookies.
- Authorization is enforced server-side:
  - Users cannot unsubscribe bookings they do not own.
  - Already-booked slots cannot be booked again.
- Frontend API calls use relative paths and credentialed requests.
- Production hardening should include environment-managed secrets and `DEBUG=False`.

## Project Structure
```text
event-booking-system/
+-- backend/
�   +-- event_booking/          # Django project settings and root URLs
�   +-- events/                 # Domain app: models, views, serializers, admin
�   +-- manage.py
�   +-- requirements.txt
+-- frontend/
�   +-- event-booking-ui/
�       +-- src/app/            # Angular components/services
�       +-- proxy.conf.json
�       +-- angular.json
�       +-- package.json
+-- LICENSE
```

## Possible Future Improvements
1. Add Docker and `docker-compose` for reproducible local environments.
2. Add CI/CD pipeline for linting, tests, and automated deploy checks.
3. Introduce role-based access controls beyond Django admin defaults.
4. Add pagination and server-side query optimizations for larger slot datasets.
5. Expand automated test coverage (backend API + frontend component/service tests).
6. Add caching strategy for frequently accessed calendar/category data.

## Author
`Panuganti Arun Kumar`
