# 🚀 PASOS PARA CREAR PROYECTO SUPABASE - GUÍA RÁPIDA

## ✅ PASO 1: Crear el Proyecto en Supabase (5 minutos)

### 1.1 Ir a Supabase
1. **Abre tu navegador**
2. **Ve a:** https://supabase.com
3. **Haz clic en "Start your project"** o **"Sign in"**

### 1.2 Iniciar Sesión
- **Si ya tienes cuenta:** Inicia sesión
- **Si NO tienes cuenta:** 
  - Haz clic en "Sign up"
  - Puedes usar **GitHub** (más fácil) o crear con email
  - Sigue las instrucciones

### 1.3 Crear Proyecto Nuevo
1. **Haz clic en "New Project"** (botón verde)

2. **Rellena el formulario:**
   - **Organization:** Crea una nueva o usa existente (puede ser "Personal")
   - **Project Name:** `entramado` (o el nombre que quieras)
   - **Database Password:** Crea una contraseña segura (EJEMPLO: `MiPassword123!@#`)
     - ⚠️ **GUÁRDALA** (la necesitarás si haces cambios directos en la BD)
   - **Region:** Elige la más cercana (ej: "West US" o "East US")
   - **Pricing Plan:** **Free** ✅

3. **Marca la casilla** de términos y condiciones

4. **Haz clic en "Create new project"**

5. **Espera 1-2 minutos** mientras se crea (verás "Setting up your project...")

---

## ✅ PASO 2: Obtener las Credenciales (2 minutos)

1. **Cuando el proyecto esté listo:**
   - Verás el dashboard de Supabase

2. **Ve a Settings:**
   - Haz clic en **"Settings"** (⚙️) en el menú lateral izquierdo
   - Haz clic en **"API"** (dentro de Settings)

3. **Copia estas dos cosas:**

   **A. Project URL:**
   - Se ve así: `https://abcdefghijklmnop.supabase.co`
   - Haz clic en el icono de **copiar** 📋 (junto a "Project URL")
   - **Guárdala temporalmente** (la usarás en el Paso 4)

   **B. anon public key:**
   - En la sección "Project API keys"
   - Busca **"anon public"**
   - Es una clave MUY larga que empieza con `eyJ...`
   - Haz clic en el icono de **copiar** 📋 (junto a "anon public")
   - **Guárdala temporalmente** (la usarás en el Paso 4)

**⚠️ IMPORTANTE:** Ten estas dos cosas listas para el Paso 4.

---

## ✅ PASO 3: Ejecutar las Migraciones SQL (10-15 minutos)

Las migraciones crean las tablas en la base de datos. **Ejecútalas EN ESTE ORDEN:**

### 3.1 Ir al SQL Editor
1. **En tu proyecto de Supabase**
2. **Haz clic en "SQL Editor"** en el menú lateral izquierdo
3. **Haz clic en "New query"** (botón verde arriba)

### 3.2 Migración 1: Tablas Principales
1. **Abre este archivo en tu computadora:**
   - `supabase/migrations/20251102032754_create_core_tables.sql`
   
2. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)

3. **Pega en el SQL Editor de Supabase** (Ctrl+V)

4. **Haz clic en "Run"** (botón azul abajo) o presiona **Ctrl+Enter**

5. **Deberías ver:** "Success. No rows returned" ✅

### 3.3 Migración 2: Actualizaciones de Esquema
1. **Abre este archivo:**
   - `supabase/migrations/20251103003036_update_schema_for_features.sql`

2. **Copia TODO** y pégalo en el SQL Editor

3. **Haz clic en "Run"** (Ctrl+Enter)

4. **Deberías ver:** "Success. No rows returned" ✅

### 3.4 Migración 3: Tipos de Medios
1. **Abre este archivo:**
   - `supabase/migrations/20251104014535_add_media_types_and_user_info.sql`

2. **Copia TODO** y pégalo en el SQL Editor

3. **Haz clic en "Run"**

4. **Deberías ver:** "Success. No rows returned" ✅

### 3.5 Migración 4: Soporte para Borradores
1. **Abre este archivo:**
   - `supabase/migrations/20251105000000_add_draft_support.sql`

2. **Copia TODO** y pégalo en el SQL Editor

3. **Haz clic en "Run"**

4. **Deberías ver:** "Success. No rows returned" ✅

### 3.6 Migración 5: Email en Perfiles
1. **Abre este archivo:**
   - `supabase/migrations/20251106000000_add_email_to_user_profiles.sql`

2. **Copia TODO** y pégalo en el SQL Editor

3. **Haz clic en "Run"**

4. **Deberías ver:** "Success. No rows returned" ✅

### 3.7 Migración 6: Tabla de Aportes (Comentarios)
1. **Abre este archivo:**
   - `supabase/migrations/20250102000000_create_aportes_table.sql`

2. **Copia TODO** y pégalo en el SQL Editor

