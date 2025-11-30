# ✅ SOLUCIÓN: Cómo Crear tu Proyecto de Supabase

## 🤔 Tu Situación Actual

- ✅ Tienes la carpeta `supabase/migrations/` con archivos SQL
- ❌ NO tienes un proyecto activo en Supabase.com
- ❌ No tienes las credenciales (URL y clave)

**Solución:** Crear un proyecto nuevo en Supabase y ejecutar esos archivos SQL.

---

## 🎯 PASOS PASO A PASO

### PASO 1: Crear Proyecto en Supabase.com

1. **Ir a Supabase:**
   - Abre: [supabase.com](https://supabase.com)
   - Haz clic en **"Start your project"** o **"Sign in"**

2. **Iniciar sesión:**
   - Haz clic en **"Continue with GitHub"** (más fácil)
   - O crea cuenta con tu email

3. **Crear proyecto:**
   - En el dashboard, haz clic en **"New Project"**
   - Rellena:
     - **Name**: `inspiracion-web` (o el que quieras)
     - **Database Password**: Crea una contraseña (ej: `MiPassword123!@#`)
     - **Region**: Elige la más cercana
     - **Plan**: **Free** ✅
   - Marca términos y condiciones
   - Haz clic en **"Create new project"**

4. **Esperar 1-2 minutos** (mientras crea el proyecto)

---

### PASO 2: Obtener las Credenciales

1. **Cuando el proyecto esté listo:**
   - Ve a **Settings** (⚙️) en el menú lateral
   - Haz clic en **"API"**

2. **Copiar credenciales:**

   **A. Project URL:**
   - Ejemplo: `https://abcdefghijklmnop.supabase.co`
   - **CÓPIALO** → Este es tu `VITE_SUPABASE_URL`
   - Escríbelo en un archivo de texto

   **B. Project API keys:**
   - Busca **"anon public"** key
   - Es una cadena larga: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **CÓPIALA** → Este es tu `VITE_SUPABASE_ANON_KEY`
   - Escríbelo en el mismo archivo de texto

   **⚠️ GUARDA ESTOS VALORES - Los necesitarás para Vercel**

---

### PASO 3: Ejecutar las Migraciones (Crear las Tablas)

Tus archivos SQL en `supabase/migrations/` necesitan ejecutarse para crear las tablas.

**Haz esto con cada archivo SQL:**

1. **En Supabase:**
   - Ve a **"SQL Editor"** en el menú lateral
   - Haz clic en **"New query"**

2. **En tu computadora:**
   - Abre la carpeta: `project/supabase/migrations/`
   - Abre el primer archivo: `20251102032754_create_core_tables.sql`
   - Selecciona TODO (Ctrl+A)
   - Copia (Ctrl+C)

3. **De vuelta en Supabase:**
   - Pega en el editor SQL (Ctrl+V)
   - Haz clic en **"Run"** (o Ctrl+Enter)
   - Deberías ver: ✅ "Success"

4. **Repite con los otros 3 archivos:**
   - `20251103003036_update_schema_for_features.sql`
   - `20251104014535_add_media_types_and_user_info.sql`
   - `20251105000000_add_draft_support.sql`

5. **Verificar:**
   - Ve a **"Table Editor"** en Supabase
   - Deberías ver tablas: `posts`, `folders`, `user_profiles`
   - Si las ves ✅ → ¡Funcionó!

---

### PASO 4: Configurar en Vercel

1. **Ve a Vercel:**
   - [vercel.com](https://vercel.com)
   - Entra a tu proyecto (el que importaste de GitHub)

2. **Agregar variables:**
   - Ve a **Settings** → **Environment Variables**

3. **Variable 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: La URL que copiaste (ej: `https://xxxxx.supabase.co`)
   - ✅ Marca: Production, Preview, Development
   - **Add**

4. **Variable 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: La clave "anon public" que copiaste
   - ✅ Marca: Production, Preview, Development
   - **Add**

5. **Redeploy:**
   - Ve a **Deployments**
   - Haz clic en los 3 puntos (⋯) del último deploy
   - **Redeploy**
   - O simplemente haz un commit nuevo a GitHub y se redeployará automáticamente

---

## ✅ Checklist Final:

- [ ] Proyecto creado en Supabase.com
- [ ] URL copiada y guardada
- [ ] Clave anónima copiada y guardada
- [ ] 4 archivos SQL ejecutados en Supabase
- [ ] Tablas visibles en Table Editor
- [ ] Variables agregadas en Vercel
- [ ] Vercel redeployed

**Si marcas todo** ✅ → **¡Tu web está conectada!**

---

## 🆘 Ayuda Adicional:

**¿Necesitas ayuda con algún paso?**
- Lee `CREAR-SUPABASE.md` para instrucciones más detalladas
- O pregunta y te ayudo paso a paso

---

**¡Sigue estos pasos y tendrás tu base de datos funcionando en internet!** 🚀


