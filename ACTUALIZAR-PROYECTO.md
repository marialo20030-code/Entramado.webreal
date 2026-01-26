# 📋 Instrucciones para Actualizar el Proyecto

## Pasos Rápidos

### 1️⃣ Actualizar el código desde GitHub
```bash
git pull origin main
```

### 2️⃣ Crear archivo .env (si no lo tienes)
Copia el archivo de ejemplo y edítalo con las credenciales:

**En Windows:**
```bash
copy .env.example .env
```

**En Mac/Linux:**
```bash
cp .env.example .env
```

Luego abre el archivo `.env` y reemplaza los valores con estas credenciales:

```
VITE_SUPABASE_URL=https://upfnzshpcwabetytryro.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwZm56c2hwY3dhYmV0eXRyeXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0OTQ3OTcsImV4cCI6MjA4MzA3MDc5N30.OH1MhcupV_IPUCPasX5yEhWCzyswPm1insCP2JfNpsU
```

### 3️⃣ Instalar/Actualizar dependencias
```bash
npm install
```

### 4️⃣ Iniciar el servidor
```bash
npm run dev
```

O si prefieres usar el script:
```bash
npm start
```

---

## ✅ Verificación Rápida

Después de seguir los pasos, deberías ver:
- ✅ El servidor corriendo en `http://localhost:5173`
- ✅ Sin errores en la consola
- ✅ La conexión a Supabase funcionando

---

## 🔍 Si algo no funciona

1. **Error de conexión a Supabase**: Verifica que el archivo `.env` tenga las credenciales correctas
2. **Error de dependencias**: Ejecuta `npm install` de nuevo
3. **Puerto ocupado**: Cierra otras instancias del servidor o cambia el puerto

---

## 📝 Notas

- El archivo `.env` NO se sube a GitHub (está protegido)
- Cada vez que hagas `git pull`, verifica si hay cambios en `.env.example`
- Si el proyecto ya funcionaba antes, solo necesitas hacer `git pull` y listo
