# 🌐 Ver el Servidor Local Dentro de Cursor

## Método 1: Simple Browser (Más Fácil y Rápido) ⭐

Cursor tiene un navegador integrado llamado "Simple Browser" que se abre dentro del editor. **Esta es la mejor opción.**

### Pasos Rápidos:

1. **Asegúrate de que el servidor esté corriendo:**
   - Haz doble clic en `INICIAR-RAPIDO.bat`
   - O ejecuta `npm run dev` en la terminal de Cursor
   - Espera a ver: `Local: http://localhost:5173`

2. **Abre Simple Browser en Cursor:**
   - Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
   - Escribe: `Simple Browser: Show`
   - Presiona Enter
   - Cuando aparezca el campo de URL, escribe: `http://localhost:5173`
   - Presiona Enter

3. **¡Listo!** Ahora verás tu aplicación dentro de Cursor sin cambiar de ventana.

### Atajos Útiles en Simple Browser:

- **Ctrl+L** → Ir a una nueva URL (para cambiar a otra página)
- **Ctrl+R** → Refrescar la página
- **Ctrl+W** → Cerrar el panel del navegador
- **F5** → Refrescar
- **Esc** → Cerrar

### Tip Pro: Dividir la Pantalla

Puedes tener código y navegador visibles al mismo tiempo:

1. Abre Simple Browser (paso 2 arriba)
2. Haz clic derecho en la pestaña del navegador
3. Selecciona "Move Panel Right" o "Move Panel Down"
4. Ahora verás código y navegador lado a lado ✨

---

## Método 2: Desde la Terminal Integrada

1. **Abre la terminal en Cursor:**
   - Presiona `` Ctrl+` `` (Ctrl + acento grave)
   - O ve a: Terminal → New Terminal

2. **Navega al proyecto:**
   ```bash
   cd project-bolt-sb1-fqlqsuxu/project
   ```

3. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

4. **Abre Simple Browser** (Método 1, paso 2)

---

## Método 3: Crear un Atajo Personalizado (Recomendado para uso frecuente)

Para que sea aún más rápido, puedes asignar un atajo de teclado:

1. **Presiona:** `Ctrl+K Ctrl+S` (abre Keyboard Shortcuts)
2. **Busca:** `simpleBrowser.show`
3. **Haz doble clic** en el comando "Simple Browser: Show"
4. **Presiona la tecla** que quieres usar como atajo (por ejemplo: `Ctrl+Alt+B`)
5. **Presiona Enter** para confirmar

Ahora cada vez que presiones `Ctrl+Alt+B` (o el atajo que elegiste), se abrirá Simple Browser directamente.

### Atajo Alternativo Rápido:

También puedes:
- Presionar `Ctrl+Shift+P`
- Escribir: `>Simple Browser`
- Presionar Enter
- Escribir: `http://localhost:5173`

---

## Método 4: Usar la Tarea de VS Code

1. **Presiona:** `Ctrl+Shift+P`
2. **Escribe:** `Tasks: Run Task`
3. **Selecciona:** "Iniciar Servidor y Abrir Navegador Integrado"

---

## 💡 Tips

- **Simple Browser se mantiene abierto** mientras trabajas
- Puedes dividir la pantalla para ver código y navegador juntos
- Usa `Ctrl+\` para crear un panel lateral y poner el navegador ahí
- El navegador se actualiza automáticamente cuando guardas cambios (HMR)

---

## 🔧 Si No Aparece Simple Browser

1. **Asegúrate de tener la última versión de Cursor**
2. **Reinicia Cursor** después de instalar actualizaciones
3. **Verifica que el servidor esté corriendo** en `http://localhost:5173`

---

**Recomendación:** Usa el **Método 1** (Simple Browser) - es el más rápido y conveniente.

