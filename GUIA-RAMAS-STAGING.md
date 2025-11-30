# 🌿 Guía: Trabajar con la Rama Staging

## 📋 Paso 1: Crear la Rama Staging

### Desde GitHub Desktop:

1. **Abre GitHub Desktop**
2. **En la parte superior**, verás "Current branch: main" con una flecha
3. **Haz clic en "Current branch: main"**
4. **Haz clic en "New branch"** (o "Nueva rama")
5. **Nombre de la rama:** Escribe `staging`
6. **Asegúrate de que dice:** "Create branch from: main"
7. **Haz clic en "Create branch"**

✅ **¡Listo!** Ahora estás en la rama `staging`

---

## 🔄 Paso 2: Trabajar en Staging

### Flujo Normal de Trabajo:

1. **Asegúrate de estar en staging:**
   - Arriba debe decir **"Current branch: staging"**

2. **Haz tus cambios** en tu editor (Cursor, VS Code, etc.)

3. **En GitHub Desktop:**
   - Verás los archivos modificados en **"Changes"**
   - Escribe un mensaje de commit
   - Haz clic en **"Commit to staging"** (no dice "main", dice "staging")

4. **Haz Push:**
   - Haz clic en **"Push origin"**
   - Los cambios se suben a la rama `staging` en GitHub

---

## 🚀 Paso 3: Cuando Estés Listo, Pasar a Main

### Opción A: Desde GitHub Desktop (Recomendado)

1. **Asegúrate de que todos tus cambios están commiteados y pusheados en staging**

2. **Cambia a la rama main:**
   - Haz clic en **"Current branch: staging"**
   - Selecciona **"main"**

3. **Haz clic en "Merge staging into main":**
   - GitHub Desktop te mostrará un botón para hacer merge
   - O ve a **"Branch"** → **"Merge into current branch"** → Selecciona **"staging"**

4. **Haz Push:**
   - Haz clic en **"Push origin"**
   - Los cambios de staging ahora están en main

5. **Vuelve a staging:**
   - Cambia de vuelta a **"staging"** para seguir trabajando

---

### Opción B: Desde la Web de GitHub (Pull Request)

1. **Ve a tu repositorio en GitHub.com**

2. **Verás un banner** que dice "staging had recent pushes" con un botón **"Compare & pull request"**

3. **Haz clic en "Compare & pull request"**

4. **Revisa los cambios** y escribe un título/descripción

5. **Haz clic en "Create pull request"**

6. **Haz clic en "Merge pull request"** → **"Confirm merge"**

7. **En GitHub Desktop:**
   - Cambia a **"main"**
   - Haz clic en **"Fetch origin"** y luego **"Pull origin"**

---

## 📊 Resumen del Flujo

```
main (producción)
  ↑
  | (merge cuando estés listo)
  |
staging (desarrollo)
  ↑
  | (commits y pushes)
  |
Tus cambios locales
```

---

## ✅ Checklist Diario

- [ ] Estoy en la rama `staging` (verificar arriba en GitHub Desktop)
- [ ] Hice mis cambios
- [ ] Hice commit en `staging`
- [ ] Hice push a `staging`
- [ ] Cuando esté listo → merge a `main`

---

## 🆘 Comandos Útiles

**Ver en qué rama estás:**
- GitHub Desktop: Mira arriba donde dice "Current branch"

**Cambiar de rama:**
- GitHub Desktop: Clic en "Current branch" → Selecciona la rama

**Ver diferencias entre ramas:**
- GitHub Desktop: "Branch" → "Compare on GitHub"

---

## 🎯 Ventajas de Trabajar con Staging

✅ **Main siempre estable:** Solo contiene código probado
✅ **Puedes experimentar:** En staging sin afectar main
✅ **Revisión fácil:** Puedes ver todos los cambios antes de mergear
✅ **Rollback fácil:** Si algo sale mal, main sigue intacto

---

**¡Ahora puedes empezar a trabajar en staging!** 🚀

