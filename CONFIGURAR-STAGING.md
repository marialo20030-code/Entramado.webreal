# 🌿 Configurar Staging - Paso a Paso

## 🎯 Objetivo

Crear una rama `staging` donde trabajar sin afectar `main`, y luego hacer merge de todos los cambios juntos.

---

## 📋 Paso 1: Instalar Git o GitHub Desktop

**Elige una opción:**

### Opción A: GitHub Desktop (Recomendado) ⭐
- Descarga: [desktop.github.com](https://desktop.github.com)
- Instálalo
- Inicia sesión con tu cuenta de GitHub

### Opción B: Git
- Descarga: [git-scm.com](https://git-scm.com)
- Instálalo (acepta opciones por defecto)

---

## 📋 Paso 2: Conectar con tu Repositorio

### Con GitHub Desktop:

1. **Abre GitHub Desktop**
2. **File → Clone Repository**
3. **Busca tu repositorio** (`inspiracion-web` o el nombre que le diste)
4. **Selecciona la carpeta local:**
   - `C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project`
5. **Clone**

### Con Git (Terminal):

Una vez que tengas Git instalado, yo ejecutaré estos comandos:
```bash
cd "C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project"
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git pull origin main
```

---

## 📋 Paso 3: Crear Rama Staging

**Una vez conectado, yo crearé la rama staging automáticamente:**

```bash
git checkout -b staging
git push -u origin staging
```

---

## 🔄 Flujo de Trabajo

### Trabajo Diario (En Staging):

1. **Cambias a staging:**
   ```bash
   git checkout staging
   ```

2. **Haces tus cambios** (código, nuevas funciones, etc.)

3. **Haces commit:**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin staging
   ```

4. **Vercel puede desplegar desde staging** (para probar)

### Cuando Estés Listo (Merge a Main):

1. **Cambias a main:**
   ```bash
   git checkout main
   ```

2. **Haces merge de staging:**
   ```bash
   git merge staging
   git push origin main
   ```

3. **Vercel despliega la versión final** ✅

---

## ⚙️ Configurar Vercel para Staging

**Para que Vercel despliegue también desde staging:**

1. **Ve a Vercel → Tu proyecto → Settings → Git**
2. **Production Branch:** `main` (ya está)
3. **Preview Branches:** Agrega `staging`
4. **O simplemente deja que Vercel detecte todas las ramas**

**Así tendrás:**
- **Production:** `tu-proyecto.vercel.app` (desde main)
- **Preview:** `staging-tu-proyecto.vercel.app` (desde staging)

---

## ✅ Ventajas de Staging

- ✅ **Pruebas antes de publicar** → Puedes probar en staging
- ✅ **Acumulas cambios** → Varios cambios juntos antes de publicar
- ✅ **No afecta producción** → Main sigue estable
- ✅ **Fácil de revertir** → Si algo sale mal, no afecta main

---

## 📝 Comandos que Usaré

**Una vez que tengas Git instalado y conectado:**

1. **Crear staging:**
   ```bash
   git checkout -b staging
   git push -u origin staging
   ```

2. **Trabajar en staging:**
   ```bash
   git checkout staging
   git add .
   git commit -m "Mensaje"
   git push origin staging
   ```

3. **Merge a main (cuando estés listo):**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```

---

## 🎯 Plan de Acción

1. **Instala Git o GitHub Desktop**
2. **Conecta con tu repositorio de GitHub**
3. **Dime que está listo**
4. **Yo crearé la rama staging**
5. **Empezamos a trabajar en staging** ✅

---

**¿Ya tienes Git o GitHub Desktop instalado? Si sí, puedo empezar a configurar staging ahora mismo.** 🚀

