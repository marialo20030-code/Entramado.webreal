# 🆕 Configurar Todo con Nueva Cuenta de GitHub

## 🎯 Plan: Empezar de Nuevo con Nueva Cuenta

Vamos a crear una nueva cuenta de GitHub, subir todo el código ahí, y conectarlo con Vercel.

---

## 📋 Paso 1: Crear Nueva Cuenta de GitHub

1. **Ve a [github.com](https://github.com)**
2. **Haz clic en "Sign up"**
3. **Crea tu cuenta:**
   - Email (usa uno diferente si quieres)
   - Contraseña
   - Nombre de usuario
4. **Verifica tu email** (revisa tu correo)

---

## 📋 Paso 2: Crear Nuevo Repositorio

1. **En GitHub, haz clic en el "+"** (arriba derecha) → **"New repository"**
2. **Rellena:**
   - **Repository name**: `inspiracion-web` (o el nombre que quieras)
   - **Description**: (opcional) "Aplicación de inspiración"
   - ✅ Marca **"Private"** si quieres que sea privado
   - ❌ **NO marques** "Add a README file" (vamos a subir nuestros archivos)
3. **Haz clic en "Create repository"**

---

## 📋 Paso 3: Subir Todos los Archivos

**Ahora sube TODOS los archivos de tu proyecto:**

1. **En GitHub, en tu nuevo repositorio:**
   - Haz clic en **"Add file"** → **"Upload files"**

2. **Desde tu PC, sube TODA la carpeta `project`:**
   - Abre: `C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project\`
   - Selecciona **TODOS los archivos y carpetas** EXCEPTO:
     - ❌ `node_modules` (muy pesada, no es necesaria)
     - ❌ `.env` o archivos `.local` (si existen)
     - ❌ `dist` (si existe)

3. **Arrastra todo a GitHub:**
   - Arrastra todos los archivos seleccionados a la página de GitHub
   - O haz clic en **"Choose your files"** y selecciona todos

4. **Commit:**
   - Mensaje: "Versión inicial completa del proyecto"
   - Haz clic en **"Commit changes"**

**⚠️ IMPORTANTE:** Asegúrate de subir:
- ✅ `src/` (carpeta completa con todos los archivos)
- ✅ `supabase/` (carpeta completa)
- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `vercel.json`
- ✅ Todos los demás archivos

---

## 📋 Paso 4: Conectar con Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Inicia sesión** (o crea cuenta nueva)
3. **Haz clic en "Add New..."** → **"Project"**
4. **Importa tu nuevo repositorio:**
   - Busca tu nuevo repositorio de GitHub
   - Haz clic en **"Import"**

5. **Configuración:**
   - **Project Name**: Déjalo como está
   - **Framework Preset**: Debería detectar "Vite"
   - **Root Directory**: `./` (o déjalo vacío)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **Variables de entorno (MUY IMPORTANTE):**
   - Antes de hacer Deploy, haz clic en **"Environment Variables"**
   - Agrega:
     - `VITE_SUPABASE_URL` = (tu URL de Supabase de Bolt)
     - `VITE_SUPABASE_ANON_KEY` = (tu clave de Supabase de Bolt)
   - ✅ Marca: Production, Preview, Development
   - Haz clic en **"Add"** para cada una

7. **Deploy:**
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos

---

## ✅ Resumen de Pasos

1. ✅ Crear nueva cuenta en GitHub
2. ✅ Crear nuevo repositorio
3. ✅ Subir TODOS los archivos del proyecto
4. ✅ Conectar nuevo repositorio con Vercel
5. ✅ Agregar variables de entorno de Supabase
6. ✅ Deploy
7. ✅ ¡Tu web está en internet! 🎉

---

## 🔑 Credenciales que Necesitas

**De Supabase (Bolt):**
- `VITE_SUPABASE_URL` = (la que copiaste de Bolt)
- `VITE_SUPABASE_ANON_KEY` = (la que copiaste de Bolt)

**Estas son las mismas que usaste antes, las copias de Bolt.**

---

## 📋 Checklist

- [ ] Nueva cuenta de GitHub creada
- [ ] Nuevo repositorio creado
- [ ] Todos los archivos subidos a GitHub
- [ ] Repositorio conectado con Vercel
- [ ] Variables de entorno agregadas en Vercel
- [ ] Deploy realizado
- [ ] Web funcionando en internet ✅

---

**¿Quieres que te guíe paso a paso mientras lo haces?** 🚀

