# 📊 Estado Actual del Proyecto y Guía de Reconexión

## 🔍 RESUMEN DEL ESTADO ACTUAL

### ✅ Lo que SÍ está funcionando:

1. **GitHub** ✅
   - Repositorio conectado: `https://github.com/marialo20030-code/Entramado.webreal.git`
   - El código está subido y sincronizado
   - Branch: `main`

2. **Código Local** ✅
   - Todos los archivos del proyecto están en tu computadora
   - Las migraciones SQL están en `supabase/migrations/`
   - El código fuente está completo

3. **Vercel** (probablemente conectado)
   - Si ya desplegaste antes, el proyecto debería estar en Vercel
   - Necesitas verificar las variables de entorno

### ❌ Lo que NO está funcionando:

1. **Supabase - Datos Borrados** ❌
   - El proyecto de Supabase original se borró o se pausó
   - Los datos (publicaciones, usuarios, carpetas) se perdieron
   - **NO se pueden recuperar** los datos antiguos
   - Necesitas crear un **proyecto nuevo** de Supabase

2. **Variables de Entorno** ⚠️
   - Las credenciales antiguas ya no funcionan
   - Necesitas actualizar las credenciales en:
     - Archivo `.env` local (si existe)
     - Variables de entorno en Vercel

---

## 📋 QUÉ PASÓ CON LOS DATOS

### ¿Por qué se borraron los datos?

Los proyectos gratuitos de Supabase pueden:
- **Pausarse automáticamente** si no se usan por un tiempo
- **Borrar datos** si el proyecto se elimina
- **Perder acceso** si la cuenta se desvincula

**IMPORTANTE:** Los datos que estaban en Supabase **NO se pueden recuperar** porque:
- No hay backup automático en el plan gratuito
- Una vez borrado, no hay forma de recuperarlos
- El proyecto original ya no existe

### ¿Dónde están los datos ahora?

**NO están en ningún lado.** Se perdieron cuando se borró el proyecto de Supabase.

**Lo que SÍ tienes:**
- ✅ El código de la aplicación (en GitHub y local)
- ✅ Las migraciones SQL (para recrear las tablas)
- ✅ La estructura de la base de datos (en los archivos SQL)

**Lo que NO tienes:**
- ❌ Las publicaciones que creaste antes
- ❌ Los usuarios registrados
- ❌ Las carpetas creadas
- ❌ Cualquier dato que estaba en Supabase

---

## 🔧 QUÉ HACER AHORA - PASO A PASO

### PASO 1: Crear Nuevo Proyecto en Supabase

**Sigue el archivo:** `CREAR-PROYECTO-NUEVO-SUPABASE.md`

**Resumen rápido:**
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión (o crea cuenta)
3. Crea un proyecto nuevo:
   - Nombre: `entramado` o `entramado-web`
   - Región: La más cercana a ti
   - Plan: Free
   - **Guarda la contraseña de la base de datos**
4. Espera 1-2 minutos a que se cree

### PASO 2: Obtener las Nuevas Credenciales

1. En tu proyecto de Supabase:
   - Ve a **Settings** (⚙️) → **API**
2. Copia:
   - **Project URL** → Esta es tu `VITE_SUPABASE_URL`
   - **anon public** key → Esta es tu `VITE_SUPABASE_ANON_KEY`

### PASO 3: Ejecutar las Migraciones SQL

**IMPORTANTE:** Necesitas ejecutar TODAS las migraciones en orden:

1. Ve a **SQL Editor** en Supabase
2. Ejecuta cada archivo en este orden:

```
1. supabase/migrations/20251102032754_create_core_tables.sql
2. supabase/migrations/20251103003036_update_schema_for_features.sql
3. supabase/migrations/20251104014535_add_media_types_and_user_info.sql
4. supabase/migrations/20251105000000_add_draft_support.sql
5. supabase/migrations/20251106000000_add_email_to_user_profiles.sql
6. supabase/migrations/20250102000000_create_aportes_table.sql
```

**Cómo ejecutar:**
- Abre cada archivo SQL
- Copia TODO el contenido
- Pégalo en el SQL Editor de Supabase
- Haz clic en "Run"
- Verifica que diga "Success"

