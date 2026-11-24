# TaskManager

Aplicación full stack para gestionar tareas. Permite crear, listar, ver, editar y eliminar tareas, filtrarlas por estado y cambiar su estado rápidamente desde el listado.

Cada tarea tiene título, descripción opcional, responsable, fecha límite, prioridad (`low`, `medium`, `high`) y estado (`pending`, `in_progress`, `completed`). El listado se devuelve ordenado por fecha de creación, de la más reciente a la más antigua.

## Tecnologías utilizadas

**Backend**
- Python 3.12
- FastAPI + Uvicorn
- SQLAlchemy 2 + Alembic (migraciones)
- PostgreSQL 16 (driver `psycopg`)
- pydantic-settings (configuración por variables de entorno)
- uv (gestor de dependencias)

**Frontend**
- React 19 + TypeScript + Vite
- Bootstrap 5, Bootstrap Icons y react-bootstrap
- React Router
- Axios

**Infraestructura**
- Docker y Docker Compose

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose (para la ejecución con contenedores y para la base de datos en local).
- Para ejecutar sin Docker el backend y el frontend:
  - [Python 3.12+](https://www.python.org/) y [uv](https://docs.astral.sh/uv/)
  - [Node.js 22+](https://nodejs.org/) y npm

## Estructura del proyecto

```
taskmanager/
├── docker-compose.yml       # db + backend + frontend
├── backend/
│   ├── app/
│   │   ├── main.py          # aplicación FastAPI y CORS
│   │   ├── config/          # settings (variables de entorno)
│   │   ├── controllers/     # endpoints (routers)
│   │   ├── services/        # lógica de negocio
│   │   ├── repositories/    # acceso a datos
│   │   ├── models/          # modelos SQLAlchemy
│   │   ├── schemas/         # esquemas Pydantic
│   │   └── database/        # conexión y base declarativa
│   ├── alembic/             # migraciones
│   ├── .env.example
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── components/      # layout/ y tasks/
    │   ├── pages/           # TasksPage, TaskDetailPage, TaskFormPage
    │   ├── services/        # taskService.ts (cliente Axios)
    │   ├── hooks/           # useTasks
    │   ├── types/
    │   └── utils/
    ├── .env.example
    └── Dockerfile
```

## Variables de entorno

### Backend (`backend/.env`)

Copia la plantilla y rellena los valores:

```bash
cp backend/.env.example backend/.env
```

| Variable | Descripción |
|---|---|
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_HOST` | Host de la base de datos (por defecto `localhost`; en Docker Compose se fija a `db`) |
| `POSTGRES_PORT` | Puerto de PostgreSQL (por defecto `5432`) |
| `CORS_ORIGINS` | Orígenes permitidos, separados por comas (por defecto `http://localhost:5173`) |

El mismo archivo lo usa el contenedor de PostgreSQL para crear el usuario y la base de datos.

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la API que consume el navegador (por defecto `http://localhost:8000`) |

Los archivos `.env` no se suben a Git; solo las plantillas `.env.example`.

## Instalación de dependencias

```bash
# Backend
cd backend
uv sync

# Frontend
cd frontend
npm install
```

## Base de datos

Con Docker (recomendado), levanta solo el servicio de PostgreSQL desde la raíz:

```bash
docker compose up -d db
```

Queda disponible en `localhost:5432` con las credenciales de `backend/.env`, y los datos persisten en el volumen `pgdata`.

Después aplica las migraciones:

```bash
cd backend
uv run alembic upgrade head
```

Si usas una instancia propia de PostgreSQL, crea la base de datos y ajusta las variables `POSTGRES_*` de `backend/.env`.

## Ejecutar el backend

Con la base de datos en marcha y las migraciones aplicadas:

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

La API queda en <http://localhost:8000>.

## Ejecutar el frontend

```bash
cd frontend
npm run dev
```

La aplicación queda en <http://localhost:5173>. Otros scripts útiles: `npm run build` y `npm run lint`.

## Ejecutar con Docker

Con `backend/.env` creado, desde la raíz:

```bash
docker compose up --build
```

Esto levanta tres servicios:

| Servicio | Contenedor | URL |
|---|---|---|
| `db` | `taskmanager-db` | `localhost:5432` |
| `backend` | `taskmanager-backend` | <http://localhost:8000> |
| `frontend` | `taskmanager-frontend` | <http://localhost:5173> |

El backend aplica las migraciones (`alembic upgrade head`) antes de arrancar. El frontend define `VITE_API_BASE_URL=http://localhost:8000` porque la API la consume el navegador, no el contenedor.

Para detener los servicios: `docker compose down` (añade `-v` para borrar también los datos de la base de datos).

## Documentación de la API

FastAPI genera la documentación automáticamente con el backend en marcha:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>
- Esquema OpenAPI: <http://localhost:8000/openapi.json>

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/tasks/?status=` | Lista tareas; filtro opcional por `pending`, `in_progress` o `completed` |
| `GET` | `/api/tasks/{id}` | Obtiene una tarea |
| `POST` | `/api/tasks/` | Crea una tarea (estado inicial `pending`) |
| `PUT` | `/api/tasks/{id}` | Actualiza una tarea |
| `PATCH` | `/api/tasks/{id}/status` | Cambia el estado, con cuerpo `{"status": "..."}` |
| `DELETE` | `/api/tasks/{id}` | Elimina una tarea (204 sin cuerpo) |

Errores: `404` con `{"detail": "..."}` si la tarea no existe y `422` con la lista de errores de validación.
