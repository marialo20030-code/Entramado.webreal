# 🚀 Desplegar en Vercel - Guía Rápida

## Opción más fácil (sin Git):

1. **Instala Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Desde la carpeta `project`, ejecuta**:
   ```bash
   vercel login
   vercel
   ```

3. **Agrega las variables de entorno** en [vercel.com](https://vercel.com):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Redeploya** desde el dashboard de Vercel

¡Listo! Tu web estará en internet con una URL como `tu-proyecto.vercel.app`

---

## Archivos importantes:

- ✅ `vercel.json` - Configuración de Vercel (ya creado)
- ✅ `.gitignore` - Ignora archivos sensibles (ya configurado)
- ✅ Variables de entorno - Necesitas agregarlas en Vercel

**Lee `DEPLOY-VERCEL.md` para instrucciones detalladas.**




