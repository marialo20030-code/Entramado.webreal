# 🔑 Cómo Obtener Credenciales de Supabase desde Bolt

## ✅ ¡Perfecto! Tienes acceso a Bolt

Veo que puedes ver tus tablas:
- ✅ **posts**: 9 rows (¡tus publicaciones están ahí!)
- ✅ **folders**: 1 row
- ✅ **user_profiles**: 0 rows
- ✅ **extracted_colors**: 0 rows

---

## 🎯 Obtener las Credenciales

### Paso 1: Buscar las Credenciales en Bolt

En la interfaz de Bolt, busca:

**Opción A: En la Configuración/Settings**
1. Busca un botón o menú que diga:
   - "Settings" o "Configuración"
   - "Database Settings"
   - "Connection" o "Conexión"
   - O un ícono de engranaje ⚙️

2. Ahí deberías ver:
   - **Supabase URL** o **Project URL**
   - **API Key** o **Anon Key**

**Opción B: En la Barra Superior**
1. Mira la barra superior de Bolt
2. Busca un botón o menú que diga:
   - "Database" o "Base de datos"
   - "Connection Info"
   - O cualquier opción relacionada con configuración

**Opción C: Clic Derecho en las Tablas**
1. Haz clic derecho en alguna tabla
2. Busca opciones como "View Connection" o "Database Info"

**Opción D: En el Menú Lateral**
1. Busca en el menú lateral izquierdo
2. Puede haber una sección de "Settings" o "Configuration"

---

### Paso 2: Qué Buscar

Necesitas encontrar estas dos cosas:

1. **Supabase URL** o **Project URL**
   - Se ve así: `https://xxxxx.supabase.co`
   - Esta es tu `VITE_SUPABASE_URL`

2. **API Key** o **Anon Key** o **Anon Public Key**
   - Es una cadena larga que empieza con `eyJ...`
   - Esta es tu `VITE_SUPABASE_ANON_KEY`

---

### Paso 3: Si No Encuentras las Credenciales en Bolt

**Alternativa: Obtener desde Supabase directamente**

1. **En Bolt, busca un botón o enlace que diga:**
   - "Open in Supabase"
   - "View in Supabase"
   - "Go to Supabase Dashboard"
   - O cualquier enlace a Supabase

2. **O ve directamente a [supabase.com](https://supabase.com)**
   - Inicia sesión (puedes usar "Forgot password" si no recuerdas)
   - Busca el proyecto que Bolt creó
   - Ve a Settings → API
   - Copia las credenciales

---

## 📋 Una Vez que Tengas las Credenciales

1. **Copia la URL de Supabase** (ej: `https://xxxxx.supabase.co`)
2. **Copia la clave anónima** (ej: `eyJ...`)

3. **Configura en Vercel:**
   - Ve a Vercel → Tu proyecto → Settings → Environment Variables
   - Agrega:
     - `VITE_SUPABASE_URL` = (la URL que copiaste)
     - `VITE_SUPABASE_ANON_KEY` = (la clave que copiaste)
   - Marca: Production, Preview, Development
   - Redeploy

4. **¡Tus 9 publicaciones aparecerán en Vercel!** ✅

---

## 🔍 Dónde Buscar en Bolt

**Busca en estas áreas:**
- ⚙️ Icono de configuración (arriba o en el menú)
- 📊 Sección de "Database" o "Base de datos"
- 🔗 "Connection" o "Conexión"
- 📝 "Settings" o "Configuración"
- ℹ️ "Info" o "Información"

---

**¿Puedes buscar en Bolt un menú de configuración o información de conexión? ¿Ves algún botón o enlace que diga "Settings", "Config", o algo similar?** 🔍


