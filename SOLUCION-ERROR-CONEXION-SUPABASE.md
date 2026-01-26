# 🔧 Solución: Error ERR_NAME_NOT_RESOLVED - Supabase

## ❌ El Problema

Estás viendo este error:
```
ERR_NAME_NOT_RESOLVED
bkmmhkxpyrdqskyxbtkb.supabase.co
```

**Esto significa que el proyecto de Supabase no existe o está pausado.**

Los proyectos gratuitos de Supabase se pausan automáticamente después de 7 días de inactividad.

---

## ✅ SOLUCIÓN: Crear un Nuevo Proyecto de Supabase

### Paso 1: Ir a Supabase

1. Ve a **[supabase.com](https://supabase.com)**
2. **Inicia sesión** (o crea una cuenta si no tienes una)
3. Haz clic en **"New Project"**

---

### Paso 2: Crear el Proyecto

1. **Rellena el formulario:**
   - **Name**: `entramado` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la más cercana a ti
   - **Pricing Plan**: **Free** ✅

2. Haz clic en **"Create new project"**
3. **Espera 1-2 minutos** mientras se crea el proyecto

---

### Paso 3: Obtener las Credenciales

1. **Cuando el proyecto esté listo:**
   - Ve a **Settings** (⚙️) en el menú lateral
   - Haz clic en **"API"**

2. **Copia estas dos cosas:**

   **A. Project URL:**
   - Se ve así: `https://abcdefghijklmnop.supabase.co`
   - Haz clic en el icono de copiar 📋
   - **Esta es tu `VITE_SUPABASE_URL`**

   **B. anon public key:**
   - Es una clave muy larga que empieza con `eyJ...`
   - Haz clic en el icono de copiar 📋 junto a "anon public"
   - **Esta es tu `VITE_SUPABASE_ANON_KEY`**

---

### Paso 4: Crear las Tablas (Migraciones SQL)

Tu aplicación necesita tablas en la base de datos. Necesitas ejecutar los archivos SQL de migración.

1. **En Supabase:**
   - Ve a **"SQL Editor"** en el menú lateral
   - Haz clic en **"New query"**

2. **Ejecutar migraciones:**
   - Ve a la carpeta `supabase/migrations/` en tu proyecto
   - Abre cada archivo `.sql` (empieza por el más antiguo según la fecha en el nombre)
   - Copia y pega el contenido en el SQL Editor
   - Haz clic en **"Run"** (o presiona Ctrl+Enter)
   - Repite para cada archivo SQL

3. **Verificar:**
   - Ve a **"Table Editor"** en el menú lateral
   - Deberías ver las tablas: `posts`, `folders`, `user_profiles`, etc.

---

### Paso 5: Actualizar el Archivo .env

1. **Abre el archivo `.env`** en tu proyecto:
   - Ruta: `project-bolt-sb1-fqlqsuxu/project/.env`

2. **Reemplaza las credenciales:**

```env
VITE_SUPABASE_URL=https://TU-NUEVA-URL.supabase.co
VITE_SUPABASE_ANON_KEY=tu-nueva-clave-anon-muy-larga
```

3. **Guarda el archivo**

---

### Paso 6: Limpiar el Navegador

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Application"** (o "Almacenamiento")
3. **Local Storage:**
   - Busca `http://localhost:5173`
   - Elimina todas las claves que empiecen con `sb-` o `supabase`
   - O haz clic derecho → "Clear"

4. **Cierra y vuelve a abrir el navegador**

---

### Paso 7: Reiniciar el Servidor

1. **Detén el servidor** (Ctrl+C en la terminal)
2. **Inícialo de nuevo:**
   ```bash
   npm run dev
   ```

3. **Abre el navegador** en `http://localhost:5173`

---

## ✅ Checklist

- [ ] Creé un nuevo proyecto en Supabase
- [ ] Copié la URL del proyecto (VITE_SUPABASE_URL)
- [ ] Copié la clave anon public (VITE_SUPABASE_ANON_KEY)
- [ ] Ejecuté las migraciones SQL en Supabase
- [ ] Actualicé el archivo .env con las nuevas credenciales
- [ ] Limpié el Local Storage del navegador
- [ ] Reinicié el servidor
- [ ] La aplicación carga sin errores

---

## 🆘 Si Aún No Funciona

### Problema: Todavía veo errores de conexión

**Solución:**
- Verifica que el proyecto de Supabase esté activo (no pausado)
- Verifica que las credenciales en `.env` estén correctas (sin espacios extra)
- Asegúrate de haber guardado el archivo `.env`
- Reinicia el servidor completamente

### Problema: No puedo crear un proyecto en Supabase

**Solución:**
- Verifica que tengas una cuenta de Supabase
- Asegúrate de no haber alcanzado el límite de proyectos gratuitos
- Intenta iniciar sesión con GitHub si tienes problemas con email

### Problema: Las tablas no se crean

**Solución:**
- Verifica que estés copiando todo el contenido del archivo SQL
- Asegúrate de ejecutar los archivos en orden (por fecha)
- Revisa si hay errores en el SQL Editor de Supabase

---

## 📝 Nota sobre Datos Antiguos

**⚠️ IMPORTANTE:** Si creas un nuevo proyecto de Supabase, perderás:
- Tus publicaciones antiguas
- Tus usuarios antiguos
- Tus carpetas antiguas

**Pero puedes:**
- Crear nuevas publicaciones
- Crear nuevos usuarios
- Empezar de nuevo con un proyecto limpio

Si necesitas recuperar datos antiguos, necesitas reactivar el proyecto original en Supabase (si es posible).

---

**¿Necesitas ayuda con algún paso específico?** 🔍







