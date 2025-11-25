# 📦 Lista de Archivos para Subir a GitHub

## ✅ Archivos y Carpetas que DEBES Subir

### Carpetas Completas:
- ✅ `src/` (TODA la carpeta con todos sus archivos)
  - `src/components/` (todos los componentes)
  - `src/contexts/` (todos los contextos)
  - `src/lib/` (todas las librerías)
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/index.css`
  - `src/vite-env.d.ts`

- ✅ `supabase/` (TODA la carpeta)
  - `supabase/migrations/` (todos los archivos .sql)

### Archivos en la Raíz:
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `vite.config.ts`
- ✅ `vercel.json`
- ✅ `index.html`
- ✅ `tailwind.config.js`
- ✅ `postcss.config.js`
- ✅ `tsconfig.json`
- ✅ `tsconfig.app.json`
- ✅ `tsconfig.node.json`
- ✅ `eslint.config.js`
- ✅ `.gitignore`

---

## ❌ Archivos que NO Debes Subir

- ❌ `node_modules/` (muy pesada, Vercel la instala automáticamente)
- ❌ `.env` o `.env.local` (archivos con secretos)
- ❌ `dist/` (se genera automáticamente)
- ❌ Archivos `.bat` (solo para desarrollo local)

---

## 🎯 Método Rápido

**La forma más fácil:**

1. **Selecciona TODA la carpeta `project`**
2. **EXCEPTO `node_modules`** (si la ves, no la selecciones)
3. **Arrastra todo a GitHub**

**GitHub ignorará automáticamente `node_modules` si el `.gitignore` está bien configurado.**

---

## 📋 Verificación Después de Subir

**En GitHub deberías ver:**

- ✅ Carpeta `src/` con todos los archivos
- ✅ Carpeta `supabase/` con migrations
- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `vercel.json`
- ✅ Todos los archivos de configuración

**Si ves todo esto** → ✅ Está bien subido

---

**Sigue esta lista y tendrás todo listo para conectar con Vercel.** 📦

