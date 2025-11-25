# ⚡ Pasos Rápidos: Crear Supabase

## 🎯 Resumen Ultra-Rápido

### 1️⃣ Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Sign in con GitHub
3. "New Project" → Nombre: `inspiracion-web`
4. Elige "Free" plan
5. Espera 1-2 minutos

### 2️⃣ Obtener Credenciales
1. Settings (⚙️) → API
2. Copia **Project URL** → `VITE_SUPABASE_URL`
3. Copia **anon public** key → `VITE_SUPABASE_ANON_KEY`
4. **GUÁRDALOS** en un archivo de texto

### 3️⃣ Ejecutar Migraciones SQL
1. SQL Editor → New query
2. Abre `supabase/migrations/20251102032754_create_core_tables.sql`
3. Copia TODO → Pega en Supabase → Run
4. Repite con los otros 3 archivos SQL

### 4️⃣ Agregar en Vercel
1. Vercel → Tu proyecto → Settings → Environment Variables
2. Agrega `VITE_SUPABASE_URL` = (tu URL)
3. Agrega `VITE_SUPABASE_ANON_KEY` = (tu clave)
4. Redeploy

---

**Lee `CREAR-SUPABASE.md` para instrucciones detalladas.**