3. **Haz clic en "Run"**

4. **Deberías ver:** "Success. No rows returned" ✅

### 3.8 Verificar que Funcionó
1. **Haz clic en "Table Editor"** en el menú lateral

2. **Deberías ver estas tablas:**
   - ✅ `posts`
   - ✅ `folders`
   - ✅ `user_profiles`
   - ✅ `extracted_colors`
   - ✅ `aportes`

3. **Si ves las tablas** → ✅ **¡Todo está bien!**

---

## ✅ PASO 4: Actualizar el Archivo .env (2 minutos)

### 4.1 Abrir el Archivo .env
1. **Ve a tu proyecto local**
2. **Abre el archivo:**
   - `project-bolt-sb1-fqlqsuxu/project/.env`
   - Puedes abrirlo con Bloc de Notas o cualquier editor de texto

### 4.2 Reemplazar las Credenciales
**Reemplaza las dos líneas con las credenciales que copiaste en el Paso 2:**

```env
VITE_SUPABASE_URL=https://TU-NUEVA-URL.supabase.co
VITE_SUPABASE_ANON_KEY=tu-nueva-clave-anon-muy-larga
```

**Ejemplo (con tus valores reales):**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANTE:**
- No dejes espacios extra
- No pongas comillas alrededor de los valores
- La clave es MUY larga, asegúrate de copiarla completa
- **Guarda el archivo** (Ctrl+S)

---

## ✅ PASO 5: Limpiar el Navegador (1 minuto)

1. **Abre tu navegador** (si tienes `http://localhost:5173` abierto, cierra la pestaña)

2. **Presiona F12** (abre DevTools)

3. **Ve a la pestaña "Application"** (o "Almacenamiento")

4. **En el menú lateral, busca "Local Storage"**

5. **Haz clic en:** `http://localhost:5173` (si aparece)

6. **Elimina todo:**
   - Haz clic derecho → **"Clear"**
   - O elimina manualmente las claves que empiecen con `sb-` o `supabase`

7. **Cierra el navegador completamente** (todas las pestañas)

---

## ✅ PASO 6: Reiniciar el Servidor (2 minutos)

### 6.1 Detener el Servidor Actual
1. **Ve a la terminal donde está corriendo el servidor**
2. **Presiona Ctrl+C** para detenerlo
3. **Espera a que se detenga completamente**

### 6.2 Iniciar el Servidor de Nuevo
1. **Abre una nueva terminal/PowerShell**

2. **Ve al directorio del proyecto:**
   ```powershell
   cd "C:\Users\maria\Desktop\entramado\project-bolt-sb1-fqlqsuxu\project"
   ```

3. **Inicia el servidor:**
   ```powershell
   npm run dev
   ```

4. **Espera a que inicie:**
   - Verás: "Local: http://localhost:5173/"
   - Si hay errores, avísame

---

## ✅ PASO 7: Probar la Aplicación (2 minutos)

1. **Abre el navegador** (nuevo, limpio)

2. **Ve a:** http://localhost:5173

3. **Deberías ver:**
   - La página de login/registro
   - Sin errores en la consola (F12 → Console)

4. **Crea un nuevo usuario:**
   - Haz clic en "Registrarse" o "Crear cuenta"
   - Ingresa un nombre de usuario, email y contraseña
   - Haz clic en "Registrarse"

5. **Inicia sesión:**
   - Usa el email y contraseña que acabas de crear

6. **Crea una publicación de prueba:**
   - Haz clic en el botón "+" (crear)
   - Sube una imagen
   - Escribe un título y descripción
   - Publica

7. **Si todo funciona** → ✅ **¡LISTO!**

---

## 🆘 Si Algo No Funciona

### Error: "Failed to fetch" o "ERR_NAME_NOT_RESOLVED"
- **Solución:** Verifica que las credenciales en `.env` estén correctas (sin espacios)
- Guarda el archivo `.env`
- Reinicia el servidor

### Error: "Invalid API key"
- **Solución:** Verifica que copiaste la clave completa (es muy larga)
- Asegúrate de copiar "anon public", no "service_role"

### Las tablas no se crean
- **Solución:** Verifica que ejecutaste TODAS las migraciones en orden
- Revisa si hubo errores en el SQL Editor

### No puedo crear usuario
- **Solución:** Verifica que las migraciones se ejecutaron
- Revisa la consola del navegador (F12) para errores

---

## ✅ Checklist Final

- [ ] Creé un nuevo proyecto en Supabase
- [ ] Copié la URL del proyecto (VITE_SUPABASE_URL)
- [ ] Copié la clave anon public (VITE_SUPABASE_ANON_KEY)
- [ ] Ejecuté las 6 migraciones SQL en orden
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

**¡Sigue estos pasos y tendrás tu aplicación funcionando de nuevo!** 🚀

**Si tienes dudas en algún paso, avísame y te ayudo.** 💪







