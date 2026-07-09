# 🎾 Rallyyo - Software Architecture

## Objetivo

Definir la arquitectura general de Rallyyo para garantizar una aplicación escalable, mantenible y preparada para futuras funcionalidades.

---

# Tecnologías

## Frontend Web

- React
- Vite
- React Router
- CSS Modules (o Tailwind en el futuro)
- Lucide React

---

## Backend

Supabase

Servicios utilizados:

- Authentication
- PostgreSQL Database
- Realtime
- Storage
- Row Level Security (RLS)

---

## Futuro móvil

React Native + Expo

El objetivo es reutilizar gran parte de la lógica del frontend.

---

# Arquitectura

Usuario

↓

React

↓

Supabase Client

↓

Authentication

↓

Database

↓

Realtime

↓

Storage

---

# Base de datos

Principales tablas

## profiles

Información del usuario.

Campos principales:

- id
- username
- full_name
- avatar_url
- level
- city
- created_at

---

## matches

Información del partido.

Campos principales:

- id
- creator_id
- title
- match_date
- match_time
- location
- level_required
- max_players
- status

---

## match_players

Relaciona usuarios con partidos.

Campos:

- id
- match_id
- player_id
- joined_at

---

## messages

Mensajes del chat.

Campos:

- id
- match_id
- sender_id
- message
- created_at

---

## ratings (Futuro)

Valoraciones entre jugadores.

---

## badges (Futuro)

Insignias obtenidas.

---

# Flujo de autenticación

Usuario

↓

Login

↓

Supabase Auth

↓

JWT

↓

Acceso a la aplicación

---

# Flujo de creación de partido

Usuario

↓

Formulario

↓

Validación

↓

Insert en matches

↓

Insert automático en match_players

↓

Actualizar Home

↓

Actualizar Explorar

↓

Actualizar Mis partidos

---

# Flujo para unirse a un partido

Usuario

↓

Detalle partido

↓

Unirse

↓

Insert en match_players

↓

Actualizar número de jugadores

↓

Actualizar estado del partido

↓

Enviar evento Realtime

---

# Flujo del chat

Usuario

↓

Enviar mensaje

↓

Insert en messages

↓

Realtime

↓

Actualizar chat de todos los participantes

---

# Seguridad

Todas las tablas utilizarán Row Level Security.

Principios:

- Solo un usuario autenticado puede acceder.
- Solo el creador puede modificar un partido.
- Solo los participantes pueden acceder al chat.
- Cada usuario solo podrá modificar su propio perfil.

---

# Organización del frontend

src/

components/

pages/

hooks/

services/

contexts/

lib/

assets/

styles/

utils/

types/

---

# Organización de componentes

Cada componente tendrá:

Componente

CSS

Tests (futuro)

Ejemplo:

Button/

Button.jsx

Button.module.css

---

# Estado global

Utilizar Context API para:

- Usuario autenticado
- Sesión
- Perfil

El resto de datos se cargarán desde Supabase.

---

# Gestión de errores

Todas las operaciones deberán controlar:

- Error de conexión.
- Error de autenticación.
- Error de permisos.
- Error del servidor.

Siempre mostrando un mensaje claro al usuario.

---

# Objetivos técnicos

Código limpio.

Componentes reutilizables.

Funciones pequeñas.

Evitar duplicación.

Separar lógica y presentación.

---

# Escalabilidad

La arquitectura debe permitir añadir fácilmente:

- Amigos
- Equipos
- Torneos
- Ranking
- Compatibilidad
- IA
- Notificaciones Push
- Aplicación móvil