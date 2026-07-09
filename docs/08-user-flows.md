# 🎾 Rallyyo - User Flows

## Objetivo

Este documento describe los principales flujos de navegación de Rallyyo.

Cada flujo representa una tarea que un usuario puede realizar dentro de la aplicación.

---

# Flujo 1 - Registro

Usuario nuevo

↓

Abrir aplicación

↓

Pulsar "Crear cuenta"

↓

Introducir:

- Nombre
- Email
- Contraseña

↓

Crear cuenta

↓

Verificar email (si aplica)

↓

Acceder al Home

Objetivo:
El usuario debe estar registrado en menos de 2 minutos.

---

# Flujo 2 - Inicio de sesión

Abrir aplicación

↓

Introducir email

↓

Introducir contraseña

↓

Iniciar sesión

↓

Home

Objetivo:
Acceso rápido.

---

# Flujo 3 - Crear partido

Home

↓

Pulsar "Crear partido"

↓

Seleccionar:

- Club
- Fecha
- Hora
- Nivel
- Número máximo de jugadores

↓

Crear partido

↓

El partido aparece automáticamente en:

- Explorar
- Mis partidos

Objetivo:
Crear un partido en menos de 30 segundos.

---

# Flujo 4 - Buscar partido

Home

↓

Explorar

↓

Filtrar (opcional)

↓

Seleccionar partido

↓

Ver detalle

↓

Unirse

↓

Partido añadido a "Mis partidos"

Objetivo:
Encontrar un partido en menos de un minuto.

---

# Flujo 5 - Ver perfil de un jugador

Detalle del partido

↓

Seleccionar jugador

↓

Abrir perfil

↓

Consultar:

- Nivel
- Valoraciones
- Insignias
- Estadísticas

↓

Volver al partido

Objetivo:
Generar confianza antes de unirse.

---

# Flujo 6 - Chat del partido

Mis partidos

↓

Seleccionar partido

↓

Abrir chat

↓

Enviar mensaje

↓

Recibir respuestas

Objetivo:
Facilitar la organización del partido.

---

# Flujo 7 - Mis partidos

Home

↓

Mis partidos

↓

Ver:

- Próximos partidos
- Historial

↓

Seleccionar uno

↓

Abrir detalle

Objetivo:
Consultar rápidamente los partidos del usuario.

---

# Flujo 8 - Editar perfil

Perfil

↓

Editar perfil

↓

Modificar información

↓

Guardar cambios

↓

Perfil actualizado

Objetivo:
Mantener la información siempre actualizada.

---

# Flujo 9 - Cerrar sesión

Perfil

↓

Configuración

↓

Cerrar sesión

↓

Pantalla de Login

---

# Flujo general de navegación

Login
│
├── Registro
│
▼
Home
├── Explorar
│      │
│      ▼
│   Partido
│      │
│      ▼
│   Perfil jugador
│
├── Crear partido
│
├── Mis partidos
│      │
│      ▼
│     Chat
│
└── Perfil
       │
       ▼
Editar perfil

---

# Principios UX

Todos los flujos deben cumplir las siguientes normas:

- Máximo 3-4 pulsaciones para completar una acción habitual.
- El usuario nunca debe quedarse sin saber qué hacer a continuación.
- Siempre debe existir una acción principal claramente visible.
- Los botones principales utilizarán el color verde corporativo.
- La navegación debe poder realizarse cómodamente con una sola mano.

---

# Objetivos de la experiencia

Rallyyo debe transmitir:

- Rapidez.
- Simplicidad.
- Confianza.
- Comunidad.

Cada nueva funcionalidad deberá respetar estos principios.