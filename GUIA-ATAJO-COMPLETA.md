# ⌨️ Crear Atajo para Abrir Navegador en Cursor

## Método 1: Desde la Interfaz (MÁS FÁCIL) ⭐

### Paso 1: Abrir Keyboard Shortcuts
- Presiona: **`Ctrl+K Ctrl+S`** (presiona Ctrl+K, suelta, luego Ctrl+S)
- O ve a: **File → Preferences → Keyboard Shortcuts**

### Paso 2: Buscar el Comando
En la barra de búsqueda (arriba del todo), escribe:
```
simpleBrowser
```

Deberías ver aparecer:
- **Simple Browser: Show** (bajo la categoría "View" o "Editor")

### Paso 3: Asignar el Atajo
1. Haz **DOBLE CLIC** en la línea "Simple Browser: Show"
2. O haz clic derecho y selecciona **"Change Keybinding"**

### Paso 4: Presionar las Teclas
Cuando aparezca el campo para el atajo, presiona las teclas que quieres usar:
- Recomendado: **`Ctrl+Alt+B`** (presiona las 3 teclas juntas)
- O elige otro: `Ctrl+Alt+V`, `Ctrl+Alt+N`, etc.

### Paso 5: Confirmar
- Presiona **Enter** para confirmar
- Si aparece un aviso de conflicto, elige otro atajo

### Paso 6: ¡Probar!
1. Presiona tu nuevo atajo (`Ctrl+Alt+B` o el que elegiste)
2. Debería abrirse Simple Browser
3. Escribe: `http://localhost:5173`
4. Presiona Enter

---

## Método 2: Si No Aparece "simpleBrowser"

### Buscar de Otra Forma:
1. En la barra de búsqueda escribe: `browser`
2. Busca algo como:
   - "Simple Browser"
   - "Open Simple Browser"
   - "View: Show Simple Browser"

### O Buscar por Categoría:
1. En la lista de la izquierda, busca **"View"**
2. Expande esa categoría
3. Busca "Simple Browser: Show"

---

## Método 3: Atajos Alternativos si Hay Conflicto

Si `Ctrl+Alt+B` ya está en uso, prueba estos:
- `Ctrl+Alt+V` (View)
- `Ctrl+Alt+N` (Navigator)
- `Ctrl+Shift+B` (Build - pero puede estar ocupado)
- `F12` (si no está en uso)
- `Ctrl+K B` (si no está en uso)

---

## Método 4: Crear un Comando Personalizado

Si quieres que se abra directamente con la URL, puedes crear una tarea:

1. Presiona `Ctrl+Shift+P`
2. Escribe: `Tasks: Configure Task`
3. Selecciona: "Create tasks.json file from template"
4. Usa este contenido:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Abrir Navegador Local",
      "type": "shell",
      "command": "start http://localhost:5173",
      "problemMatcher": [],
      "presentation": {
        "reveal": "never"
      }
    }
  ]
}
```

Luego puedes asignar un atajo a esta tarea:
- `Ctrl+Shift+P` → `Tasks: Run Task` → "Abrir Navegador Local"

---

## 📝 Notas

- El atajo funciona en cualquier momento (mientras el servidor esté corriendo)
- Si no funciona, verifica que el servidor esté corriendo en `http://localhost:5173`
- Puedes cambiar el atajo en cualquier momento volviendo a Keyboard Shortcuts

---

## ❓ Problemas Comunes

### "El atajo no hace nada"
- Verifica que el servidor esté corriendo
- Prueba el atajo después de que Simple Browser se haya abierto al menos una vez manualmente

### "Conflicto de atajo"
- Elige otro atajo que no esté en uso
- VS Code te mostrará qué comando está usando ese atajo

### "No encuentro simpleBrowser"
- Busca solo "browser" en lugar de "simpleBrowser"
- O busca en la categoría "View" manualmente

---

**Recomendación:** Usa el **Método 1** con `Ctrl+Alt+B` - es el más simple y funciona bien.














