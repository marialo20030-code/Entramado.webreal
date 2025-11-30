# 🚀 Desplegar Directamente a Vercel (Sin GitHub)

## 🎯 Si no puedes conectar GitHub, despliega directamente

Esta es una alternativa que funciona sin necesidad de conectar GitHub.

---

## 📋 Paso 1: Instalar Vercel CLI

**Abre PowerShell o CMD y ejecuta:**

```bash
npm install -g vercel
```

**Espera a que termine la instalación** (1-2 minutos)

---

## 📋 Paso 2: Iniciar Sesión en Vercel

**Desde tu carpeta del proyecto:**

```bash
cd C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project
vercel login
```

**Te pedirá:**
- Email de Vercel
- Te enviará un código por email
- Pega el código

---

## 📋 Paso 3: Desplegar

**Una vez logueado:**

```bash
vercel
```

**Te preguntará:**
1. **"Set up and deploy?"** → Presiona Enter (Sí)
2. **"Which scope?"** → Selecciona tu cuenta
3. **"Link to existing project?"** → Presiona N (No, crear nuevo)
4. **"What's your project's name?"** → Presiona Enter (usa el nombre por defecto)
5. **"In which directory is your code located?"** → Presiona Enter (usa `./`)
6. **"Want to override the settings?"** → Presiona N (No)

**Espera 2-3 minutos** mientras se despliega.

---

## 📋 Paso 4: Agregar Variables de Entorno

**Después del primer deploy:**

```bash
vercel env add VITE_SUPABASE_URL
```

**Pega tu URL de Supabase** → Presiona Enter

```bash
vercel env add VITE_SUPABASE_ANON_KEY
```

**Pega tu clave de Supabase** → Presiona Enter

---

## 📋 Paso 5: Redesplegar

**Para aplicar las variables de entorno:**

```bash
vercel --prod
```

**O desde Vercel web:**
- Ve a tu proyecto
- "Settings" → "Environment Variables"
- Agrega las variables manualmente
- "Deployments" → Haz clic en los 3 puntos → "Redeploy"

---

## ✅ Ventajas de Este Método

- ✅ No necesitas conectar GitHub
- ✅ Despliegue directo desde tu PC
- ✅ Funciona igual que con GitHub
- ✅ Puedes actualizar cuando quieras con `vercel --prod`

---

## 🔄 Actualizar Después

**Cada vez que hagas cambios:**

```bash
cd C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project
vercel --prod
```

**O desde Vercel web:**
- Sube los archivos manualmente
- O conecta GitHub después (cuando funcione)

---

## 🎯 Resumen Rápido

1. `npm install -g vercel`
2. `vercel login`
3. `vercel`
4. Agregar variables de entorno
5. `vercel --prod`

**¿Quieres que te guíe paso a paso mientras lo haces?** 🚀


