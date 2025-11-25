# 🚀 Guía: GitHub + Vercel SIN descargar nada

Esta guía te permite subir tu proyecto a GitHub directamente desde el navegador, sin instalar nada.

---

## 📋 Paso 1: Crear repositorio en GitHub (desde la web)

### Opción A: Subir archivos arrastrando (MÁS FÁCIL) ⭐

1. **Crear repositorio**:
   - Ve a [github.com](https://github.com)
   - Inicia sesión (o crea cuenta gratis)
   - Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
   - **Repository name**: `inspiracion-web` (o el que quieras)
   - **Description**: (opcional) "Aplicación de inspiración"
   - ✅ Marca **"Private"** si quieres que sea privado
   - ✅ **NO marques** "Add a README file" (vamos a subir nuestros archivos)
   - Haz clic en **"Create repository"**

2. **Subir archivos desde tu computadora**:
   - GitHub te mostrará una página con opciones
   - Haz clic en **"uploading an existing file"** (arriba de la página)
   - O simplemente arrastra la carpeta `project` a la página de GitHub
   - O haz clic en **"Choose your files"** y selecciona todos los archivos

   **¿Qué archivos subir?**
   - Necesitas subir **todos los archivos de la carpeta `project`**
   - **PERO NO subas**:
     - ❌ `node_modules` (carpeta grande, no es necesaria)
     - ❌ `.env` o archivos `.local` (si los tienes)
     - ❌ `dist` (si existe, se genera automáticamente)

3. **Commit inicial**:
   - Abajo de la página, escribe un mensaje: "Primera versión del proyecto"
   - Haz clic en **"Commit changes"**
   - ¡Listo! Tu proyecto está en GitHub

---

### Opción B: Usar GitHub Web Editor (alternativa)

1. **Crear repositorio**:
   - Ve a [github.com](https://github.com)
   - Crea un nuevo repositorio (como en Opción A)
   - ✅ Esta vez SÍ marca **"Add a README file"**
   - Haz clic en **"Create repository"**

2. **Subir archivos**:
   - En tu repositorio, haz clic en **"Add file"** → **"Upload files"**
   - Arrastra todos los archivos de la carpeta `project`
   - (Excluye `node_modules` si la ves)
   - Abajo, escribe mensaje: "Primera versión"
   - Haz clic en **"Commit changes"**

---

## 📋 Paso 2: Conectar GitHub con Vercel

1. **Ir a Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en **"Sign Up"** (si no tienes cuenta)
   - Elige **"Continue with GitHub"** ⭐ (lo más fácil)
   - Autoriza a Vercel para acceder a tu GitHub

2. **Importar proyecto**:
   - En el dashboard de Vercel
   - Haz clic en **"Add New..."** → **"Project"**
   - Verás todos tus repositorios de GitHub
   - Busca `inspiracion-web` (o el nombre que le diste)
   - Haz clic en **"Import"**

---

## 📋 Paso 3: Configurar en Vercel

1. **Configuración básica**:
   - **Project Name**: Déjalo como está
   - **Framework Preset**: Debería detectar "Vite" automáticamente
   - **Root Directory**: Si todo está en la raíz, déjalo como `./`
     - Si tus archivos están en una subcarpeta, cámbialo a `./project`
   - **Build Command**: `npm run build` (ya debería estar)
   - **Output Directory**: `dist` (ya debería estar)

2. **Variables de entorno** (MUY IMPORTANTE - hazlo ANTES de deploy):
   - En la misma página, ve a la sección **"Environment Variables"**
   - Haz clic en **"Add"** o en el campo de variables

   **Agrega Variable 1:**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Tu URL de Supabase
     - Ejemplo: `https://xxxxx.supabase.co`
   - ✅ Marca: **Production**, **Preview**, y **Development**
   - Haz clic en **"Add"**

   **Agrega Variable 2:**
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Tu clave anónima de Supabase
   - ✅ Marca: **Production**, **Preview**, y **Development**
   - Haz clic en **"Add"**

   **¿Dónde encontrar estas credenciales?**
   - Ve a [supabase.com](https://supabase.com)
   - Inicia sesión
   - Selecciona tu proyecto
   - Ve a ⚙️ **Settings** → **API**
   - Copia **"Project URL"** → Esa es tu `VITE_SUPABASE_URL`
   - Copia **"anon public"** key → Esa es tu `VITE_SUPABASE_ANON_KEY`

3. **Deploy**:
   - Revisa que las variables de entorno estén agregadas
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos
   - Verás el progreso en tiempo real

---

## 📋 Paso 4: ¡Listo! 🎉

1. **Tu web está en internet**:
   - Cuando termine, Vercel te dará una URL
   - Ejemplo: `inspiracion-web.vercel.app`
   - Haz clic en **"Visit"** o copia la URL

2. **Verificar que funciona**:
   - Abre la URL en tu navegador
   - Prueba iniciar sesión
   - Crea una publicación de prueba
   - Si todo funciona, ¡ya está publicada en internet! 🎉

---

## ✅ Resumen de pasos:

1. ✅ Crear cuenta en GitHub (si no tienes)
2. ✅ Crear repositorio nuevo
3. ✅ Subir archivos arrastrando desde tu computadora
4. ✅ Crear cuenta en Vercel (con GitHub)
5. ✅ Importar proyecto desde GitHub
6. ✅ Agregar variables de entorno (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
7. ✅ Deploy
8. ✅ ¡Tu web está en internet!

---

## 💡 Consejos Importantes:

### 📁 ¿Qué archivos NO subir a GitHub?
No necesitas subir estos (GitHub los ignorará automáticamente si está bien configurado):
- ❌ `node_modules/` (muy grande, no es necesario)
- ❌ `.env` o `.env.local` (archivos con secretos)
- ❌ `dist/` (se genera automáticamente)

### 🔐 Variables de Entorno:
- **MUY IMPORTANTE**: Agrega las variables ANTES de hacer el primer deploy
- Si olvidas agregarlas, puedes agregarlas después y hacer "Redeploy"

### 📍 Root Directory en Vercel:
- Si tus archivos están directamente en la raíz del repositorio: `./`
- Si están en una subcarpeta llamada `project`: `./project`

---

## 🆘 Problemas Comunes:

### ❌ "No me deja arrastrar la carpeta"
- Intenta subir archivo por archivo
- O usa "Choose your files" y selecciona varios a la vez

### ❌ "El repositorio es muy grande"
- No subas `node_modules` (es muy pesado)
- Vercel lo instalará automáticamente

### ❌ "Vercel no encuentra los archivos"
- Verifica el **Root Directory** en la configuración de Vercel
- Si tus archivos están en `project/`, cámbialo a `./project`

### ❌ "Error al hacer deploy"
- Verifica que las variables de entorno estén bien escritas
- Revisa que no haya espacios extra
- Verifica que tu proyecto de Supabase esté activo

---

**¡Listo! Ahora puedes publicar tu web sin descargar nada.** 🚀

