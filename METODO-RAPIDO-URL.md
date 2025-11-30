# ⚡ Método Rápido: Importar por URL

## 🎯 El Método Más Fácil (2 minutos)

**Si Vercel no muestra tu nueva cuenta de GitHub, usa este método:**

---

## 📋 Pasos

### 1️⃣ Obtener URL del Repositorio

1. **Ve a GitHub:**
   - Abre tu nuevo repositorio
   - Haz clic en el botón verde **"Code"**
   - Copia la URL HTTPS
   - Ejemplo: `https://github.com/tu-usuario/inspiracion-web.git`

### 2️⃣ Importar en Vercel

1. **Ve a Vercel:**
   - [vercel.com](https://vercel.com)
   - Inicia sesión

2. **Importar por URL:**
   - Haz clic en **"Add New..."** → **"Project"**
   - En la parte superior, busca: **"Import Git Repository"**
   - O haz clic en: **"Import Third-Party Git Repository"**
   - Pega la URL que copiaste
   - Haz clic en **"Continue"**

3. **Autorizar GitHub:**
   - Te pedirá autorizar Vercel
   - **Asegúrate de iniciar sesión con tu NUEVA cuenta de GitHub**
   - Autoriza los permisos

4. **Configurar Proyecto:**
   - **Project Name**: Déjalo como está
   - **Framework Preset**: Debería detectar "Vite"
   - **Root Directory**: `./` (o déjalo vacío)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Variables de Entorno (MUY IMPORTANTE):**
   - Antes de hacer Deploy, haz clic en **"Environment Variables"**
   - Agrega:
     - `VITE_SUPABASE_URL` = (tu URL de Supabase)
     - `VITE_SUPABASE_ANON_KEY` = (tu clave de Supabase)
   - ✅ Marca: Production, Preview, Development
   - Haz clic en **"Add"** para cada una

6. **Deploy:**
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos

---

## ✅ ¡Listo!

Tu web estará en: `https://tu-proyecto.vercel.app`

---

## 🔍 Si No Funciona

**Si el botón "Import Third-Party" no aparece:**

1. **Desconecta la cuenta antigua:**
   - Vercel → Settings → Git
   - Desconecta GitHub antiguo

2. **Vuelve a intentar importar por URL**

3. **O usa ventana de incógnito:**
   - Abre ventana privada
   - Inicia sesión en Vercel
   - Intenta importar por URL

---

**Este método funciona incluso si Vercel no muestra tu nueva cuenta en la lista.** ⚡

