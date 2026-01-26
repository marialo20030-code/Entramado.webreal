# 🔍 Verificar Errores en la Consola - Guía Completa

## ✅ ESTADO ACTUAL

La consola muestra "No hay problemas" - esto es bueno, significa que no hay errores de JavaScript.

Pero el registro no funciona, así que necesitamos verificar más cosas.

---

## 🔍 PASOS PARA VERIFICAR

### Paso 1: Verificar la Pestaña "Red" (Network)

**Esto mostrará si hay errores en las peticiones a Supabase:**

1. **En las DevTools, haz clic en la pestaña "Red" (Network)**
2. **Limpia la consola** (haz clic en el icono de círculo con diagonal)
3. **Intenta registrarte de nuevo:**
   - Llena el formulario
   - Haz clic en "Registrarse"
4. **Observa las peticiones en la pestaña "Red":**
   - Busca peticiones a `supabase.co`
   - Haz clic en ellas para ver los detalles
   - Busca peticiones con código de error (rojas o amarillas)

**Qué buscar:**
- **Código 429:** Rate limit (demasiados intentos)
- **Código 400:** Error en la petición
- **Código 500:** Error del servidor

---

### Paso 2: Filtrar Errores en la Consola

**Puede haber errores ocultos:**

1. **En la consola, verifica los filtros:**
   - Asegúrate de que NO esté marcado "Ocultar red"
   - Marca "Mantener registro" para ver todos los mensajes
   - Desmarca "Solo contexto seleccionado"

2. **Intenta registrarte de nuevo** mientras observas la consola

3. **Busca mensajes en rojo o amarillo**

---

### Paso 3: Verificar Mensajes de Supabase

**El código puede estar mostrando mensajes de debug:**

1. **En la consola, busca mensajes que empiecen con:**
   - `🔐` (candado)
   - `🔑` (llave)
   - `❌` (X roja)
   - `✅` (check verde)

2. **Estos mensajes te dirán qué está pasando**

---

## 🧪 PROBAR REGISTRO CON OBSERVACIÓN

### Hacer una Prueba Completa:

1. **Abre la consola (F12)**
2. **Ve a la pestaña "Red" (Network)**
3. **Limpia la consola** (icono de círculo con diagonal)
4. **Llena el formulario de registro:**
   - Email: `test1@example.com` (usa uno NUEVO)
   - Nombre: `test1`
   - Contraseña: `123456` (mínimo 6 caracteres)
5. **Haz clic en "Registrarse"**
6. **Observa:**
   - **Consola:** ¿Aparecen mensajes nuevos?
   - **Red:** ¿Qué peticiones se hacen? ¿Alguna falla?

---

## 📋 QUÉ BUSCAR EN LA PESTAÑA "RED"

### Peticiones Exitosas:
- **Código 200:** Todo bien
- **Código 201:** Recurso creado

### Peticiones con Error:
- **Código 429:** Rate limit - Espera más tiempo
- **Código 400:** Error en los datos enviados
- **Código 401:** No autorizado
- **Código 500:** Error del servidor

### Cómo Ver los Detalles:

1. **Haz clic en una petición** en la pestaña "Red"
2. **Ve a la pestaña "Respuesta" (Response)**
3. **Lee el mensaje de error** (si hay)

---

## 🔧 SOLUCIONES SEGÚN EL ERROR

### Si ves Código 429 (Rate Limit):

**Solución:**
1. **Espera 5-10 minutos**
2. **Usa un email completamente nuevo**
3. **Intenta de nuevo**

### Si ves Código 400:

**Solución:**
1. **Lee el mensaje de error en "Respuesta"**
2. **Verifica que:**
   - El email sea válido
   - La contraseña tenga al menos 6 caracteres
   - El nombre tenga al menos 2 caracteres

### Si ves Código 500:

**Solución:**
1. **Verifica que el proyecto de Supabase esté activo** (no pausado)
2. **Verifica las credenciales en `.env`**
3. **Reinicia el servidor**

### Si NO ves ninguna petición:

**Solución:**
1. **Verifica que el servidor esté corriendo** (`npm run dev`)
2. **Refresca la página** (F5)
3. **Verifica que estés en `http://localhost:5173`**

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Abrí la pestaña "Red" (Network) en DevTools
- [ ] Limpié la consola
- [ ] Intenté registrarme mientras observaba
- [ ] Revisé las peticiones a `supabase.co`
- [ ] Verifiqué los códigos de respuesta (200, 400, 429, etc.)
- [ ] Leí los mensajes de error en "Respuesta" (si hay)
- [ ] Busqué mensajes de debug en la consola (🔐, ❌, ✅)

---

## 🆘 SI SIGUE SIN FUNCIONAR

### Opción 1: Verificar Configuración de Supabase

1. **Ve a Supabase → Authentication → Settings**
2. **Verifica:**
   - "Enable email confirmations" - Debe estar desmarcado para desarrollo
   - "Site URL" - Debe ser `http://localhost:5173` o tu URL de Vercel

### Opción 2: Verificar Credenciales

1. **Verifica que las credenciales en `.env` sean correctas**
2. **Reinicia el servidor** después de verificar

### Opción 3: Probar en Vercel

1. **Abre tu aplicación en Vercel**
2. **Intenta registrarte ahí**
3. **Abre la consola (F12) y observa los errores**

---

**¡Sigue estos pasos y comparte qué ves en la pestaña "Red" cuando intentas registrarte!** 🔍



