# 🔧 Solución: Error de Build en Vercel

## ❌ Error que estás viendo:

```
[vite]: Rollup failed to resolve import "/src/main.tsx" from "/vercel/path0/index.html".
```

**Significa:** Vercel no encuentra los archivos porque el Root Directory está mal configurado.

---

## ✅ SOLUCIÓN: Configurar Root Directory en Vercel

### Opción 1: Si subiste los archivos directamente en la raíz del repositorio

1. **Ve a Vercel:**
   - [vercel.com](https://vercel.com)
   - Entra a tu proyecto

2. **Ve a Settings:**
   - Clic en **"Settings"** (arriba)
   - Busca **"General"** en el menú lateral

3. **Root Directory:**
   - Busca la sección **"Root Directory"**
   - Debería decir `./` o estar vacío
   - Si dice otra cosa (como `./project`), cámbialo a `./`
   - O déjalo vacío si tus archivos están en la raíz

4. **Guarda:**
   - Haz clic en **"Save"** si hay un botón

5. **Redeploy:**
   - Ve a **"Deployments"**
   - Haz clic en los 3 puntos (⋯) del último deploy
   - Clic en **"Redeploy"**

---

### Opción 2: Si los archivos están en una subcarpeta `project/`

1. **Ve a Vercel → Settings → General**

2. **Root Directory:**
   - Cambia a: `./project`
   - (Si tus archivos están dentro de una carpeta `project/`)

3. **Save y Redeploy**

---

### Opción 3: Verificar cómo están en GitHub

**Verifica en GitHub:**

1. Ve a tu repositorio en GitHub
2. Mira la estructura de archivos

**¿Qué ves en la raíz?**
- ✅ Si ves `package.json`, `index.html`, `src/` directamente → Root Directory debe ser `./`
- ✅ Si ves una carpeta `project/` y dentro están los archivos → Root Directory debe ser `./project`

---

## 🔍 Cómo Verificar la Estructura Correcta

**Tu repositorio de GitHub debería verse así (si está en la raíz):**

```
repositorio/
├── package.json
├── index.html
├── vite.config.ts
├── vercel.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── ...
└── ...
```

**Si ves esto** → Root Directory debe ser `./`

**Si tus archivos están así:**

```
repositorio/
└── project/
    ├── package.json
    ├── index.html
    ├── src/
    └── ...
```

**Entonces** → Root Directory debe ser `./project`

---

## 📋 Checklist de Verificación:

- [ ] Verifiqué cómo están organizados los archivos en GitHub
- [ ] Configuré el Root Directory correcto en Vercel
- [ ] Guardé los cambios
- [ ] Hice Redeploy
- [ ] El build ahora funciona ✅

---

## 🆘 Si aún no funciona:

### Verificar archivos en GitHub:

1. Ve a tu repositorio en GitHub
2. Verifica que `index.html` esté ahí
3. Verifica que la carpeta `src/` esté ahí
4. Haz clic en `src/main.tsx` - ¿Puedes ver su contenido?
   - Si SÍ ✅ → El problema es solo la configuración de Vercel
   - Si NO ❌ → Los archivos no se subieron bien

### Solución alternativa:

Si el problema persiste, puedes crear un archivo `vercel.json` con la configuración explícita del root directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rootDirectory": "./",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

**Sigue estos pasos y el error debería resolverse.** ✅

