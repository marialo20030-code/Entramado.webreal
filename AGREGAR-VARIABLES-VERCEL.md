# 🔑 Cómo Agregar Variables de Entorno en Vercel

## 🎯 Variables que Necesitas

Necesitas agregar **2 variables** en Vercel:

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`

---

## 📋 Paso 1: Encontrar las Credenciales de Supabase

### Opción A: Desde Bolt (Si tienes acceso)

1. **Abre Bolt** donde creaste el proyecto original
2. **Busca la sección de Supabase** o **"Database"**
3. **Deberías ver:**
   - **URL de Supabase** (algo como: `https://xxxxx.supabase.co`)
   - **Anon Key** (una clave larga que empieza con `eyJ...`)

### Opción B: Desde Supabase Directamente

1. **Ve a [supabase.com](https://supabase.com)**
2. **Inicia sesión** con el mismo email que usaste en Bolt
3. **Selecciona tu proyecto** (el que creó Bolt)
4. **Ve a "Settings"** (icono de engranaje) → **"API"**
5. **Ahí verás:**
   - **Project URL** → Esta es tu `VITE_SUPABASE_URL`
   - **anon public** key → Esta es tu `VITE_SUPABASE_ANON_KEY`

### Opción C: Buscar en tus Archivos Locales

**Busca en tu PC:**
- Archivos `.env` o `.env.local`
- O busca en los archivos de configuración

**Ubicación típica:**
```
C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project\.env
```

**O busca en:**
- `src/lib/supabase.ts` (puede tener las URLs hardcodeadas)

---

## 📋 Paso 2: Agregar Variables en Vercel

### Método 1: Desde la Web de Vercel (Recomendado)

1. **Ve a tu proyecto en Vercel:**
   - [vercel.com](https://vercel.com) → Tu proyecto

2. **Ve a Settings:**
   - Haz clic en **"Settings"** (arriba)

3. **Environment Variables:**
   - En el menú lateral: **"Environment Variables"**

4. **Agregar primera variable:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** Pega tu URL de Supabase (ejemplo: `https://xxxxx.supabase.co`)
   - ✅ Marca: **Production**, **Preview**, **Development**
   - Haz clic en **"Add"**

5. **Agregar segunda variable:**
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Pega tu Anon Key (ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - ✅ Marca: **Production**, **Preview**, **Development**
   - Haz clic en **"Add"**

6. **Redesplegar:**
   - Ve a **"Deployments"**
   - Haz clic en los **3 puntos** (⋯) del último deployment
   - **"Redeploy"**
   - Espera 2-3 minutos

---

### Método 2: Desde Terminal (Si usaste Vercel CLI)

```bash
cd C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project

# Agregar URL
vercel env add VITE_SUPABASE_URL

# Agregar Key
vercel env add VITE_SUPABASE_ANON_KEY

# Redesplegar
vercel --prod
```

**Te pedirá:**
- **Value:** Pega tu credencial
- **Environment:** Selecciona Production, Preview, Development (marca todos)

---

## ✅ Formato de las Variables

### VITE_SUPABASE_URL
```
https://xxxxxxxxxxxxx.supabase.co
```
**Ejemplo:**
```
https://abcdefghijklmnop.supabase.co
```

### VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**Es una clave muy larga que empieza con `eyJ`**

---

## 🔍 Cómo Verificar que Están Correctas

**En Vercel:**
1. **Settings** → **Environment Variables**
2. **Deberías ver:**
   - ✅ `VITE_SUPABASE_URL` (con tu URL)
   - ✅ `VITE_SUPABASE_ANON_KEY` (con tu clave)

**Si no las ves o están vacías:**
- Vuelve a agregarlas
- Asegúrate de marcar Production, Preview, Development

---

## ⚠️ Importante

- ✅ **Marca las 3 opciones:** Production, Preview, Development
- ✅ **No agregues espacios** al principio o final
- ✅ **Copia y pega exactamente** como aparecen en Supabase
- ✅ **Después de agregar, REDESPLEGA** el proyecto

---

## 🆘 Si No Encuentras las Credenciales

**Busca en:**
1. **Bolt** (donde creaste el proyecto)
2. **Supabase.com** (con el mismo email)
3. **Archivos `.env` en tu PC**
4. **Archivo `src/lib/supabase.ts`** (puede tener las URLs)

**¿Necesitas ayuda para encontrarlas? Dime dónde buscas y te guío.** 🔍


