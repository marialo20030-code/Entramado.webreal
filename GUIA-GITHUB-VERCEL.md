# 🚀 Guía Completa: GitHub → Vercel

## 📋 Paso 1: Crear repositorio en GitHub

### Opción A: Usando GitHub Desktop (Más Fácil) ⭐ RECOMENDADO

1. **Descarga GitHub Desktop**:
   - Ve a [desktop.github.com](https://desktop.github.com)
   - Descarga e instala GitHub Desktop
   - Inicia sesión con tu cuenta de GitHub (o créala en [github.com](https://github.com))

2. **Crear nuevo repositorio**:
   - Abre GitHub Desktop
   - Haz clic en **"File"** → **"New Repository"**
   - **Name**: `inspiracion-web` (o el nombre que quieras)
   - **Description**: "Aplicación de inspiración con Pinterest-style"
   - **Local Path**: Selecciona la carpeta `C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu`
   - ✅ Marca **"Initialize this repository with a README"**
   - Haz clic en **"Create Repository"**

3. **Subir el proyecto**:
   - En GitHub Desktop, verás todos tus archivos
   - En la parte inferior, escribe un mensaje como: "Primera versión del proyecto"
   - Haz clic en **"Commit to main"**
   - Luego haz clic en **"Publish repository"**
   - ✅ Marca **"Keep this code private"** (o desmárcalo si quieres que sea público)
   - Haz clic en **"Publish Repository"**

   ¡Listo! Tu proyecto está en GitHub.

---

### Opción B: Desde la web de GitHub

1. **Crear repositorio**:
   - Ve a [github.com](https://github.com)
   - Inicia sesión (o crea una cuenta gratis)
   - Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
   - **Repository name**: `inspiracion-web` (o el que quieras)
   - **Description**: (opcional) "Aplicación de inspiración"
   - ✅ Marca **"Private"** (si quieres que sea privado)
   - ✅ Marca **"Add a README file"**
   - Haz clic en **"Create repository"**

2. **Subir archivos**:
   - GitHub mostrará instrucciones
   - **La forma más fácil es usar GitHub Desktop** (ver Opción A arriba)
   - O puedes arrastrar y soltar archivos desde la interfaz web

---

## 📋 Paso 2: Conectar GitHub con Vercel

1. **Ir a Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en **"Sign Up"** (si no tienes cuenta)
   - Elige **"Continue with GitHub"** (es más fácil)
   - Autoriza a Vercel para acceder a tu GitHub

2. **Importar proyecto**:
   - En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
   - Verás todos tus repositorios de GitHub
   - Busca `inspiracion-web` (o el nombre que le diste)
   - Haz clic en **"Import"**

---

## 📋 Paso 3: Configurar el proyecto en Vercel

1. **Configuración básica**:
   - **Project Name**: Déjalo como está o cámbialo si quieres
   - **Framework Preset**: Debería detectar automáticamente "Vite"
   - **Root Directory**: Déjalo como `./` o cambia a `./project` si es necesario
   - **Build Command**: `npm run build` (ya debería estar)
   - **Output Directory**: `dist` (ya debería estar)

2. **Variables de entorno** (MUY IMPORTANTE):
   - Antes de hacer deploy, haz clic en **"Environment Variables"**
   - Agrega estas 2 variables:

   **Variable 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - ✅ Marca: **Production**, **Preview**, y **Development**
   - Haz clic en **"Add"**

   **Variable 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Tu clave anónima de Supabase
   - ✅ Marca: **Production**, **Preview**, y **Development**
   - Haz clic en **"Add"**

   **¿Dónde encontrar estas credenciales?**
   - Ve a [supabase.com](https://supabase.com)
   - Inicia sesión y selecciona tu proyecto
   - Ve a ⚙️ **Settings** → **API**
   - Copia **Project URL** → Ese es tu `VITE_SUPABASE_URL`
   - Copia **anon public** key → Ese es tu `VITE_SUPABASE_ANON_KEY`

3. **Deploy**:
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos mientras Vercel construye tu aplicación
   - Verás el progreso en tiempo real

---

## 📋 Paso 4: ¡Listo!

1. **Tu web está en internet**:
   - Vercel te dará una URL como: `inspiracion-web.vercel.app`
   - Haz clic en esa URL o en **"Visit"** para ver tu web

2. **Verificar que funciona**:
   - Abre la URL en tu navegador
   - Prueba iniciar sesión
   - Crea una publicación de prueba
   - Si todo funciona, ¡ya está en internet! 🎉

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios en tu código:

1. **Desde GitHub Desktop**:
   - Haz tus cambios en el código
   - En GitHub Desktop, escribe un mensaje de commit
   - Haz clic en **"Commit to main"**
   - Haz clic en **"Push origin"** (arriba)

2. **Vercel desplegará automáticamente**:
   - Vercel detectará los cambios en GitHub
   - Automáticamente hará un nuevo deploy
   - En 2-3 minutos, tu web estará actualizada

---

## ✅ Resumen de pasos:

1. ✅ Instalar GitHub Desktop y crear repositorio
2. ✅ Subir proyecto a GitHub
3. ✅ Crear cuenta en Vercel (con GitHub)
4. ✅ Importar proyecto desde GitHub a Vercel
5. ✅ Agregar variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`)
6. ✅ Hacer Deploy
7. ✅ ¡Tu web está en internet!

---

## 🆘 Si tienes problemas:

### ❌ No aparece mi repositorio en Vercel
- Verifica que hayas dado permisos a Vercel en GitHub
- Ve a GitHub → Settings → Applications → Authorized OAuth Apps
- Verifica que Vercel esté autorizado

### ❌ Error al hacer deploy
- Verifica que las variables de entorno estén bien escritas
- Revisa que no haya espacios extra en las variables
- Verifica que tu proyecto de Supabase esté activo

### ❌ La web carga pero da error
- Abre la consola del navegador (F12)
- Mira si hay errores relacionados con Supabase
- Verifica que las variables de entorno estén correctas

---

**¿Listo para empezar? ¡Ve al Paso 1 y sigue las instrucciones!** 🚀


