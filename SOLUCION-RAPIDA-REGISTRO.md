# ⚡ Solución Rápida: Error al Registrarse

## 🔴 PROBLEMA ACTUAL

No puedes registrarte y ves:
- "For security purposes, you can only request this after 58 seconds"
- Esto es **rate limiting** de Supabase (límite de intentos)

---

## ✅ SOLUCIÓN RÁPIDA (2 MINUTOS)

### Paso 1: Esperar y Usar Email Nuevo

1. **Espera 1-2 minutos** sin intentar registrarte
2. **Usa un email COMPLETAMENTE NUEVO** (que nunca hayas usado antes)
3. **Intenta registrarte de nuevo**

**Ejemplo de emails para pruebas:**
- `test1@example.com`
- `test2@example.com`
- `prueba1@gmail.com`
- `prueba2@gmail.com`

---

## 🔧 SOLUCIÓN ADICIONAL: Desactivar Confirmación de Email

**Si sigue sin funcionar después de esperar:**

1. **Ve a Supabase:**
   - [supabase.com](https://supabase.com)
   - Entra a tu proyecto "Entramado.web"

2. **Ve a Authentication → Settings:**
   - Haz clic en "Authentication" en el menú lateral
   - Haz clic en "Settings"

3. **Busca "Enable email confirmations":**
   - **Desmárcalo** (si está marcado)
   - **Guarda los cambios**

4. **Intenta registrarte de nuevo** con un email nuevo

---

## 🧪 PROBAR DESPUÉS

1. **Espera 1-2 minutos**
2. **Abre:** `http://localhost:5173`
3. **Usa un email NUEVO** (ej: `test1@example.com`)
4. **Nombre de usuario:** Cualquier nombre
5. **Contraseña:** Mínimo 6 caracteres
6. **Haz clic en "Registrarse"**

---

## ✅ VERIFICAR QUE FUNCIONÓ

1. **Después de registrarte, deberías:**
   - Ver la aplicación (no la pantalla de login)
   - Poder crear publicaciones

2. **Verifica en Supabase:**
   - Ve a Supabase → Table Editor → `user_profiles`
   - Deberías ver tu nuevo usuario ✅

---

## 🆘 SI SIGUE SIN FUNCIONAR

### Verificar en la Consola del Navegador

1. **Presiona F12** en tu navegador
2. **Ve a la pestaña "Console"**
3. **Intenta registrarte de nuevo**
4. **Busca errores en rojo**
5. **Copia el mensaje de error** y compártelo

### Errores Comunes:

- **"Email rate limit exceeded"** → Espera más tiempo (5-10 minutos)
- **"User already registered"** → Usa un email diferente
- **"new row violates row-level security policy"** → Ver `SOLUCION-ERROR-REGISTRO.md`

---

**¡Espera 1-2 minutos y usa un email nuevo!** 🚀



