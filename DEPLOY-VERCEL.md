# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a publicar tu aplicación en Vercel de forma gratuita.

## 📋 Requisitos Previos

1. **Cuenta de Vercel**: Regístrate en [vercel.com](https://vercel.com) (es gratis)
2. **Cuenta de GitHub** (recomendado): Para conectar tu proyecto
3. **Variables de entorno de Supabase**: Necesitarás tu `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

---

## 🎯 Opción 1: Desplegar desde GitHub (Recomendado)

### Paso 1: Subir tu proyecto a GitHub

1. Ve a [github.com](https://github.com) y crea una cuenta (si no la tienes)
2. Crea un nuevo repositorio
3. Sube tu proyecto a GitHub:
   - Puedes usar GitHub Desktop (más fácil)
   - O usar comandos Git desde terminal

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno

En la página de configuración del proyecto:

1. Ve a **"Environment Variables"**
2. Agrega estas variables:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - Haz clic en **"Add"**
   
3. Agrega la segunda variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Tu clave anónima de Supabase
   - Haz clic en **"Add"**

### Paso 4: Deployar

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel construye tu aplicación
3. ¡Listo! Tu web estará disponible en una URL como: `tu-proyecto.vercel.app`

---

## 🎯 Opción 2: Desplegar subiendo archivos directamente

### Paso 1: Preparar el proyecto

1. Abre la terminal en la carpeta `project`
2. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```

### Paso 2: Iniciar sesión en Vercel

```bash
vercel login
```

### Paso 3: Deployar

```bash
vercel
```

Sigue las instrucciones:
- ¿Set up and deploy? → **Yes**
- ¿Which scope? → Selecciona tu cuenta
- ¿Link to existing project? → **No**
- ¿What's your project's name? → Escribe un nombre
- ¿In which directory is your code located? → Presiona Enter (usará `./`)
- ¿Want to override settings? → **No**

### Paso 4: Configurar Variables de Entorno

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a **Settings** → **Environment Variables**
3. Agrega:
   - `VITE_SUPABASE_URL` = Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = Tu clave anónima

### Paso 5: Redeployar

Después de agregar las variables, haz clic en **"Redeploy"** para que se apliquen.

---

## 📝 Cómo encontrar tus credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión y selecciona tu proyecto
3. Ve a **Settings** (⚙️) → **API**
4. Ahí encontrarás:
   - **Project URL** = Tu `VITE_SUPABASE_URL`
   - **anon public** key = Tu `VITE_SUPABASE_ANON_KEY`

---

## ✅ Verificar que funciona

Después del deploy:
1. Abre la URL que te dio Vercel (ej: `tu-proyecto.vercel.app`)
2. Deberías ver tu aplicación funcionando
3. Prueba iniciar sesión o crear una publicación

---

## 🔄 Actualizaciones Futuras

Si despliegas desde GitHub:
- Cada vez que hagas `git push`, Vercel desplegará automáticamente la nueva versión

Si despliegas desde CLI:
- Ejecuta `vercel` nuevamente para actualizar

---

## 🆘 Problemas Comunes

### ❌ Error: "Cannot find module"
**Solución**: Verifica que las variables de entorno estén configuradas correctamente.

### ❌ Error: "Failed to fetch"
**Solución**: Revisa que tu URL de Supabase sea correcta y que tu proyecto esté activo.

### ❌ La web carga pero no funciona
**Solución**: Verifica en la consola del navegador (F12) si hay errores relacionados con Supabase.

---

## 📞 ¿Necesitas ayuda?

- Documentación de Vercel: [vercel.com/docs](https://vercel.com/docs)
- Soporte de Vercel: [vercel.com/support](https://vercel.com/support)




