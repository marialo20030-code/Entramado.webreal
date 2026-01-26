# 🔧 Solución: Error al Registrarse - Rate Limiting

## 🔴 PROBLEMA

No puedes registrarte y ves un mensaje como:
- "For security purposes, you can only request this after X seconds"
- "Too many requests"
- O simplemente no funciona el registro

---

## ✅ SOLUCIONES

### Solución 1: Esperar el Tiempo Indicado (Más Simple)

**Si ves "you can only request this after 58 seconds":**

1. **Espera 1-2 minutos** sin intentar registrarte
2. **Intenta de nuevo** con un email diferente
3. **O usa un email que no hayas usado antes**

**Razón:** Supabase limita los intentos de registro para prevenir spam.

---

### Solución 2: Verificar Configuración de Email en Supabase

**Supabase puede requerir confirmación de email por defecto.**

1. **Ve a Supabase:**
   - [supabase.com](https://supabase.com)
   - Entra a tu proyecto "Entramado.web"

2. **Ve a Authentication → Settings:**
   - Haz clic en "Authentication" en el menú lateral
   - Haz clic en "Settings" (o "Configuración")

3. **Busca "Email Auth":**
   - Deberías ver opciones sobre confirmación de email

4. **Desactivar confirmación de email (para desarrollo):**
   - Busca "Enable email confirmations" o "Confirm email"
   - **Desmárcalo** (si está marcado)
   - **Guarda los cambios**

5. **Intenta registrarte de nuevo**

---

### Solución 3: Verificar Row Level Security (RLS) en user_profiles

**El problema puede ser que la tabla `user_profiles` no permite insertar datos.**

1. **Ve a Supabase → Table Editor**
2. **Haz clic en la tabla `user_profiles`**
3. **Haz clic en la pestaña "Definition"** (o "Definición")
4. **Busca "Row Level Security" o "RLS"**
5. **Verifica las políticas:**

   **Debe haber una política que permita INSERT para usuarios autenticados:**
   ```sql
   CREATE POLICY "Users can insert their own profile"
   ON user_profiles
   FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = id);
   ```

6. **Si no existe esta política, créala:**
   - Ve a "SQL Editor" en Supabase
   - Ejecuta este SQL:

   ```sql
   -- Permitir que usuarios autenticados inserten su propio perfil
   CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
   ON user_profiles
   FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = id);

   -- Permitir que usuarios autenticados lean todos los perfiles
   CREATE POLICY IF NOT EXISTS "Users can read all profiles"
   ON user_profiles
   FOR SELECT
   TO authenticated
   USING (true);
   ```

7. **Ejecuta el SQL** (haz clic en "Run")
8. **Intenta registrarte de nuevo**

---

### Solución 4: Verificar en la Consola del Navegador

**Para ver el error exacto:**

1. **Abre la consola del navegador:**
   - Presiona `F12` en tu navegador
   - Ve a la pestaña "Console"

2. **Intenta registrarte de nuevo**

3. **Busca errores en rojo** en la consola

4. **Los errores comunes son:**
   - `"new row violates row-level security policy"` → Problema con RLS (Solución 3)
   - `"Email rate limit exceeded"` → Espera unos minutos (Solución 1)
   - `"User already registered"` → Usa un email diferente
   - `"Invalid API key"` → Verifica las credenciales en `.env`

---

### Solución 5: Limpiar Local Storage

**A veces hay datos corruptos en el navegador:**

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Application"** (o "Almacenamiento")
3. **En el menú lateral, busca "Local Storage"**
4. **Haz clic en:** `http://localhost:5173`
5. **Elimina todas las claves** que empiecen con:
   - `sb-`
   - `supabase`
6. **Cierra y vuelve a abrir el navegador**
7. **Intenta registrarte de nuevo**

---

## 🧪 PROBAR DESPUÉS DE APLICAR SOLUCIONES

### Paso 1: Reiniciar el Servidor

```bash
# Detén el servidor (Ctrl+C en la terminal)
# Luego inicia de nuevo:
cd "C:\Users\maria\Desktop\entramado\project-bolt-sb1-fqlqsuxu\project"
npm run dev
```

### Paso 2: Limpiar Navegador

1. **Cierra todas las pestañas** del proyecto
2. **Abre una nueva pestaña**
3. **Ve a:** `http://localhost:5173`

### Paso 3: Intentar Registro

1. **Usa un email NUEVO** (que no hayas usado antes)
2. **Usa un nombre de usuario NUEVO**
3. **Contraseña:** Mínimo 6 caracteres
4. **Haz clic en "Registrarse"**

### Paso 4: Verificar en Supabase

1. **Ve a Supabase → Table Editor**
2. **Haz clic en `user_profiles`**
3. **Deberías ver tu nuevo usuario** ✅

---

## 🔍 VERIFICAR ERRORES ESPECÍFICOS

### Error: "new row violates row-level security policy"

**Solución:** Ejecuta el SQL de la Solución 3 para crear las políticas RLS.

### Error: "Email rate limit exceeded"

**Solución:** Espera 1-2 minutos y usa un email diferente.

### Error: "User already registered"

**Solución:** Usa un email diferente o intenta iniciar sesión en lugar de registrarte.

### Error: "Invalid API key"

**Solución:** 
- Verifica que las credenciales en `.env` sean correctas
- Reinicia el servidor después de actualizar `.env`

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Esperé 1-2 minutos si había rate limiting
- [ ] Verifiqué la configuración de email en Supabase (Authentication → Settings)
- [ ] Desactivé la confirmación de email (si estaba activada)
- [ ] Verifiqué las políticas RLS en `user_profiles`
- [ ] Creé las políticas RLS si no existían (Solución 3)
- [ ] Limpié el Local Storage del navegador
- [ ] Reinicié el servidor
- [ ] Intenté registrarme con un email NUEVO
- [ ] Verifiqué en Supabase que el usuario se creó

---

## 🆘 SI NADA FUNCIONA

### Opción 1: Verificar que el Proyecto Esté Activo

1. **Ve a Supabase**
2. **Verifica que tu proyecto NO esté pausado**
3. **Si está pausado, haz clic en "Unpause"**

### Opción 2: Verificar Credenciales

1. **Verifica que las credenciales en `.env` sean correctas**
2. **Compara con las de Supabase Settings → API**
3. **Reinicia el servidor después de actualizar**

### Opción 3: Revisar Logs de Supabase

1. **Ve a Supabase → Logs**
2. **Busca errores relacionados con autenticación**
3. **Comparte los errores si los hay**

---

## 📝 NOTAS IMPORTANTES

1. **Rate Limiting:** Supabase limita los intentos de registro para prevenir spam. Espera entre intentos.

2. **Confirmación de Email:** Por defecto, Supabase puede requerir confirmar el email. Desactívalo para desarrollo.

3. **RLS (Row Level Security):** Las tablas necesitan políticas para permitir que los usuarios inserten sus propios datos.

4. **Email Único:** Cada email solo se puede usar una vez. Usa emails diferentes para pruebas.

---

**¡Sigue estas soluciones en orden y deberías poder registrarte!** 🚀



