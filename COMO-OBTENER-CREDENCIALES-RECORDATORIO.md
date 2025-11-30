# 🔑 Recordatorio: Cómo Obtener Credenciales de Supabase

## 🎯 Método Más Fácil: Desde Supabase.com

### Paso 1: Iniciar Sesión en Supabase

1. **Ve a [supabase.com](https://supabase.com)**
2. **Haz clic en "Sign in"**
3. **Inicia sesión con:**
   - El mismo email que usaste cuando creaste el proyecto con Bolt
   - O con GitHub (si usaste GitHub con Bolt)
   - O haz clic en "Forgot password?" si no recuerdas la contraseña

---

### Paso 2: Encontrar tu Proyecto

1. **En el dashboard de Supabase, verás una lista de proyectos**
2. **Busca proyectos con nombres como:**
   - `project-bolt-sb1-fqlqsuxu`
   - O algo relacionado con "bolt"
   - O el nombre que le diste al proyecto

3. **Para verificar que es el correcto:**
   - Haz clic en el proyecto
   - Ve a **"Table Editor"** (menú lateral izquierdo)
   - Haz clic en la tabla **"posts"**
   - **¿Ves publicaciones ahí?** → ✅ **¡Ese es el proyecto correcto!**

---

### Paso 3: Obtener las Credenciales

1. **En tu proyecto de Supabase:**
   - Haz clic en el **icono de engranaje ⚙️** (arriba) → **"Settings"**
   - O ve directamente a **"Settings"** en el menú lateral

2. **Haz clic en "API"** (en el menú de Settings)

3. **Ahí verás:**
   - **Project URL** → Esta es tu `VITE_SUPABASE_URL`
     - Se ve así: `https://xxxxx.supabase.co`
   - **anon public** key → Esta es tu `VITE_SUPABASE_ANON_KEY`
     - Es una clave larga que empieza con `eyJ...`

4. **Copia ambas:**
   - Haz clic en el icono de copiar 📋 junto a cada una
   - O selecciona y copia manualmente

---

## 📋 Ejemplo de lo que Buscas

### VITE_SUPABASE_URL
```
https://abcdefghijklmnop.supabase.co
```

### VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
*(Es una clave MUY larga que empieza con `eyJ`)*

---

## 🔄 Método Alternativo: Desde Bolt (Si Tienes Acceso)

Si tienes acceso a Bolt donde creaste el proyecto:

1. **Abre Bolt**
2. **Busca:**
   - Un botón o menú que diga "Settings" o "Configuración"
   - O "Database Settings"
   - O un icono de engranaje ⚙️
3. **Ahí deberías ver:**
   - **Supabase URL** o **Project URL**
   - **API Key** o **Anon Key**

---

## ✅ Una Vez que Tengas las Credenciales

**Agrégalas en Vercel:**

1. **Ve a tu proyecto en Vercel**
2. **Settings** → **Environment Variables**
3. **Agrega:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** Pega la URL que copiaste
   - ✅ Marca: Production, Preview, Development
   - **Add**

4. **Agrega:**
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Pega la clave que copiaste
   - ✅ Marca: Production, Preview, Development
   - **Add**

5. **Redesplegar:**
   - Ve a **"Deployments"**
   - Haz clic en los **3 puntos (⋯)** del último deployment
   - **"Redeploy"**

---

## 🆘 Si No Puedes Iniciar Sesión en Supabase

**Opción 1: Recuperar Contraseña**
- En [supabase.com](https://supabase.com) → "Sign in" → "Forgot password?"
- Ingresa tu email
- Revisa tu correo para el enlace de recuperación

**Opción 2: Iniciar Sesión con GitHub**
- Si usaste GitHub con Bolt, haz clic en "Continue with GitHub"

**Opción 3: Buscar en Emails**
- Revisa tu email por mensajes de Supabase
- Pueden tener enlaces directos a tu proyecto

---

## 📍 Resumen Rápido

1. ✅ Ve a [supabase.com](https://supabase.com)
2. ✅ Inicia sesión (con email o GitHub)
3. ✅ Busca tu proyecto (el que tiene tus publicaciones)
4. ✅ Settings → API
5. ✅ Copia Project URL y anon public key
6. ✅ Agrégalas en Vercel como variables de entorno
7. ✅ Redesplegar

---

**¿Necesitas ayuda en algún paso específico?** 🔍


