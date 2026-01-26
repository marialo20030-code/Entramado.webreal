# 🔄 Limpiar y Reiniciar - Pasos Finales

## ✅ PASO 1: Limpiar el Navegador

1. **Abre tu navegador** (Chrome, Edge, Firefox, etc.)

2. **Presiona F12** (abre DevTools/Consola de desarrollador)

3. **Ve a la pestaña "Application"** (o "Almacenamiento" en Firefox)

4. **En el menú lateral izquierdo:**
   - Busca **"Local Storage"**
   - Haz clic en **"Local Storage"** para expandirlo
   - Busca: `http://localhost:5173` (o tu dominio)
   - **Haz clic en él**

5. **Elimina todo:**
   - Haz clic derecho en cualquier clave
   - Selecciona **"Clear"** o **"Delete all"**
   - O elimina manualmente las claves que empiecen con `sb-` o `supabase`

6. **También limpia "Session Storage":**
   - En el mismo menú, busca **"Session Storage"**
   - Haz clic en `http://localhost:5173`
   - Elimina todo (si hay algo)

7. **Cierra TODAS las pestañas** del proyecto

8. **Cierra el navegador completamente** (cierra todas las ventanas)

---

## ✅ PASO 2: Detener el Servidor Actual

1. **Ve a la terminal/PowerShell donde está corriendo el servidor**

2. **Presiona Ctrl+C** para detenerlo

3. **Espera a que se detenga completamente** (verás el cursor normal)

---

## ✅ PASO 3: Reiniciar el Servidor

1. **Abre una NUEVA terminal/PowerShell**

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

## ✅ PASO 4: Probar la Aplicación

1. **Abre el navegador** (nuevo, limpio)

2. **Ve a:** http://localhost:5173

3. **Abre la consola del navegador** (F12 → pestaña "Console")

4. **Verifica:**
   - ¿Carga la página sin errores?
   - ¿Ves la pantalla de login/registro?
   - ¿Hay errores en la consola?

5. **Si hay errores, cópialos y compártelos**

---

## 🆘 Si Aún No Funciona

### Revisa estos puntos:

1. **Verifica que el archivo .env esté actualizado:**
   - Debe tener las nuevas credenciales
   - Sin espacios extra
   - Guardado correctamente

2. **Verifica que el servidor esté corriendo:**
   - Debe decir "Local: http://localhost:5173/"

3. **Revisa los errores en la consola:**
   - F12 → Console
   - ¿Qué errores aparecen?

4. **Verifica las credenciales en Supabase:**
   - Ve a Settings → API
   - Confirma que las credenciales son correctas

---

**Sigue estos pasos y avísame qué pasa.** 🔍







