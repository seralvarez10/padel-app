# 🎾 Rallyyo - Design Guidelines

## Objetivo

Rallyyo es una aplicación móvil diseñada para facilitar que cualquier jugador de pádel pueda encontrar compañeros, organizar partidos y formar una comunidad de confianza.

Nuestro objetivo es ofrecer una experiencia rápida, intuitiva y centrada en las personas.

> "Encuentra un partido en menos de un minuto."

---

# Filosofía del producto

Rallyyo no pretende competir por ser la aplicación con más funcionalidades.

Queremos ser la aplicación más sencilla para organizar y encontrar partidos de pádel.

Las personas son el centro del producto.

No organizamos pistas.

Conectamos jugadores.

---

# Principios de diseño

## Simplicidad

Cada pantalla debe tener un único objetivo.

Ejemplos:

- Home → Descubrir partidos.
- Explorar → Buscar partidos.
- Crear partido → Organizar un partido.
- Perfil → Generar confianza.

Si una pantalla intenta hacer demasiadas cosas, debe simplificarse.

---

## Rapidez

Las acciones principales deben requerir el menor número posible de pasos.

Objetivos:

- Registro en menos de 2 minutos.
- Crear un partido en menos de 30 segundos.
- Encontrar un partido en menos de 1 minuto.

---

## Consistencia

Todos los componentes reutilizables deben mantener el mismo estilo visual.

Botones, tarjetas, colores, iconos y tipografías deben ser consistentes en toda la aplicación.

---

## Confianza

Los usuarios necesitan saber con quién van a jugar.

Los perfiles deben transmitir confianza mediante:

- Valoraciones.
- Nivel.
- Historial.
- Insignias.
- Estadísticas.

---

# Identidad visual

## Colores

### Primario

Verde.

Representa:

- Pádel.
- Césped.
- Energía.
- Naturaleza.

### Secundarios

Blanco.

Utilizado para mantener una interfaz limpia y con mucho espacio visual.

Gris oscuro.

Utilizado para textos principales.

Gris claro.

Utilizado para bordes y fondos secundarios.

---

# Tipografía

La aplicación utilizará una única familia tipográfica.

Jerarquía:

- H1
- H2
- H3
- Body
- Caption
- Button

---

# Componentes

Los siguientes componentes deben ser reutilizables.

## Botón

Variantes:

- Primary
- Secondary
- Disabled
- Loading

---

## Match Card

Información mínima:

- Estado.
- Club.
- Fecha.
- Hora.
- Nivel.
- Jugadores.
- Acción principal.

---

## Input

Estados:

- Normal.
- Focus.
- Error.
- Disabled.

---

## Search Bar

Utilizada en:

- Explorar.
- Mis partidos.
- Futuras funcionalidades.

---

## Avatar

Utilizado en:

- Perfil.
- Chat.
- Participantes.
- Organizador.

---

## Bottom Navigation

La navegación principal estará formada por cinco apartados.

- Inicio
- Explorar
- Crear
- Mis partidos
- Perfil

La acción "Crear" tendrá mayor protagonismo.

---

# Navegación

Flujo principal:

Login

↓

Registro

↓

Home

↓

Explorar

↓

Detalle del partido

↓

Unirse

↓

Chat

↓

Partido

↓

Valoraciones

---

# MVP

La primera versión incluirá únicamente las funcionalidades esenciales.

## Autenticación

- Registro.
- Inicio de sesión.
- Cerrar sesión.

## Partidos

- Crear partido.
- Explorar partidos.
- Ver detalles.
- Unirse.
- Abandonar partido.

## Usuario

- Perfil.
- Mis partidos.
- Historial.

## Comunicación

- Chat por partido.

---

# Funcionalidades futuras

Estas funcionalidades quedan fuera del MVP.

## Comunidad

- Amigos.
- Favoritos.
- Seguir jugadores.

## Gamificación

- Insignias.
- Logros.
- Estadísticas avanzadas.

## Inteligencia

- Recomendación automática de partidos.
- Compatibilidad entre jugadores.
- Recomendaciones según nivel.

## Organización

- Lista de espera.
- Compartir partido.
- Invitaciones mediante enlace.

## Integraciones

- Google Maps.
- Calendario.
- Apple Wallet.
- Wear OS / Apple Watch.

---

# Reglas de desarrollo

Antes de implementar cualquier nueva funcionalidad deben responderse estas preguntas:

1. ¿Aporta valor al usuario?

2. ¿Hace más fácil encontrar u organizar un partido?

3. ¿Es necesaria para la versión actual?

Si la respuesta es "no", la funcionalidad pasa automáticamente a la lista de futuras mejoras.

---

# Visión

Queremos construir una aplicación moderna, intuitiva y centrada en las personas.

Rallyyo debe convertirse en el lugar donde cualquier jugador pueda encontrar un partido de pádel de forma rápida, segura y con confianza.

No queremos ser únicamente una aplicación para organizar partidos.

Queremos crear una comunidad de jugadores.

---

# Lema

**Juega más. Organiza menos.**