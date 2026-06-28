# Libro Interactivo 3D de Probabilidad y Estadística

Plataforma educativa full-stack con estética de libro antiguo de fantasía, contenidos interactivos, minijuegos, progreso persistente y un dashboard administrativo para gestionar usuarios, resultados, rankings y bitácora.

**Autores:**

- Alejandro Ojeda
- Juan Figueroa
- Josué Vélez

## Tecnologías

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios y Lucide React.
- Backend: Node.js, Express, SQLite, JWT y bcryptjs.
- Seguridad: contraseñas cifradas, rutas protegidas, roles `student`/`admin` y estados `active`/`suspended`.
- Diseño: responsive, animaciones CSS 3D, cuero, filigrana dorada y páginas tipo pergamino.

## Instalación y ejecución

Abre dos terminales PowerShell en la raíz del proyecto.

### Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Aplicación: [http://localhost:5173](http://localhost:5173)

## Credenciales de demostración

### Estudiante

- Correo: `demo@libro.com`
- Contraseña: `123456`

### Administrador

- Correo: `admin@libro.com`
- Contraseña: `123456`

Ambos usuarios se crean automáticamente al iniciar el backend. Si ya existen, se restauran sus credenciales, rol y estado activo sin duplicarlos.

Después del login:

- El estudiante es dirigido automáticamente a `/book`.
- El administrador es dirigido automáticamente a `/admin`.

## Navegación del libro

La ruta `/` presenta el libro cerrado. Sin sesión, intentar abrirlo muestra un modal con acceso a login y registro. Con una sesión válida, el botón abre la experiencia 3D.

El libro contiene 18 páginas organizadas en:

1. Portada interna con autores.
2. Prólogo.
3. Índice interactivo.
4. Cuatro páginas por unidad: introducción, fórmulas, video y ejercicio/minijuego.
5. Resultados, ranking y epílogo.

Los marcadores laterales permiten saltar a Portada, Índice, U1, U2, U3, Juegos y Resultados. En laptop se muestran dos páginas; en móvil se presenta una página vertical.

## Rutas principales

### Públicas

- `/`
- `/login`
- `/register`

### Estudiante

- `/dashboard`
- `/book`
- `/book/unit/:id`
- `/game/bayes`
- `/game/statistics`
- `/game/random-variables`
- `/my-results`
- `/leaderboard`

### Administración

- `/admin`
- `/admin/users`
- `/admin/users/:id`
- `/admin/results`
- `/admin/leaderboard`
- `/admin/audit-logs`

## API

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registra un estudiante |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve JWT |
| `GET` | `/api/auth/me` | Devuelve el usuario autenticado |
| `POST` | `/api/auth/logout` | Registra y confirma el cierre de sesión |

### Resultados

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/results` | Guarda un resultado |
| `GET` | `/api/results/my-results` | Historial personal |
| `GET` | `/api/results/summary` | Resumen, mejor unidad y último intento |
| `GET` | `/api/results/leaderboard` | Ranking general |

### Administración

Todas requieren JWT de un usuario con rol `admin`.

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Métricas y actividad reciente |
| `GET` | `/api/admin/users` | Lista usuarios y estadísticas |
| `GET` | `/api/admin/users/:id` | Expediente de usuario |
| `PUT` | `/api/admin/users/:id` | Edita datos, rol o estado |
| `PATCH` | `/api/admin/users/:id/suspend` | Suspende un usuario |
| `PATCH` | `/api/admin/users/:id/activate` | Reactiva un usuario |
| `DELETE` | `/api/admin/users/:id` | Elimina usuario y resultados asociados |
| `GET` | `/api/admin/results` | Lista todos los resultados |
| `DELETE` | `/api/admin/results/:id` | Elimina un resultado |
| `GET` | `/api/admin/leaderboard` | Ranking administrativo completo |
| `GET` | `/api/admin/audit-logs` | Consulta la bitácora |

## Dashboard administrativo

1. Inicia sesión con `admin@libro.com`.
2. El sistema redirige automáticamente a `/admin`.
3. Desde la navegación superior puedes gestionar usuarios, resultados, ranking y bitácora.
4. Suspender, eliminar o cambiar un rol requiere confirmación.
5. El administrador no puede suspenderse, quitarse el rol ni eliminarse a sí mismo.

## SQLite

`backend/database.sqlite` se crea automáticamente. Las columnas nuevas y la tabla `audit_logs` se agregan mediante migraciones aditivas, conservando datos existentes.

Para comprobar las tablas con SQLite CLI:

```powershell
cd backend
sqlite3 database.sqlite ".tables"
sqlite3 database.sqlite "PRAGMA table_info(users);"
sqlite3 database.sqlite "SELECT action, description, created_at FROM audit_logs ORDER BY id DESC LIMIT 10;"
```

Si no tienes SQLite CLI, el funcionamiento puede verificarse desde `/admin/audit-logs`.

## Compilación

```powershell
cd frontend
npm run build
```

El resultado se genera en `frontend/dist`, carpeta excluida de Git.

## Seguridad básica

- Nunca se devuelve `password_hash` en respuestas.
- El registro público siempre crea usuarios `student`.
- Las cuentas suspendidas no pueden iniciar sesión ni usar tokens existentes.
- El JWT contiene `id`, `email` y `role`.
- Las operaciones administrativas se registran en `audit_logs`.
- Cambia `JWT_SECRET` en `backend/.env` antes de un despliegue real.
