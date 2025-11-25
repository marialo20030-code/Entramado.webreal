# 🔧 Solución: Error al Iniciar Sesión

## ❌ El Problema

Cuando intentas iniciar sesión con tu usuario antiguo, te da error.

**Razón más común:** Las variables de entorno de Supabase NO están configuradas en Vercel, o están apuntando a un proyecto incorrecto.

---

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Verificar Variables de Entorno en Vercel

1. **Ve a Vercel:**
   - [vercel.com](https://vercel.com)
   - Entra a tu proyecto

2. **Ve a Settings:**
   - Clic en **"Settings"** (arriba)
   - Haz clic en **"Environment Variables"** (menú lateral)

3. **Verifica que existan estas 2 variables:**
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`

**Si NO existen:**
- Necesitas agregarlas (ver Paso 2)

**Si SÍ existen:**
- Verifica que los valores sean correctos (ver Paso 3)

---

### Paso 2: Agregar Variables de Entorno (Si no las tienes)

1. **En Vercel → Settings → Environment Variables**

2. **Agregar Variable 1:**
   - Haz clic en **"Add"** o **"Add New"**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Tu URL de Supabase
   - ✅ Marca: **Production**, **Preview**, **Development**
   - Haz clic en **"Add"** o **"Save"**

3. **Agregar Variable 2:**
   - Haz clic en **"Add"** nuevamente
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Tu clave anónima de Supabase
   - ✅ Marca: **Production**, **Preview**, **Development**
   - Haz clic en **"Add"** o **"Save"**

4. **Redeploy:**
   - Ve a **"Deployments"**
   - Haz clic en los 3 puntos (⋯) del último deploy
   - Haz clic en **"Redeploy"**
   - Espera 2-3 minutos

---

### Paso 3: Obtener Credenciales de Supabase

**Si NO tienes un proyecto en Supabase aún:**

1. **Crea un proyecto:**
   - Ve a [supabase.com](https://supabase.com)
   - Inicia sesión con tu cuenta
   - Haz clic en **"New Project"**
   - Rellena el formulario y crea el proyecto
   - Espera 1-2 minutos

2. **Obtén las credenciales:**
   - En tu proyecto, ve a **Settings** (⚙️) → **API**
   - Copia **"Project URL"** → Es tu `VITE_SUPABASE_URL`
   - Copia **"anon public"** key → Es tu `VITE_SUPABASE_ANON_KEY`

3. **Ejecuta las migraciones SQL:**
   - Ve a **"SQL Editor"** en Supabase
   - Abre cada archivo de `supabase/migrations/` en tu PC
   - Copia y pega cada SQL en Supabase → **Run**
   - Verifica en **"Table Editor"** que veas las tablas

**Si YA tienes un proyecto en Supabase:**

1. **Verifica que sea el correcto:**
   - Ve a [supabase.com](https://supabase.com)
   - Inicia sesión
   - Verifica que tu proyecto esté activo
   - Ve a **Settings** (⚙️) → **API**
   - Copia las credenciales

2. **Usa las mismas credenciales que usas localmente:**
   - Si funciona en local, usa esas mismas credenciales
   - O crea un proyecto nuevo y ejecuta las migraciones

---

### Paso 4: Verificar que Funcione

1. **Espera a que termine el redeploy** en Vercel (2-3 minutos)

2. **Abre tu web:**
   - Ve a la URL de Vercel
   - Refresca la página (F5)

3. **Intenta iniciar sesión:**
   - Si las variables están bien, debería funcionar
   - Si no, verifica los errores en la consola del navegador (F12)

---

## 🔍 Verificar en la Consola del Navegador

**Para ver qué error específico hay:**

1. **Abre tu web** en el navegador
2. **Presiona F12** (abre la consola de desarrollador)
3. **Ve a la pestaña "Console"**
4. **Intenta iniciar sesión**
5. **Mira qué errores aparecen**

**Errores comunes:**

- ❌ **"Cannot read properties of undefined"**
  - Las variables de entorno no están configuradas

- ❌ **"Failed to fetch"** o **"Network error"**
  - La URL de Supabase está incorrecta
  - O el proyecto de Supabase no está activo

- ❌ **"Invalid API key"**
  - La clave anónima está incorrecta

- ❌ **"User not found"**
  - El usuario no existe en ese proyecto de Supabase
  - Necesitas usar el mismo proyecto que usabas localmente

---

## 🔄 Usar el Mismo Proyecto de Supabase que en Local

**Si tu web local funcionaba antes:**

1. **Encuentra las credenciales locales:**
   - ¿Tienes un archivo `.env.local` en tu carpeta `project/`?
   - O revisa en `src/lib/supabase.ts` qué valores usa

2. **Usa esas mismas credenciales en Vercel:**
   - Agrega las mismas en las variables de entorno

3. **O conecta tu proyecto de Vercel al mismo Supabase:**
   - Usa las credenciales del proyecto que ya tenías

---

## ✅ Checklist de Verificación

- [ ] Variables de entorno agregadas en Vercel
- [ ] `VITE_SUPABASE_URL` tiene el valor correcto
- [ ] `VITE_SUPABASE_ANON_KEY` tiene el valor correcto
- [ ] Hice Redeploy después de agregar las variables
- [ ] El proyecto de Supabase está activo
- [ ] Las tablas están creadas en Supabase (ejecuté las migraciones)
- [ ] Intenté iniciar sesión de nuevo

**Si todos están marcados** → Debería funcionar ✅

---

## 🆘 Si Aún No Funciona

### Problema: "User not found"

**Solución:**
- El usuario que intentas usar no existe en el proyecto de Supabase
- Crea un nuevo usuario desde la web
- O usa el mismo proyecto de Supabase que usabas localmente

### Problema: Las variables no se aplican

**Solución:**
- Verifica que marcaste Production, Preview Y Development
- Haz un nuevo redeploy después de agregar las variables
- Espera 2-3 minutos a que termine

### Problema: No sé qué proyecto de Supabase usar

**Solución:**
- Crea un proyecto nuevo en Supabase
- Ejecuta las migraciones SQL
- Usa esas credenciales en Vercel
- Crea un nuevo usuario desde la web

---

**¿Ya configuraste las variables de entorno en Vercel? ¿Qué error específico ves en la consola del navegador (F12)?** 🔍

