# ✅ Verificación de Credenciales en .env

## 📋 CREDENCIALES ACTUALES EN TU ARCHIVO .env

Tu archivo `.env` tiene:

```env
VITE_SUPABASE_URL=https://upfnzshpcwabetytryro.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZm56c2hwY3dhYmV0eXRyeXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTQ3OTcsImV4cCI6MjA4MzA3MDc5N30.OH1MhcupV_IPUCPasX5yEhWCzyswPm1insCP2JfNpsU
```

**✅ El ID del proyecto coincide:** `upfnzshpcwabetytryro`

---

## 🔍 VERIFICAR QUE COINCIDEN CON SUPABASE

### Paso 1: Verificar en Supabase

1. **Ve a [supabase.com](https://supabase.com)**
2. **Inicia sesión**
3. **Entra a tu proyecto "Entramado.web"**
4. **Haz clic en el engranaje ⚙️** (arriba) → **Settings**
5. **Haz clic en "API"** en el menú lateral

### Paso 2: Comparar Credenciales

**En Supabase deberías ver:**

- **Project URL:** `https://upfnzshpcwabetytryro.supabase.co`
  - ✅ Debe coincidir con `VITE_SUPABASE_URL` en tu `.env`

- **anon public key:** (una clave larga que empieza con `eyJ...`)
  - ✅ Debe coincidir con `VITE_SUPABASE_ANON_KEY` en tu `.env`

### Paso 3: Si NO Coinciden

**Si las credenciales en Supabase son diferentes:**

1. **Copia las nuevas credenciales de Supabase**
2. **Abre tu archivo `.env`** (el que tienes seleccionado)
3. **Reemplaza las líneas con las nuevas credenciales:**
   ```env
   VITE_SUPABASE_URL=https://nueva-url.supabase.co
   VITE_SUPABASE_ANON_KEY=nueva-clave-completa
   ```
4. **Guarda el archivo**

---

## ✅ VERIFICAR EN VERCEL

### Paso 1: Ir a Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Inicia sesión**
3. **Entra a tu proyecto**

### Paso 2: Verificar Variables de Entorno

1. **Haz clic en "Settings"** (arriba)
2. **Haz clic en "Environment Variables"** (menú lateral)
3. **Verifica que tengas estas 2 variables:**

   - `VITE_SUPABASE_URL` = `https://upfnzshpcwabetytryro.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (la clave que está en tu `.env`)

### Paso 3: Si NO Coinciden o No Existen

**Si las variables no existen o son diferentes:**

1. **Si no existen:**
   - Haz clic en "Add New"
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://upfnzshpcwabetytryro.supabase.co`
   - ✅ Marca: Production, Preview, Development
   - Add

   - Haz clic en "Add New" otra vez
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: (la clave de tu `.env`)
   - ✅ Marca: Production, Preview, Development
   - Add

2. **Si existen pero son diferentes:**
   - Haz clic en el lápiz ✏️ o "Edit"
   - Actualiza el valor
   - Save

3. **Haz Redeploy:**
   - Ve a "Deployments"
   - Haz clic en los 3 puntos (⋯) del último deploy
   - "Redeploy"
   - Espera 2-3 minutos

---

## 🧪 PROBAR QUE FUNCIONA

### Paso 1: Iniciar Servidor Local

```bash
cd "C:\Users\maria\Desktop\entramado\project-bolt-sb1-fqlqsuxu\project"
npm run dev
```

### Paso 2: Abrir en el Navegador

1. **Abre:** `http://localhost:5173`
2. **Deberías ver la aplicación sin errores**

### Paso 3: Probar Funcionalidad

1. **Crea un usuario nuevo:**
   - Haz clic en "Registrarse" o "Sign up"
   - Completa el formulario
   - Crea la cuenta

2. **Inicia sesión:**
   - Usa el usuario que acabas de crear
   - Deberías poder iniciar sesión

3. **Crea una publicación:**
   - Crea una carpeta (si no hay)
   - Crea una publicación nueva
   - Sube una imagen
   - Guarda

4. **Verifica en Supabase:**
   - Vuelve a Supabase
   - Haz clic en la tabla `posts`
   - **Deberías ver tu nueva publicación** ✅

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Verifiqué las credenciales en Supabase (Settings → API)
- [ ] Comparé con mi archivo `.env` - ¿Coinciden?
- [ ] Si no coinciden, actualicé el `.env` con las credenciales correctas
- [ ] Verifiqué variables en Vercel (Settings → Environment Variables)
- [ ] Si no coinciden, actualicé las variables en Vercel
- [ ] Si actualicé Vercel, hice redeploy
- [ ] Inicié el servidor local (`npm run dev`)
- [ ] Probé crear un usuario nuevo
- [ ] Probé crear una publicación nueva
- [ ] Verifiqué en Supabase que la publicación se guardó

---

## 🆘 SI HAY PROBLEMAS

### Problema: Error "Failed to fetch" o conexión

**Solución:**
- Verifica que las credenciales en `.env` sean exactamente iguales a las de Supabase
- Verifica que no haya espacios extra al inicio o final
- Reinicia el servidor después de actualizar `.env`

### Problema: "Invalid API key"

**Solución:**
- Verifica que copiaste la clave completa (es muy larga)
- Verifica que copiaste la clave "anon public", no "service_role"
- Verifica que no haya espacios en la clave

### Problema: La aplicación carga pero no puedo crear usuario

**Solución:**
- Abre la consola del navegador (F12)
- Ve a la pestaña "Console"
- Busca errores relacionados con Supabase
- Comparte los errores si los hay

---

## 📝 NOTAS IMPORTANTES

1. **El archivo `.env` está en la ubicación correcta** ✅
2. **Las credenciales deben ser EXACTAMENTE iguales** en:
   - Archivo `.env` local
   - Variables de entorno en Vercel
   - Credenciales en Supabase Settings → API

3. **Después de actualizar `.env` o Vercel:**
   - Reinicia el servidor local
   - O haz redeploy en Vercel

---

**¡Verifica que las credenciales coincidan y prueba la aplicación!** 🚀