### PASO 4: Actualizar Variables de Entorno Localmente

1. **Crea o actualiza el archivo `.env`** en:
   ```
   project-bolt-sb1-fqlqsuxu/project/.env
   ```

2. **Agrega estas líneas:**
   ```env
   VITE_SUPABASE_URL=https://tu-nueva-url.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-nueva-clave-muy-larga
   ```

3. **⚠️ IMPORTANTE:**
   - No dejes espacios extra
   - No pongas comillas
   - Copia exactamente como aparece en Supabase

### PASO 5: Actualizar Variables en Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Entra a tu proyecto**
3. **Ve a Settings → Environment Variables**
4. **Actualiza o agrega:**
   - `VITE_SUPABASE_URL` = Tu nueva URL
   - `VITE_SUPABASE_ANON_KEY` = Tu nueva clave
5. **Marca las 3 casillas:** Production, Preview, Development
6. **Haz Redeploy:**
   - Ve a "Deployments"
   - Haz clic en los 3 puntos (⋯) del último deploy
   - "Redeploy"
   - Espera 2-3 minutos

### PASO 6: Limpiar y Reiniciar Localmente

1. **Limpiar Local Storage del navegador:**
   - Abre `http://localhost:5173` (si el servidor está corriendo)
   - Presiona F12 (DevTools)
   - Ve a "Application" → "Local Storage"
   - Elimina todas las claves que empiecen con `sb-` o `supabase`

2. **Reiniciar el servidor:**
   - Detén el servidor (Ctrl+C)
   - Vuelve a iniciarlo: `npm run dev`

3. **Probar:**
   - Crea un nuevo usuario
   - Inicia sesión
   - Crea una publicación de prueba

---

## 👥 TRABAJAR CON TU COMPAÑERO DESDE MAC

### Configuración Inicial para tu Compañero (Mac)

#### 1. Clonar el Repositorio

```bash
# Abre Terminal en Mac
cd ~/Desktop  # o donde quieras guardar el proyecto

# Clonar el repositorio
git clone https://github.com/marialo20030-code/Entramado.webreal.git

# Entrar al proyecto
cd Entramado.webreal
```

#### 2. Instalar Dependencias

```bash
# Instalar Node.js si no lo tiene (desde nodejs.org)
# Luego instalar dependencias:
npm install
```

#### 3. Crear Archivo .env

```bash
# Crear archivo .env
touch .env

# Editar el archivo (puede usar nano o cualquier editor)
nano .env
```

**Agregar estas líneas al archivo `.env`:**
```env
VITE_SUPABASE_URL=https://tu-nueva-url.supabase.co
VITE_SUPABASE_ANON_KEY=tu-nueva-clave-muy-larga
```

**Guardar y salir** (en nano: Ctrl+X, luego Y, luego Enter)

#### 4. Iniciar el Servidor

```bash
npm run dev
```

El servidor debería iniciar en `http://localhost:5173`

---

### Flujo de Trabajo en Equipo

#### Para Subir Cambios (Cualquiera de los dos)

**En Windows (tú):**
```bash
cd "C:\Users\maria\Desktop\entramado\project-bolt-sb1-fqlqsuxu\project"
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

**En Mac (tu compañero):**
```bash
cd ~/Desktop/Entramado.webreal
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

#### Para Obtener Cambios del Otro

**Siempre antes de empezar a trabajar:**
```bash
git pull origin main
```

Esto descarga los últimos cambios del otro.

---

### ⚠️ IMPORTANTE: Compartir Credenciales de Supabase

**Las credenciales de Supabase son las MISMAS para ambos:**

1. **Comparte con tu compañero:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Forma segura de compartir:**
   - Por mensaje privado (WhatsApp, Telegram, etc.)
   - O por email
   - **NO las subas a GitHub** (están en .gitignore)

3. **Ambos deben tener el mismo archivo `.env`** con las mismas credenciales

---

### Conflictos de Git (Si Ambos Editan lo Mismo)

**Si hay conflictos al hacer `git pull`:**

