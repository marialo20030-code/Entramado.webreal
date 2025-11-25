# 🔄 Actualizar Variables de Entorno en Vercel

## ✅ SÍ - Actualiza las Variables Existentes

**NO necesitas borrar el proyecto.** Solo actualiza las variables de entorno con las credenciales correctas de Bolt.

---

## 📋 Paso a Paso

### Opción 1: Actualizar las Variables Existentes (Recomendado)

1. **Ve a Vercel:**
   - [vercel.com](https://vercel.com)
   - Entra a tu proyecto existente

2. **Ve a Settings → Environment Variables**

3. **Busca las variables existentes:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Actualiza cada una:**
   - Haz clic en el lápiz ✏️ o en "Edit" (si aparece)
   - O simplemente **borra el valor antiguo** y **pega el nuevo valor** de Bolt
   - Haz clic en **"Save"** o **"Update"**

5. **Verifica que los valores sean correctos:**
   - `VITE_SUPABASE_URL` = La URL de Bolt (ej: `https://xxxxx.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = La clave de Bolt (empieza con `eyJ...`)

---

### Opción 2: Borrar y Crear Nuevas (Si no puedes editar)

**Si no puedes editar las variables existentes:**

1. **En Vercel → Settings → Environment Variables**

2. **Borrar las antiguas:**
   - Busca `VITE_SUPABASE_URL`
   - Haz clic en el ícono de basura 🗑️ o "Delete"
   - Confirma que quieres borrarla
   - Repite con `VITE_SUPABASE_ANON_KEY`

3. **Crear las nuevas:**
   - Haz clic en **"Add New"**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: La URL de Bolt
   - ✅ Marca: Production, Preview, Development
   - **Add**

   - Haz clic en **"Add New"** otra vez
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: La clave de Bolt
   - ✅ Marca: Production, Preview, Development
   - **Add**

---

## ⚠️ IMPORTANTE: Después de Actualizar

**NO OLVIDES hacer Redeploy:**

1. **Ve a "Deployments"**
2. **Haz clic en los 3 puntos (⋯)** del último deploy
3. **Haz clic en "Redeploy"**
4. **Espera 2-3 minutos**

**Si NO haces redeploy, los cambios NO se aplicarán.**

---

## ✅ Checklist

- [ ] Entré a mi proyecto existente en Vercel
- [ ] Fui a Settings → Environment Variables
- [ ] Actualicé `VITE_SUPABASE_URL` con la URL de Bolt
- [ ] Actualicé `VITE_SUPABASE_ANON_KEY` con la clave de Bolt
- [ ] Verifiqué que los valores sean correctos
- [ ] Hice Redeploy
- [ ] Esperé a que termine el build
- [ ] Refresqué mi web
- [ ] Veo mis 9 publicaciones ✅

---

## 🎯 Resumen

**SÍ, actualiza las variables en tu proyecto existente:**
- ✅ No necesitas borrar el proyecto
- ✅ Solo actualiza los valores de las variables
- ✅ O bórralas y créalas de nuevo con los valores correctos
- ✅ **IMPORTANTE:** Haz Redeploy después

---

**¿Ya actualizaste las variables? ¿Necesitas ayuda con algún paso?** 🚀

