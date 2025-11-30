# 🚀 Inicio Rápido del Proyecto

## Opción 1: Script Automático (Recomendado)

1. **Abre el Explorador de archivos** y navega a la carpeta `project`
2. **Haz doble clic** en `start-dev.bat`
3. Espera a que se abra una ventana y vea el mensaje: `Local: http://localhost:5173`
4. **Abre tu navegador** en: `http://localhost:5173`

---

## Opción 2: Terminal CMD (Si el script no funciona)

1. **Abre CMD** (no PowerShell)
   - Presiona `Win + R`
   - Escribe `cmd` y presiona Enter

2. **Navega al proyecto:**
   ```cmd
   cd C:\Users\maria\Desktop\todavianosecomosellama\project-bolt-sb1-fqlqsuxu\project
   ```

3. **Inicia el servidor:**
   ```cmd
   npm run dev
   ```

4. **Abre tu navegador** en: `http://localhost:5173`

---

## Opción 3: Verificar Configuración

Si nada funciona, ejecuta `check-setup.bat` para verificar que todo esté correcto.

---

## ⚠️ Problemas Comunes

### "ERR_CONNECTION_REFUSED"
- El servidor no está corriendo
- Ejecuta `start-dev.bat` o `npm run dev` en CMD

### Errores de PowerShell con "→"
- PowerShell tiene problemas con caracteres especiales
- **Solución:** Usa CMD en lugar de PowerShell

### "Puerto 5173 en uso"
- Otro proceso está usando el puerto
- Cierra otras terminales o reinicia tu computadora

---

## 📝 Notas

- El servidor debe mostrar: `VITE v5.4.8 ready in XXX ms`
- Si ves errores en rojo, cópialos y compártelos
- El navegador debe abrirse automáticamente, si no, ve manualmente a `http://localhost:5173`