1. Git te mostrará qué archivos tienen conflictos
2. Abre esos archivos
3. Busca las marcas `<<<<<<<`, `=======`, `>>>>>>>`
4. Decide qué código mantener (o combina ambos)
5. Guarda el archivo
6. Haz:
   ```bash
   git add .
   git commit -m "Resuelto conflicto"
   git push origin main
   ```

**Consejo:** Comunícense antes de editar los mismos archivos.

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Para Ti (Windows):

- [ ] Creé un nuevo proyecto en Supabase
- [ ] Obtuve las nuevas credenciales
- [ ] Ejecuté todas las migraciones SQL (6 archivos)
- [ ] Verifiqué que las tablas se crearon en Supabase
- [ ] Actualicé el archivo `.env` local con las nuevas credenciales
- [ ] Actualicé las variables de entorno en Vercel
- [ ] Hice redeploy en Vercel
- [ ] Limpié el Local Storage del navegador
- [ ] Reinicié el servidor local
- [ ] Probé crear un usuario nuevo
- [ ] Probé crear una publicación
- [ ] El código está sincronizado con GitHub (`git push`)

### Para tu Compañero (Mac):

- [ ] Clonó el repositorio de GitHub
- [ ] Instaló las dependencias (`npm install`)
- [ ] Creó el archivo `.env` con las credenciales que le compartiste
- [ ] Puede iniciar el servidor (`npm run dev`)
- [ ] Puede ver la aplicación en `http://localhost:5173`
- [ ] Puede crear un usuario
- [ ] Puede iniciar sesión
- [ ] Puede crear una publicación

---

## 🔗 CONEXIONES ACTUALES

### GitHub
- **Repositorio:** `https://github.com/marialo20030-code/Entramado.webreal.git`
- **Branch:** `main`
- **Estado:** ✅ Conectado y funcionando

### Supabase
- **Estado:** ❌ Proyecto anterior borrado
- **Acción necesaria:** Crear proyecto nuevo
- **Datos:** ❌ Perdidos (no recuperables)

### Vercel
- **Estado:** ⚠️ Necesita verificación
- **Acción necesaria:** Actualizar variables de entorno y redeploy

### Archivo .env Local
- **Estado:** ⚠️ Necesita actualización con nuevas credenciales
- **Ubicación:** `project-bolt-sb1-fqlqsuxu/project/.env`

---

## 🆘 SI ALGO NO FUNCIONA

### Error: "Failed to fetch" o conexión a Supabase

**Solución:**
- Verifica que las credenciales en `.env` sean correctas
- Verifica que no haya espacios extra
- Reinicia el servidor
- Verifica que el proyecto de Supabase esté activo (no pausado)

### Error: "Invalid API key"

**Solución:**
- Verifica que copiaste la clave completa (es muy larga)
- Asegúrate de copiar la clave "anon public", no "service_role"
- Verifica que no haya espacios al inicio o final

### No puedo crear usuario

**Solución:**
- Verifica que ejecutaste TODAS las migraciones SQL
- Revisa la tabla `user_profiles` en Supabase Table Editor
- Abre la consola del navegador (F12) y busca errores

### Vercel no muestra mis cambios

**Solución:**
- Verifica que hiciste `git push` a GitHub
- Espera 2-3 minutos (Vercel detecta cambios automáticamente)
- O haz redeploy manual en Vercel

---

## 📝 NOTAS IMPORTANTES

1. **Los datos antiguos NO se pueden recuperar** - Es un proyecto nuevo desde cero
2. **Ambos deben usar las MISMAS credenciales de Supabase** - Comparte el `.env`
3. **Siempre hagan `git pull` antes de empezar a trabajar** - Para tener los últimos cambios
4. **NO suban el archivo `.env` a GitHub** - Está en `.gitignore` por seguridad
5. **Comuníquense antes de editar los mismos archivos** - Para evitar conflictos

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Crear nuevo proyecto en Supabase
2. ✅ Ejecutar migraciones SQL
3. ✅ Actualizar credenciales en `.env` local
4. ✅ Actualizar credenciales en Vercel
5. ✅ Compartir credenciales con tu compañero
6. ✅ Tu compañero clona el repositorio y configura `.env`
7. ✅ Ambos pueden trabajar en el proyecto

---

**¡Sigue estos pasos y todo estará reconectado y funcionando!** 🚀



