# ✅ Verificar y Actualizar Variables en Vercel - Paso a Paso

## 🎯 OBJETIVO

Verificar que las variables de entorno en Vercel coincidan con las de tu archivo `.env` local.

---

## 📋 PASO 1: Ir a Vercel

1. **Abre tu navegador**
2. **Ve a:** [vercel.com](https://vercel.com)
3. **Inicia sesión** (si no estás logueado)
4. **Encuentra tu proyecto** "Entramado" o el nombre que le diste
5. **Haz clic en tu proyecto**

---

## 📋 PASO 2: Ir a Settings → Environment Variables

1. **En la parte superior de tu proyecto, haz clic en "Settings"**
2. **En el menú lateral izquierdo, busca y haz clic en "Environment Variables"**

---

## 📋 PASO 3: Verificar Variables Existentes

**Deberías ver una lista de variables de entorno.**

**Busca estas 2 variables:**

1. **`VITE_SUPABASE_URL`**
   - Debe tener el valor: `https://upfnzshpcwabetytryro.supabase.co`

2. **`VITE_SUPABASE_ANON_KEY`**
   - Debe tener el valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZm56c2hwY3dhYmV0eXRyeXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTQ3OTcsImV4cCI6MjA4MzA3MDc5N30.OH1MhcupV_IPUCPasX5yEhWCzyswPm1insCP2JfNpsU`

---

## ✅ ESCENARIO 1: Las Variables Existen y Coinciden

**Si ambas variables existen y tienen los valores correctos:**

1. ✅ **Verifica que estén marcadas para los 3 entornos:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

2. **Si están marcadas para los 3 entornos:**
   - ✅ **¡Perfecto!** No necesitas hacer nada más
   - Ve al **Paso 5** para hacer redeploy (por si acaso)

---

## ⚠️ ESCENARIO 2: Las Variables Existen pero NO Coinciden

**Si las variables tienen valores diferentes:**

### Actualizar VITE_SUPABASE_URL:

1. **Haz clic en el lápiz ✏️ o "Edit"** junto a `VITE_SUPABASE_URL`
2. **Reemplaza el valor con:** `https://upfnzshpcwabetytryro.supabase.co`
3. **Asegúrate de que estén marcadas:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Haz clic en "Save" o "Update"**

### Actualizar VITE_SUPABASE_ANON_KEY:

1. **Haz clic en el lápiz ✏️ o "Edit"** junto a `VITE_SUPABASE_ANON_KEY`
2. **Reemplaza el valor con:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZm56c2hwY3dhYmV0eXRyeXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTQ3OTcsImV4cCI6MjA4MzA3MDc5N30.OH1MhcupV_IPUCPasX5yEhWCzyswPm1insCP2JfNpsU`
3. **Asegúrate de que estén marcadas:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Haz clic en "Save" o "Update"**

---

## ❌ ESCENARIO 3: Las Variables NO Existen

**Si no ves ninguna de las 2 variables:**

### Agregar VITE_SUPABASE_URL:

1. **Haz clic en "Add New" o "Add"** (botón verde o azul)
2. **Key:** `VITE_SUPABASE_URL`
3. **Value:** `https://upfnzshpcwabetytryro.supabase.co`
4. **Marca las 3 casillas:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Haz clic en "Add" o "Save"**

### Agregar VITE_SUPABASE_ANON_KEY:

1. **Haz clic en "Add New" otra vez**
2. **Key:** `VITE_SUPABASE_ANON_KEY`
3. **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZm56c2hwY3dhYmV0eXRyeXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTQ3OTcsImV4cCI6MjA4MzA3MDc5N30.OH1MhcupV_IPUCPasX5yEhWCzyswPm1insCP2JfNpsU`
4. **Marca las 3 casillas:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Haz clic en "Add" o "Save"**

---

## 📋 PASO 4: Verificar que Están Correctas

**Después de agregar/actualizar, verifica:**

1. **Deberías ver 2 variables en la lista:**
   - ✅ `VITE_SUPABASE_URL` = `https://upfnzshpcwabetytryro.supabase.co`
   - ✅ `VITE_SUPABASE_ANON_KEY` = (tu clave completa)

2. **Ambas deben tener marcadas las 3 casillas:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

## 📋 PASO 5: Hacer Redeploy (MUY IMPORTANTE)

**⚠️ IMPORTANTE:** Después de agregar o actualizar variables, SIEMPRE debes hacer redeploy.

### Cómo Hacer Redeploy:

1. **En Vercel, haz clic en "Deployments"** (en el menú superior)
2. **Verás una lista de tus deployments**
3. **Busca el último deployment** (el más reciente, arriba)
4. **Haz clic en los 3 puntos (⋯)** a la derecha del deployment
5. **Haz clic en "Redeploy"**
6. **Confirma que quieres hacer redeploy**
7. **Espera 2-3 minutos** mientras Vercel reconstruye tu aplicación

### Verificar que el Redeploy Funcionó:

1. **Verás el progreso del build en tiempo real**
2. **Cuando termine, verás:**
   - ✅ "Build Successful" o "Ready"
   - O un ✅ verde

3. **Haz clic en "Visit"** o copia la URL
4. **Abre la URL en tu navegador**
5. **Prueba la aplicación:**
   - Crea un usuario nuevo
   - Crea una publicación
   - Verifica que funcione

---

## ✅ CHECKLIST FINAL

- [ ] Entré a Vercel y encontré mi proyecto
- [ ] Fui a Settings → Environment Variables
- [ ] Verifiqué que existe `VITE_SUPABASE_URL`
- [ ] Verifiqué que el valor es correcto: `https://upfnzshpcwabetytryro.supabase.co`
- [ ] Verifiqué que existe `VITE_SUPABASE_ANON_KEY`
- [ ] Verifiqué que el valor es correcto (la clave completa)
- [ ] Verifiqué que ambas tienen marcadas las 3 casillas (Production, Preview, Development)
- [ ] Si no existían o no coincidían, las agregué/actualicé
- [ ] Hice redeploy del proyecto
- [ ] Esperé a que termine el build (2-3 minutos)
- [ ] Probé la aplicación en la URL de Vercel
- [ ] Verifiqué que puedo crear usuario y publicaciones

---

## 🆘 SI HAY PROBLEMAS

### Problema: No veo el botón "Add New"

**Solución:**
- Asegúrate de estar en Settings → Environment Variables
- Busca un botón verde o azul que diga "Add" o "Add New"
- Puede estar arriba o abajo de la lista

### Problema: No puedo editar las variables

**Solución:**
- Busca un icono de lápiz ✏️ o "Edit" junto a cada variable
- O haz clic directamente en la variable
- Algunas versiones de Vercel permiten hacer clic en el valor para editarlo

### Problema: El redeploy falla

**Solución:**
- Revisa los logs del build (haz clic en el deployment)
- Verifica que no haya errores en el código
- Verifica que las variables estén bien escritas (sin espacios extra)

### Problema: La aplicación no funciona después del redeploy

**Solución:**
- Espera 1-2 minutos más (a veces tarda en propagarse)
- Refresca la página (F5)
- Limpia la caché del navegador (Ctrl+Shift+Delete)
- Verifica en la consola del navegador (F12) si hay errores

---

## 📝 NOTAS IMPORTANTES

1. **Siempre marca las 3 casillas** (Production, Preview, Development) para ambas variables
2. **Después de actualizar variables, SIEMPRE haz redeploy**
3. **Las variables deben ser EXACTAMENTE iguales** a las de tu `.env` local
4. **No agregues espacios extra** al inicio o final de los valores

---

**¡Sigue estos pasos y tu aplicación en Vercel funcionará correctamente!** 🚀



