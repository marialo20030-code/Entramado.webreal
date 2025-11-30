# 🔗 Conectar Proyecto Local con Repositorio Existente en GitHub

## ✅ El Problema

GitHub Desktop dice que ya existe un repositorio con ese nombre en tu cuenta de GitHub. Esto significa que ya tienes un repositorio llamado `entramado.webreal` (o similar) en GitHub.

**Solución:** Conectar tu proyecto local con ese repositorio existente.

---

## 🎯 Pasos para Conectar

### Opción 1: Clonar el Repositorio Existente (Recomendado)

**Si el repositorio en GitHub ya tiene archivos y quieres sincronizarlos:**

1. **En GitHub Desktop:**
   - Haz clic en **"File"** → **"Clone repository"**
   - Ve a la pestaña **"GitHub.com"**
   - Busca tu repositorio `entramado.webreal`
   - Selecciónalo y haz clic en **"Clone"**
   - Elige una carpeta diferente (ejemplo: `C:\Users\maria\Desktop\entramado-webreal-github`)

2. **Luego copia tus archivos locales:**
   - Copia todos los archivos de tu proyecto actual
   - Pégalos en la carpeta que acabas de clonar
   - Vuelve a GitHub Desktop y verás los cambios
   - Haz commit y push

---

### Opción 2: Cambiar el Remote del Proyecto Local (Más Rápido)

**Si quieres usar tu proyecto local actual y conectarlo al repositorio existente:**

1. **En GitHub Desktop:**
   - Con tu proyecto abierto, ve a **"Repository"** → **"Repository settings"**
   - O haz clic derecho en el nombre del repositorio → **"Repository settings"**

2. **Ve a la pestaña "Remote":**
   - Verás el campo **"Primary remote repository"**
   - Haz clic en **"Change remote URL"** o edita la URL

3. **Pega la URL de tu repositorio existente:**
   - Ve a [github.com](https://github.com)
   - Abre tu repositorio `entramado.webreal`
   - Haz clic en el botón verde **"Code"**
   - Copia la URL (ejemplo: `https://github.com/tu-usuario/entramado.webreal.git`)
   - Pégala en GitHub Desktop

4. **Haz clic en "Save"**

5. **Ahora haz pull primero:**
   - Haz clic en **"Repository"** → **"Pull"** (para traer los archivos que ya están en GitHub)

6. **Luego haz push:**
   - Verás tus archivos locales listos para subir
   - Escribe un mensaje de commit
   - Haz clic en **"Commit to main"**
   - Haz clic en **"Push origin"**

---

### Opción 3: Cambiar el Nombre del Repositorio Local

**Si prefieres crear un repositorio nuevo con otro nombre:**

1. **En GitHub Desktop:**
   - Ve a **"Repository"** → **"Repository settings"**
   - Cambia el nombre del repositorio local a algo diferente
   - Por ejemplo: `entramado-web-local` o `entramado-nuevo`

2. **Luego haz clic en "Publish repository"**
   - Esto creará un nuevo repositorio en GitHub con el nuevo nombre

---

## 🎯 Método Recomendado: Opción 2

**La Opción 2 es la más rápida si quieres mantener tu proyecto local actual:**

1. ✅ Abre GitHub Desktop con tu proyecto
2. ✅ Repository → Repository settings → Remote
3. ✅ Cambia la URL a: `https://github.com/tu-usuario/entramado.webreal.git`
4. ✅ Save
5. ✅ Repository → Pull (para sincronizar)
6. ✅ Haz commit de tus cambios locales
7. ✅ Push origin

---

## 📋 Checklist

- [ ] Abrí GitHub Desktop con mi proyecto local
- [ ] Fui a Repository → Repository settings → Remote
- [ ] Cambié la URL al repositorio existente en GitHub
- [ ] Hice Pull para sincronizar
- [ ] Hice commit de mis cambios
- [ ] Hice Push para subir los cambios

---

## 🆘 Si Tienes Problemas

**Error: "Remote URL is not valid"**
- Verifica que la URL sea correcta
- Debe terminar en `.git`
- Ejemplo: `https://github.com/tu-usuario/entramado.webreal.git`

**Error: "Authentication failed"**
- Ve a File → Options → Accounts
- Verifica que estés conectado con la cuenta correcta de GitHub

**Conflicto de archivos:**
- Si hay archivos diferentes en GitHub y local, GitHub Desktop te mostrará los conflictos
- Puedes elegir qué versión mantener

---

**¿Qué opción prefieres usar?** 🔍


