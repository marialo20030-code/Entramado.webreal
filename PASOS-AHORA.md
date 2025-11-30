# 🚀 Pasos para Ver Cambios y Subirlos a GitHub

## 📋 Paso 1: Ver los Cambios en Local

### Opción A: Si ya tienes el servidor corriendo

1. **Abre tu navegador**
2. **Ve a:** `http://localhost:5173` (o la URL que te aparezca en la terminal)
3. **Refresca la página** (F5 o Ctrl+R)
4. **¡Listo!** Deberías ver:
   - ✅ Nombre cambiado a "Entramado"
   - ✅ Navbar mejorado
   - ✅ Botón de retroceso en el buscador
   - ✅ Texto de publicaciones clickeable
   - ✅ Spotify más grande (cuando abras una publicación con Spotify)

---

### Opción B: Si NO tienes el servidor corriendo

1. **Abre una terminal** (PowerShell o CMD)
2. **Ve a la carpeta del proyecto:**
   ```bash
   cd "C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project"
   ```
3. **Inicia el servidor:**
   ```bash
   npm run dev
   ```
4. **Espera a que aparezca** algo como:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
5. **Abre tu navegador** y ve a esa URL
6. **¡Listo!** Verás todos los cambios

---

## 📋 Paso 2: Subir los Cambios a GitHub (Rama Staging)

### Desde GitHub Desktop:

1. **Abre GitHub Desktop**

2. **Verifica que estás en la rama `staging`:**
   - Arriba debe decir **"Current branch: staging"**
   - Si dice "main", haz clic y cambia a "staging"

3. **Verás tus cambios:**
   - En la pestaña **"Changes"** verás todos los archivos modificados:
     - `index.html`
     - `src/App.tsx`
     - `src/components/PinterestGrid.tsx`
     - `src/components/PostDetailModal.tsx`
     - `src/components/SearchBar.tsx`

4. **Haz Commit:**
   - Abajo, en **"Summary"**, escribe un mensaje, por ejemplo:
     ```
     Mejorar UI: cambiar nombre a Entramado, mejorar navbar y formato Spotify
     ```
   - Opcional: Agrega una descripción en **"Description"**
   - Haz clic en **"Commit to staging"** (botón azul abajo)

5. **Haz Push:**
   - Arriba, haz clic en **"Push origin"** (o "Push 1 commit to origin")
   - Espera a que termine (verás un mensaje de confirmación)

6. **¡Listo!** Tus cambios están en GitHub en la rama `staging`

---

## 📋 Paso 3: Verificar que se Subió Correctamente

1. **Ve a GitHub en tu navegador:**
   - URL: `https://github.com/marialo20030-code/Entramado.webreal`

2. **Verifica la rama:**
   - Arriba, haz clic en el selector de ramas
   - Selecciona **"staging"**
   - Deberías ver tus archivos modificados

3. **Ver el commit:**
   - Haz clic en el número de commits (arriba)
   - Verás tu último commit con el mensaje que escribiste

---

## 🎯 Resumen Rápido

### Ver en Local:
1. ✅ Abre terminal → `cd project` → `npm run dev`
2. ✅ Abre navegador → `http://localhost:5173`
3. ✅ Refresca la página

### Subir a GitHub:
1. ✅ Abre GitHub Desktop
2. ✅ Verifica que estás en `staging`
3. ✅ Escribe mensaje de commit
4. ✅ Haz clic en "Commit to staging"
5. ✅ Haz clic en "Push origin"

---

## 🆘 Si Tienes Problemas

**No veo los cambios en el navegador:**
- Asegúrate de refrescar la página (F5)
- Verifica que el servidor está corriendo
- Cierra y vuelve a abrir el navegador

**No veo cambios en GitHub Desktop:**
- Asegúrate de haber guardado los archivos en tu editor
- Refresca GitHub Desktop (ciérralo y ábrelo de nuevo)

**Error al hacer push:**
- Verifica tu conexión a internet
- Asegúrate de estar autenticado en GitHub Desktop

---

**¡Ya está todo listo! Sigue estos pasos y verás tus cambios funcionando.** 🎉

