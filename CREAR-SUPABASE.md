# 🗄️ Guía: Crear Proyecto de Supabase desde Cero

## 📝 ¿Qué está pasando?

Tu carpeta `supabase/migrations` contiene solo **archivos SQL** (el código de la base de datos), pero **NO hay un proyecto activo en Supabase**.

Necesitas:
1. Crear un proyecto nuevo en Supabase
2. Ejecutar las migraciones (los archivos SQL) en ese proyecto
3. Obtener las credenciales (URL y clave)
4. Usarlas en Vercel

---

## 🎯 Paso 1: Crear Proyecto en Supabase

### 1.1 Ir a Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign in"**
3. Inicia sesión con:
   - Tu cuenta de GitHub (más fácil)
   - O crea una cuenta nueva con tu email

### 1.2 Crear Nuevo Proyecto

1. En el dashboard de Supabase, haz clic en **"New Project"**
2. Rellena el formulario:

   **Organization:**
   - Si es tu primer proyecto, crea una organización nueva
   - Nombre: tu nombre o "Personal" (lo que quieras)

   **Project Name:**
   - Ejemplo: `inspiracion-web` o `mi-app-inspiracion`

   **Database Password:**
   - Crea una contraseña segura (GUÁRDALA por si acaso)
   - Ejemplo: `MiPassword123!@#`

   **Region:**
   - Elige la más cercana a ti (ej: "West US" o "East US")

   **Pricing Plan:**
   - Elige **"Free"** (gratis) ✅

3. Marca la casilla de términos y condiciones
4. Haz clic en **"Create new project"**

5. **Espera 1-2 minutos** mientras Supabase crea tu proyecto
   - Verás un mensaje: "Setting up your project..."

---

## 🎯 Paso 2: Obtener las Credenciales (URL y Clave)

Una vez que tu proyecto esté listo:

### 2.1 Ir a la Configuración de API

1. En tu proyecto de Supabase
2. Ve a **Settings** (⚙️) en el menú lateral izquierdo
3. Haz clic en **"API"** (dentro de Settings)

### 2.2 Copiar las Credenciales

Verás dos cosas importantes:

**1. Project URL:**
- Ejemplo: `https://abcdefghijklmnop.supabase.co`
- **CÓPIALO** - Lo necesitarás para Vercel
- Este es tu `VITE_SUPABASE_URL`

**2. Project API keys:**
- Busca la sección **"Project API keys"**
- Busca la clave **"anon public"**
- **CÓPIALA** - Es una cadena larga que empieza con `eyJ...`
- Este es tu `VITE_SUPABASE_ANON_KEY`

**⚠️ IMPORTANTE: GUARDA ESTOS VALORES**
- Escríbelos en un archivo de texto temporal
- Los necesitarás para Vercel

---

## 🎯 Paso 3: Ejecutar las Migraciones (Crear las Tablas)

Tus archivos SQL en `supabase/migrations/` necesitan ejecutarse para crear las tablas.

### Opción A: Desde el Dashboard de Supabase (Más Fácil) ⭐

1. En tu proyecto de Supabase
2. Ve a **"SQL Editor"** en el menú lateral izquierdo
3. Haz clic en **"New query"**

4. **Abre los archivos SQL de migraciones:**
   - Ve a tu carpeta: `project/supabase/migrations/`
   - Abre el archivo: `20251102032754_create_core_tables.sql`
   - **Copia TODO el contenido**

5. **Pega el SQL en Supabase:**
   - Pega el contenido en el editor SQL de Supabase
   - Haz clic en **"Run"** (o presiona Ctrl+Enter)

6. **Repite con los demás archivos:**
   - Abre `20251103003036_update_schema_for_features.sql`
   - Copia y pega en Supabase → Run
   - Abre `20251104014535_add_media_types_and_user_info.sql`
   - Copia y pega en Supabase → Run
   - Abre `20251105000000_add_draft_support.sql`
   - Copia y pega en Supabase → Run

7. **Verifica que funcionó:**
   - Ve a **"Table Editor"** en Supabase
   - Deberías ver tablas como: `posts`, `folders`, `user_profiles`
   - Si las ves, ✅ las migraciones funcionaron

---

### Opción B: Usar Supabase CLI (Avanzado)

Si prefieres usar la línea de comandos, puedes usar Supabase CLI, pero la Opción A es más fácil.

---

## 🎯 Paso 4: Configurar Variables en Vercel

Ahora que tienes tus credenciales:

1. Ve a [vercel.com](https://vercel.com)
2. Ve a tu proyecto (el que importaste desde GitHub)
3. Ve a **"Settings"** → **"Environment Variables"**
4. Agrega:

   **Variable 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: La URL que copiaste (ej: `https://xxxxx.supabase.co`)
   - ✅ Marca: Production, Preview, Development
   - Haz clic en **"Add"**

   **Variable 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: La clave "anon public" que copiaste
   - ✅ Marca: Production, Preview, Development
   - Haz clic en **"Add"**

5. **Redeploy:**
   - Ve a **"Deployments"**
   - Haz clic en los 3 puntos (⋯) del último deploy
   - Haz clic en **"Redeploy"**
   - O simplemente haz un nuevo commit a GitHub y se redeployará automáticamente

---

## ✅ Resumen de lo que hiciste:

1. ✅ Creaste un proyecto en Supabase
2. ✅ Copiaste la URL y la clave anónima
3. ✅ Ejecutaste las migraciones SQL (creaste las tablas)
4. ✅ Agregaste las variables en Vercel
5. ✅ Tu web ahora está conectada a Supabase

---

## 🆘 Problemas Comunes:

### ❌ "No puedo crear proyecto en Supabase"
- Verifica que hayas confirmado tu email
- Intenta con otra cuenta de email
- O usa tu cuenta de GitHub directamente

### ❌ "No veo las tablas después de ejecutar SQL"
- Verifica que no haya errores en el SQL
- Revisa la consola de errores en Supabase
- Asegúrate de ejecutar los archivos SQL en orden (por fecha)

### ❌ "No sé cuál es la clave anónima"
- En Settings → API
- Busca la sección "Project API keys"
- Usa la que dice **"anon public"** (NO uses "service_role")

### ❌ "Mi web no conecta con Supabase"
- Verifica que las variables de entorno en Vercel estén correctas
- Verifica que no haya espacios extra al copiar
- Verifica que tu proyecto de Supabase esté activo

---

## 📋 Checklist Final:

- [ ] Proyecto creado en Supabase
- [ ] URL de Supabase copiada
- [ ] Clave anónima copiada
- [ ] Migraciones SQL ejecutadas
- [ ] Tablas visibles en Table Editor
- [ ] Variables agregadas en Vercel
- [ ] Vercel redeployed

**Si marcas todo** ✅ → **¡Tu web está conectada a Supabase!**

---

**¡Sigue estos pasos y tendrás tu base de datos funcionando!** 🚀


