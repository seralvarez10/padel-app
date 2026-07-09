# 🎾 Rallyyo - Components

## Objetivo

Este documento define todos los componentes reutilizables de Rallyyo.

El objetivo es mantener una interfaz consistente y facilitar el desarrollo tanto en React como en React Native.

---

# Principios

Todos los componentes deben cumplir las siguientes normas:

- Ser reutilizables.
- Tener un único propósito.
- Mantener el mismo estilo visual.
- Adaptarse a diferentes tamaños de pantalla.
- Ser accesibles.

---

# Buttons

## Primary Button

Uso:

Acciones principales.

Ejemplos:

- Crear partido
- Unirse
- Guardar
- Iniciar sesión

Color:

Verde corporativo.

---

## Secondary Button

Uso:

Acciones secundarias.

Ejemplos:

- Cancelar
- Editar
- Volver

---

## Disabled Button

Uso:

Acciones no disponibles temporalmente.

---

## Loading Button

Uso:

Mientras se realiza una petición al servidor.

---

# Inputs

## Text Input

Utilizado para:

- Nombre
- Ciudad
- Descripción

Estados:

- Normal
- Focus
- Error
- Disabled

---

## Email Input

Utilizado únicamente para autenticación.

---

## Password Input

Incluye:

Mostrar/Ocultar contraseña.

---

## Search Input

Utilizado en:

- Explorar
- Mis partidos

---

# Cards

## Match Card

Información:

- Estado
- Club
- Fecha
- Hora
- Nivel
- Jugadores
- Botón

Utilizada en:

- Home
- Explorar
- Mis partidos

---

## Statistics Card

Utilizada en el perfil.

Ejemplos:

- Partidos jugados
- Compañeros
- Victorias

---

## Badge Card

Representa una insignia del jugador.

Ejemplos:

- Puntual
- Buen compañero
- Competitivo

---

# Avatar

Tamaños:

- XS
- S
- M
- L

Uso:

- Perfil
- Chat
- Organizador
- Participantes

---

# Rating

Representación visual de la valoración del usuario.

Formato:

⭐ 4.8

o

⭐⭐⭐⭐⭐

---

# Chips

Utilizados para filtros.

Ejemplos:

- Hoy
- Mañana
- Nivel 3.5
- Cerca
- Última plaza

---

# Bottom Navigation

Elementos:

- Inicio
- Explorar
- Crear
- Mis partidos
- Perfil

El botón "Crear" será el principal.

---

# Top Bar

Incluye:

- Título
- Botón volver (si aplica)

Opcionalmente:

- Botón de acciones.

---

# Modal

Utilizado para:

- Confirmaciones.
- Eliminar partido.
- Abandonar partido.

---

# Empty State

Pantallas sin contenido.

Ejemplos:

No tienes partidos.

No se encontraron resultados.

Todavía no hay mensajes.

Siempre incluirán:

- Icono.
- Mensaje.
- Acción recomendada.

---

# Loading

Se utilizarán Skeleton Loaders.

Nunca dejar la pantalla completamente en blanco.

---

# Toast

Mensajes temporales.

Ejemplos:

Partido creado correctamente.

Perfil actualizado.

Error al guardar.

---

# Diálogos

Confirmaciones.

Ejemplos:

¿Quieres abandonar el partido?

¿Eliminar este partido?

---

# Reutilización

Siempre que un componente ya exista deberá reutilizarse.

No se crearán componentes duplicados con el mismo propósito.

---

# Convención de nombres

Componentes React:

Button

MatchCard

ProfileHeader

SearchBar

BottomNavigation

Avatar

Badge

StatCard

Rating

Input

Toast

Modal

EmptyState

LoadingSkeleton