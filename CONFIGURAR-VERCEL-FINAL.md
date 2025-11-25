# ✅ Configurar Credenciales en Vercel - Paso Final

## 🎯 Ahora que Tienes las Credenciales

Sigue estos pasos para configurarlas en Vercel:

---

## 📋 Paso 1: Ir a Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Inicia sesión** (si no estás logueado)
3. **Haz clic en tu proyecto** (el que desplegaste)

---

## 📋 Paso 2: Agregar Variables de Entorno

1. **En tu proyecto de Vercel:**
   - Haz clic en **"Settings"** (arriba en el menú)
   - En el menú lateral izquierdo, haz clic en **"Environment Variables"**

2. **Agregar Variable 1:**
   - Haz clic en **"Add New"** o **"Add"**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Pega la URL de Supabase que copiaste (ej: `https://xxxxx.supabase.co`)
   - ✅ Marca las 3 casillas:
     - **Production**
     - **Preview**
     - **Development**
   - Haz clic en **"Add"** o **"Save"**

3. **Agregar Variable 2:**
   - Haz clic en **"Add New"** nuevamente
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Pega la clave anónima que copiaste (la que empieza con `eyJ...`)
   - ✅ Marca las 3 casillas:
     - **Production**
     - **Preview**
     - **Development**
   - Haz clic en **"Add"** o **"Save"**

---

## 📋 Paso 3: Redeploy

**MUY IMPORTANTE:** Después de agregar las variables, necesitas hacer redeploy:

1. **Ve a "Deployments"** (en el menú superior)
2. **Busca el último deploy** (el más reciente)
3. **Haz clic en los 3 puntos** (⋯) a la derecha del deploy
4. **Haz clic en "Redeploy"**
5. **Espera 2-3 minutos** mientras Vercel vuelve a construir tu aplicación

---

## 📋 Paso 4: Verificar que Funciona

1. **Cuando termine el redeploy:**
   - Verás un ✅ "Build Successful"
   - Haz clic en **"Visit"** o copia la URL

2. **Abre tu web en el navegador:**
   - Refresca la página (F5)
   - **¡Deberías ver tus 9 publicaciones!** ✅

3. **Prueba iniciar sesión:**
   - Usa tu usuario antiguo
   - Debería funcionar ahora

---

## ✅ Checklist Final

- [ ] Agregué `VITE_SUPABASE_URL` en Vercel
- [ ] Agregué `VITE_SUPABASE_ANON_KEY` en Vercel
- [ ] Marqué las 3 casillas (Production, Preview, Development) para ambas
- [ ] Hice Redeploy
- [ ] Esperé a que termine el build
- [ ] Abrí mi web en Vercel
- [ ] Veo mis 9 publicaciones ✅
- [ ] Puedo iniciar sesión ✅

---

## 🆘 Si Algo No Funciona

### ❌ No veo las publicaciones después del redeploy

**Solución:**
- Espera 1-2 minutos más
- Refresca la página (F5)
- Verifica en la consola del navegador (F12) si hay errores

### ❌ Error al iniciar sesión

**Solución:**
- Verifica que las variables estén bien escritas (sin espacios extra)
- Verifica que hayas marcado las 3 casillas (Production, Preview, Development)
- Haz otro redeploy

### ❌ La web carga pero está vacía

**Solución:**
- Abre la consola del navegador (F12)
- Ve a la pestaña "Console"
- Mira si hay errores relacionados con Supabase
- Si ves errores, compártelos

---

**¡Sigue estos pasos y tu web debería funcionar perfectamente con todas tus publicaciones!** 🚀

