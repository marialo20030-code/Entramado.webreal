# 🆕 Crear Proyecto Nuevo de Supabase - Paso a Paso

## 🎯 Objetivo

Crear un proyecto nuevo de Supabase desde cero para poder usar tu aplicación.

**⚠️ IMPORTANTE:** Los datos antiguos no se pueden recuperar. Este será un proyecto limpio.

---

## 📋 PASO 1: Crear el Proyecto en Supabase

### 1.1 Ir a Supabase

1. **Abre tu navegador**
2. **Ve a:** [supabase.com](https://supabase.com)
3. **Haz clic en "Start your project"** o **"Sign in"**

### 1.2 Iniciar Sesión o Crear Cuenta

- **Si ya tienes cuenta:** Inicia sesión
- **Si no tienes cuenta:** 
  - Haz clic en "Sign up"
  - Puedes usar GitHub (más fácil) o crear cuenta con email
  - Sigue las instrucciones

### 1.3 Crear Nuevo Proyecto

1. **En el dashboard, haz clic en "New Project"**

2. **Rellena el formulario:**

   **Organization:**
   - Si es tu primer proyecto, crea una organización nueva
   - Nombre: "Personal" o tu nombre (lo que prefieras)

   **Project Name:**
   - Ejemplo: `entramado` o `entramado-web`
   - El nombre puede ser el que quieras

   **Database Password:**
   - **Crea una contraseña segura**
   - Ejemplo: `MiPassword123!@#`
   - **⚠️ GUÁRDALA** (la necesitarás si haces cambios en la base de datos directamente)

   **Region:**
   - Elige la más cercana a ti
   - Por ejemplo: "West US (California)" o "East US (Virginia)"

   **Pricing Plan:**
   - **Free** ✅ (es gratis)

3. **Marca la casilla** de términos y condiciones

4. **Haz clic en "Create new project"**

5. **Espera 1-2 minutos** mientras se crea el proyecto
   - Verás: "Setting up your project..."
   - Cuando termine, verás el dashboard

---

## 📋 PASO 2: Obtener las Credenciales

### 2.1 Ir a la Configuración de API

1. **En tu proyecto de Supabase**
2. **Haz clic en "Settings"** (⚙️) en el menú lateral izquierdo
3. **Haz clic en "API"** (dentro de Settings)

### 2.2 Copiar las Credenciales

Verás dos cosas importantes:

**1. Project URL:**
- Se ve así: `https://abcdefghijklmnop.supabase.co`
- Haz clic en el icono de **copiar** 📋
- **Esta es tu `VITE_SUPABASE_URL`**

**2. Project API keys:**
- Busca la sección **"Project API keys"**
- Busca la clave **"anon public"**
- Es una clave MUY larga que empieza con `eyJ...`
- Haz clic en el icono de **copiar** 📋 junto a "anon public"
- **Esta es tu `VITE_SUPABASE_ANON_KEY`**

**⚠️ IMPORTANTE: GUARDA ESTOS VALORES**
- Escríbelos en un archivo de texto temporal
- O cópialos en el portapapeles (lo necesitarás ahora)

---

## 📋 PASO 3: Ejecutar las Migraciones SQL (Crear las Tablas)

Tu aplicación necesita tablas en la base de datos. Necesitas ejecutar los archivos SQL.

### 3.1 Ir al SQL Editor

1. **En tu proyecto de Supabase**
2. **Haz clic en "SQL Editor"** en el menú lateral izquierdo
3. **Haz clic en "New query"** (botón verde)

### 3.2 Ejecutar las Migraciones

**Ejecuta cada archivo SQL en este orden:**

#### Migración 1: Tablas principales
1. **Abre el archivo:** `supabase/migrations/20251102032754_create_core_tables.sql`
2. **Copia TODO el contenido** del archivo
3. **Pega en el SQL Editor** de Supabase
4. **Haz clic en "Run"** (o presiona Ctrl+Enter)
5. Deberías ver: "Success. No rows returned"

#### Migración 2: Actualizaciones de esquema
1. **Abre el archivo:** `supabase/migrations/20251103003036_update_schema_for_features.sql`
2. **Copia y pega** en el SQL Editor
3. **Haz clic en "Run"**

#### Migración 3: Tipos de medios e información de usuario
1. **Abre el archivo:** `supabase/migrations/20251104014535_add_media_types_and_user_info.sql`
2. **Copia y pega** en el SQL Editor
3. **Haz clic en "Run"**

#### Migración 4: Soporte para borradores
1. **Abre el archivo:** `supabase/migrations/20251105000000_add_draft_support.sql`
2. **Copia y pega** en el SQL Editor
3. **Haz clic en "Run"**

#### Migración 5: Email en perfiles de usuario
1. **Abre el archivo:** `supabase/migrations/20251106000000_add_email_to_user_profiles.sql`
2. **Copia y pega** en el SQL Editor
3. **Haz clic en "Run"**

#### Migración 6: Tabla de aportes (si existe)
1. **Abre el archivo:** `supabase/migrations/20250102000000_create_aportes_table.sql` (si existe)
2. **Copia y pega** en el SQL Editor
3. **Haz clic en "Run"**

### 3.3 Verificar que Funcionó

1. **Haz clic en "Table Editor"** en el menú lateral
2. **Deberías ver estas tablas:**
   - ✅ `posts`
   - ✅ `folders`
   - ✅ `user_profiles`
   - ✅ `extracted_colors`
   - ✅ `aportes` (si ejecutaste esa migración)
3. **Si ves las tablas** → ✅ Todo está bien

---

## 📋 PASO 4: Actualizar el Archivo .env

### 4.1 Abrir el Archivo .env

1. **Ve a tu proyecto local**
2. **Abre el archivo:** `project-bolt-sb1-fqlqsuxu/project/.env`

### 4.2 Reemplazar las Credenciales

**Reemplaza las líneas con las nuevas credenciales:**

```env
VITE_SUPABASE_URL=https://TU-NUEVA-URL.supabase.co
VITE_SUPABASE_ANON_KEY=tu-nueva-clave-anon-muy-larga
```

**Ejemplo:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANTE:**
- No dejes espacios extra
- No pongas comillas alrededor de los valores
- Guarda el archivo después de editarlo

---

## 📋 PASO 5: Limpiar el Navegador

### 5.1 Limpiar Local Storage

1. **Abre tu navegador** en `http://localhost:5173` (si el servidor está corriendo)
2. **Presiona F12** (abre DevTools)
3. **Ve a la pestaña "Application"** (o "Almacenamiento")
4. **En el menú lateral, busca "Local Storage"**
5. **Haz clic en:** `http://localhost:5173`
6. **Elimina todas las claves** que empiecen con `sb-` o `supabase`
   - O haz clic derecho → "Clear" para limpiar todo

### 5.2 Cerrar y Reabrir el Navegador

- **Cierra todas las pestañas** del proyecto
- **Vuelve a abrir** el navegador
- **Ve a:** `http://localhost:5173`

---

## 📋 PASO 6: Reiniciar el Servidor

### 6.1 Detener el Servidor Actual

1. **Ve a la terminal donde está corriendo el servidor**
2. **Presiona Ctrl+C** para detenerlo

### 6.2 Iniciar el Servidor de Nuevo

1. **Abre una nueva terminal**
2. **Ve al directorio del proyecto:**
   ```bash
   cd "C:\Users\maria\Desktop\entramado\project-bolt-sb1-fqlqsuxu\project"
   ```
3. **Inicia el servidor:**
   ```bash
   npm run dev
   ```
4. **Espera a que inicie** (verás: "Local: http://localhost:5173/")

### 6.3 Probar la Aplicación

1. **Abre el navegador** en `http://localhost:5173`
2. **Deberías ver la aplicación sin errores**
3. **Crea un nuevo usuario** (registro)
4. **Inicia sesión**
5. **Crea una nueva publicación** para probar

---

## ✅ Checklist Final

- [ ] Creé un nuevo proyecto en Supabase
- [ ] Copié la URL del proyecto (VITE_SUPABASE_URL)
- [ ] Copié la clave anon public (VITE_SUPABASE_ANON_KEY)
- [ ] Ejecuté todas las migraciones SQL (6 archivos)
- [ ] Verifiqué que las tablas se crearon (Table Editor)
- [ ] Actualicé el archivo .env con las nuevas credenciales
- [ ] Guardé el archivo .env
- [ ] Limpié el Local Storage del navegador
- [ ] Reinicié el servidor
- [ ] La aplicación carga sin errores
- [ ] Puedo crear un nuevo usuario
- [ ] Puedo iniciar sesión
- [ ] Puedo crear una publicación

---

## 🆘 Si Algo No Funciona

### Error: "Failed to fetch" o "ERR_NAME_NOT_RESOLVED"

**Solución:**
- Verifica que las credenciales en `.env` estén correctas
- Verifica que no haya espacios extra
- Guarda el archivo `.env`
- Reinicia el servidor

### Error: "Invalid API key"

**Solución:**
- Verifica que copiaste la clave completa (es muy larga)
- Verifica que no haya espacios al inicio o final
- Asegúrate de copiar la clave "anon public", no "service_role"

### Las tablas no se crean

**Solución:**
- Verifica que ejecutaste TODAS las migraciones
- Verifica que no hubo errores al ejecutar cada SQL
- Revisa la pestaña "Logs" en Supabase SQL Editor si hay errores

### No puedo crear usuario

**Solución:**
- Verifica que las migraciones se ejecutaron correctamente
- Revisa la tabla `user_profiles` en Table Editor
- Verifica que no hay errores en la consola del navegador (F12)

---

## 💡 Para el Futuro

**Recomendaciones:**
- ✅ Usa el proyecto regularmente para evitar que se pause
- ✅ Guarda las credenciales en un lugar seguro
- ✅ Considera hacer backups manuales de datos importantes
- ✅ Si planeas usar mucho, considera un plan de pago (no se pausa automáticamente)

---

**¡Sigue estos pasos y tendrás tu aplicación funcionando de nuevo!** 🚀







