# PROMPT PARA CHATGPT - Sistema de Creación de Publicaciones

## CONTEXTO GENERAL

Soy desarrollador de una aplicación web llamada "Entramado" - una plataforma colaborativa de contenido similar a Pinterest pero enfocada en ideas, textos y creación intelectual. La aplicación está construida con:

- **Frontend**: React 18.3.1 + TypeScript + Vite
- **Estilos**: Tailwind CSS 3.4.1
- **Iconos**: Lucide React 0.344.0
- **Backend**: Supabase (autenticación, base de datos, almacenamiento)
- **Routing**: React Router DOM 7.9.6

## COMPONENTE PRINCIPAL: UploadModal

### Ubicación
`src/components/UploadModal.tsx`

### Propósito
Modal de pantalla completa que permite crear y editar publicaciones. Es la interfaz principal de creación de contenido de la aplicación.

### Props del Componente

```typescript
interface UploadModalProps {
  isOpen: boolean;           // Controla si el modal está visible
  onClose: () => void;       // Función para cerrar el modal
  folders: Folder[];         // Lista de carpetas disponibles para organizar
  onSuccess: () => void;     // Callback cuando se publica/guarda exitosamente
  postToEdit?: any;          // Objeto opcional con datos del post a editar
  onFoldersUpdate?: () => void; // Callback para actualizar lista de carpetas
}
```

### Estados Principales

#### Contenido
- `title`: string - Título de la publicación (input de texto simple)
- `description`: string - Contenido principal en HTML (manejado por RichTextEditor)
- `folderId`: string - ID de la carpeta donde se guardará
- `isPrivate`: boolean - Si la publicación es privada o pública

#### Multimedia
- `mediaType`: 'image' | 'spotify' | 'youtube' - Tipo de media principal
- `mediaUrl`: string - URL del media (para Spotify/YouTube)
- `imageFiles`: File[] - Archivos de imagen seleccionados
- `imagePreviews`: string[] - URLs de preview de imágenes (base64 o URLs)
- `customThumbnail`: string - Imagen personalizada para Spotify/YouTube

#### Referencias
- `referencedPosts`: any[] - Array de posts referenciados en esta publicación
- `availablePosts`: any[] - Posts disponibles para referenciar
- `postSearchQuery`: string - Búsqueda de posts para referenciar

#### UI/UX
- `loading`: boolean - Estado de carga durante publicación
- `error`: string - Mensajes de error
- `saveStatus`: 'saved' | 'saving' | 'unsaved' - Estado del guardado automático
- `isFocusMode`: boolean - Modo de enfoque (oculta sidebar)
- `sidebarCollapsed`: boolean - Sidebar colapsado o visible
- `collapsedSections`: { media: boolean, references: boolean } - Secciones colapsables
- `showShortcuts`: boolean - Mostrar modal de atajos de teclado
- `toasts`: Array - Notificaciones toast

#### Carpetas
- `showCreateFolder`: boolean - Mostrar formulario de crear carpeta
- `newFolderName`: string - Nombre de nueva carpeta
- `newFolderColor`: string - Color de nueva carpeta
- `creatingFolder`: boolean - Estado de creación de carpeta

### Funcionalidades Clave

#### 1. AUTO-GUARDADO AUTOMÁTICO
- **LocalStorage**: Se guarda automáticamente cada 2 segundos en `localStorage` con clave `'draft_post_autosave'`
- **Datos guardados**: title, description, folderId, mediaType, mediaUrl, imagePreviews (base64), customThumbnail, isPrivate, showMediaOptions
- **Restauración**: Al abrir el modal, si hay un borrador guardado (menos de 7 días), se restaura automáticamente
- **Limpieza**: Se limpia después de publicar o guardar borrador exitosamente
- **Indicador visual**: Muestra "Guardando...", "Guardado" (verde) o "Sin guardar" (ámbar) en la barra superior

#### 2. ESTADÍSTICAS EN TIEMPO REAL
La barra superior muestra:
- **Palabras**: Cuenta palabras en título + descripción (excluye HTML)
- **Caracteres**: Cuenta caracteres totales (excluye HTML)
- **Tiempo de lectura**: Calculado a 200 palabras por minuto
- **Imágenes**: Contador de imágenes seleccionadas

#### 3. VALIDACIÓN VISUAL
- **Checklist en sidebar**: 
  - ✓ Título requerido (verde cuando tiene contenido)
  - ✓ Multimedia requerido (verde cuando hay imagen/URL)
  - ✓ Contenido recomendado (verde/ámbar según tiene contenido)
- **Badge de estado**: "Listo para publicar" (verde) o "Falta contenido" (ámbar)
- **Botones deshabilitados**: El botón "Publicar" se deshabilita si faltan campos requeridos

#### 4. MULTIMEDIA

**Tipos soportados:**

A) **Imágenes**:
- Drag & drop de múltiples imágenes
- Selección desde biblioteca
- Preview de todas las imágenes seleccionadas
- Eliminación individual de imágenes
- Límite: 10MB por imagen
- Formatos: cualquier formato de imagen

B) **Spotify**:
- Detección automática de URL de Spotify (track)
- Extracción de ID del track
- Generación automática de thumbnail desde API de Spotify
- Preview del thumbnail
- Opción de imagen personalizada

C) **YouTube**:
- Detección automática de URL de YouTube
- Extracción de ID del video
- Thumbnail automático desde img.youtube.com
- Preview del thumbnail
- Opción de imagen personalizada

#### 5. REFERENCIAS A OTRAS PUBLICACIONES
- Búsqueda de posts existentes
- Lista de 10 posts recientes cuando no hay búsqueda
- Agregar múltiples referencias
- Eliminar referencias seleccionadas
- Las referencias se agregan al final del HTML como lista con enlaces

#### 6. CARPETAS
- Selector de carpeta existente
- Crear nueva carpeta sin salir del modal
- 10 colores predefinidos para carpetas
- La carpeta nueva se selecciona automáticamente

#### 7. ATAJOS DE TECLADO
- **Ctrl/Cmd + S**: Guardar borrador
- **Ctrl/Cmd + Enter**: Publicar inmediatamente
- **Ctrl/Cmd + K**: Toggle modo de enfoque
- **Ctrl/Cmd + B**: Mostrar/ocultar sidebar
- Modal de ayuda con todos los atajos (botón de teclado)

#### 8. MODO DE ENFOQUE
- Oculta el sidebar para escribir sin distracciones
- Botón en barra superior para activar/desactivar
- Sidebar vuelve como overlay cuando se necesita

#### 9. SIDEBAR COLAPSABLE
- Secciones colapsables (Multimedia, Referencias)
- Sidebar completamente colapsable (Ctrl+B)
- Botón flotante cuando está colapsado para volver a mostrar
- Contadores visuales en cada sección (badges)

---

## COMPONENTE: RichTextEditor

### Ubicación
`src/components/RichTextEditor.tsx`

### Propósito
Editor de texto enriquecido estilo Notion con diseño tipo cuaderno (líneas horizontales) que permite crear contenido formateado.

### Props
```typescript
interface RichTextEditorProps {
  value: string;              // HTML del contenido
  onChange: (value: string) => void; // Callback cuando cambia el contenido
  placeholder?: string;       // Placeholder cuando está vacío
  fontFamily?: string;        // Familia de fuente por defecto
  fontSize?: string;          // Tamaño de fuente por defecto (ej: '16px')
  textColor?: string;         // Color de texto por defecto
}
```

### CARACTERÍSTICA ESPECIAL: DISEÑO TIPO CUADERNO

El editor tiene un diseño único tipo cuaderno:

#### Líneas Horizontales
- **Fondo**: `#fefefe` (blanco papel)
- **Líneas**: Gris claro `#d1d5db`
- **Cálculo de líneas**: 
  - `lineHeight = fontSize * 1.8` (ej: 16px * 1.8 = 28.8px)
  - Las líneas se dibujan cada `lineHeight` píxeles
  - Posición: `backgroundPosition: '16px 32px'`
  - Ocupan todo el ancho menos 32px de padding lateral

#### Alineación con Líneas
**CRÍTICO**: Todo el texto debe alinearse perfectamente con las líneas horizontales:
- **Párrafos**: `line-height: 28.8px` (exacto, con `!important`)
- **Listas**: Items con `line-height: 28.8px`
- **Blockquotes**: `line-height: 28.8px`
- **Títulos**: Múltiplos del line-height (h1: 57.6px, h2: 43.2px, h3: 28.8px)
- **Márgenes**: Todos los márgenes son múltiplos del `lineHeight` para mantener alineación

### FUNCIONALIDADES DEL EDITOR

#### 1. FORMATO BÁSICO
- **Negrita** (Ctrl+B): `<strong>` o `<b>`
- **Cursiva** (Ctrl+I): `<em>` o `<i>`
- **Subrayado** (Ctrl+U): `<u>`
- **Tachado**: `<del>` o `<strike>`
- **Superíndice**: `<sup>` (x²)
- **Subíndice**: `<sub>` (x₂)

#### 2. ENCABEZADOS
6 niveles (H1-H6) con menú desplegable:
- H1: 2.5em
- H2: 2em
- H3: 1.5em
- H4: 1.25em
- H5: 1.1em
- H6: 1em

#### 3. COLORES Y RESALTADO

**Colores de texto** (11 opciones):
- Negro, Gris oscuro, Gris, Rojo, Naranja, Amarillo, Verde, Azul, Índigo, Violeta, Rosa

**Resaltado** (7 colores):
- Amarillo, Verde, Azul, Rosa, Naranja, Rojo, Violeta

#### 4. FUENTES
6 opciones de fuentes:
- Inter (Formal) - por defecto
- Roboto
- Georgia
- Merriweather
- Lato
- Playfair Display

#### 5. LISTAS
- **Lista sin orden**: `<ul>` con viñetas
- **Lista ordenada**: `<ol>` con números
- Indentación automática con `execCommand`

#### 6. ALINEACIÓN
- Izquierda, Centro, Derecha, Justificar
- Aumentar/Disminuir sangría (indent/outdent)

#### 7. SEPARADORES
Menú con 5 estilos de separadores:
1. Línea simple (1px sólida)
2. Línea gruesa (3px sólida)
3. Línea punteada (2px dashed)
4. Línea con espacio (centrada, 50% ancho)
5. Ornamento (❦)

#### 8. BLOQUES ESPECIALES (9 tipos)

**Citas y Callouts:**
1. **Cita destacada**: Fondo degradado, borde izquierdo azul, sombra
2. **Callout - Info**: Fondo azul claro, borde azul, icono ℹ️
3. **Callout - Éxito**: Fondo verde claro, borde verde, icono ✓
4. **Callout - Advertencia**: Fondo amarillo claro, borde amarillo, icono ⚠️
5. **Callout - Error**: Fondo rojo claro, borde rojo, icono ❌

**Otros bloques:**
6. **Nota destacada**: Tarjeta con borde y sombra
7. **Caja de código**: Fondo oscuro (#1e293b), fuente monoespaciada
8. **Bloque de definición**: Término + definición con estilos diferenciados
9. **Tarjeta con sombra**: Contenedor destacado con sombra

#### 9. LAYOUTS Y COLUMNAS

**Layouts simétricos:**
- 2 Columnas (50% - 50%)
- 3 Columnas (33.3% - 33.3% - 33.3%)
- 4 Columnas (25% cada una)

**Layouts asimétricos:**
- 2/3 - 1/3 (66.6% - 33.3%)
- 1/3 - 2/3 (33.3% - 66.6%)

Todos usan CSS Grid con gap de 16px.

#### 10. CÓDIGO
- **Bloque de código**: `<pre><code>` con fondo gris oscuro
- **Código inline**: `<code>` con fondo gris claro
- Fuente monoespaciada (Courier New, Consolas)

#### 11. ENLACES
- Insertar enlaces con texto personalizado
- Se abren en nueva pestaña (`target="_blank"`)
- Estilo azul con subrayado

#### 12. TABLAS
- Crear tablas con menú de dimensiones
- Bordes visibles
- Celdas editables
- Padding automático

### FUNCIÓN CRÍTICA: PEGADO INTELIGENTE DESDE CHATGPT

El editor tiene una función especial `handlePaste` que procesa contenido pegado:

#### Procesamiento de HTML
1. Limpia estilos innecesarios de fuentes externas (Word, Google Docs)
2. Preserva elementos importantes: código, blockquotes, listas, enlaces
3. Aplica `line-height` correcto a todos los elementos para alinearse con las líneas del cuaderno

#### Conversión de Markdown
Si se pega texto plano con formato markdown, convierte automáticamente:
- `# ## ###` → H1, H2, H3
- `**texto**` → `<strong>`
- `*texto*` → `<em>`
- `` `código` `` → `<code>`
- ` ``` código ``` ` → `<pre><code>`
- `> texto` → `<blockquote>`
- `- item` → `<ul><li>`
- `1. item` → `<ol><li>`
- `[texto](url)` → `<a>`

#### Aplicación de Line-Height
**IMPORTANTE**: Después de convertir markdown o limpiar HTML:
- Todos los `<p>` reciben `line-height: 28.8px !important`
- Todos los `<li>` reciben `line-height: 28.8px !important`
- Márgenes se ajustan a múltiplos de 28.8px
- Títulos reciben line-height proporcionales

### ESTRUCTURA HTML GENERADA

El editor genera HTML limpio y estructurado:

```html
<p style="margin: 0; padding: 0; line-height: 28.8px;">Texto normal</p>

<h1 style="line-height: 57.6px; margin: 57.6px 0 28.8px 0;">Título</h1>

<ul style="margin: 28.8px 0;">
  <li style="line-height: 28.8px;">Item</li>
</ul>

<blockquote style="line-height: 28.8px; margin: 28.8px 0;">
  <p style="line-height: 28.8px;">Cita</p>
</blockquote>

<pre style="background: #f4f4f4; line-height: 28.8px;">
  <code>código</code>
</pre>
```

---

## FLUJO DE PUBLICACIÓN

### 1. Crear Nueva Publicación
```
Usuario hace clic en "Nueva publicación"
→ Se abre UploadModal con valores vacíos
→ Si hay borrador en localStorage, se restaura automáticamente
→ Usuario escribe título y contenido
→ Auto-guardado cada 2 segundos
→ Usuario selecciona/arrastra imágenes
→ Usuario selecciona carpeta (opcional)
→ Usuario hace clic en "Publicar"
→ Validación: título + multimedia requeridos
→ Subida de imágenes a Supabase Storage
→ Extracción de aspect ratio de primera imagen
→ Inserción en tabla 'posts' de Supabase
→ Limpieza de localStorage
→ Cierre del modal
→ Callback onSuccess() para refrescar feed
```

### 2. Guardar Borrador
```
Usuario hace clic en "Guardar borrador"
→ NO requiere título ni multimedia
→ Si no hay imágenes, usa placeholder SVG
→ Guarda en BD con is_draft = true
→ Limpia localStorage
→ Muestra toast de éxito
```

### 3. Editar Publicación Existente
```
Usuario hace clic en "Editar" en un post
→ UploadModal recibe postToEdit prop
→ Carga todos los datos: título, descripción, imágenes, carpeta, etc.
→ NO restaura borrador de localStorage (solo en creación)
→ Usuario modifica contenido
→ Usuario hace clic en "Guardar"
→ Actualiza registro en BD
→ Limpia localStorage
→ Cierra modal
```

---

## VALIDACIONES Y RESTRICCIONES

### Validaciones Frontend
1. **Título**: Requerido para publicar (no para borradores)
2. **Multimedia**: Requerido para publicar
   - Imágenes: al menos 1 imagen
   - Spotify/YouTube: URL válida detectada
3. **Tamaño de archivo**: Máximo 10MB por imagen
4. **Formatos**: Solo imágenes para tipo 'image'

### Validaciones Backend (Supabase)
- RLS (Row Level Security) activado
- Usuario debe estar autenticado
- Usuario solo puede editar sus propias publicaciones
- Foreign keys: folder_id referencia folders, created_by referencia auth.users

---

## ALMACENAMIENTO Y PERSISTENCIA

### LocalStorage (Borradores)
```javascript
{
  title: string,
  description: string (HTML),
  folderId: string,
  mediaType: 'image' | 'spotify' | 'youtube',
  mediaUrl: string,
  imagePreviews: string[] (base64),
  customThumbnail: string,
  isPrivate: boolean,
  showMediaOptions: boolean,
  timestamp: number (Date.now())
}
```

### Supabase Storage
- **Bucket**: 'posts'
- **Estructura**: `{userId}/{randomId}-{timestamp}.{ext}`
- **Public URLs**: Generadas automáticamente después de subir

### Base de Datos (Tabla 'posts')
```sql
- id: uuid (PK)
- title: text (NOT NULL)
- description: text (HTML con formato)
- image_url: text (NOT NULL, URL de imagen principal)
- images: text[] (Array de URLs, solo si media_type = 'image')
- folder_id: uuid (FK a folders, nullable)
- created_by: uuid (FK a auth.users)
- created_at: timestamptz
- updated_at: timestamptz
- is_private: boolean
- media_type: 'image' | 'spotify' | 'youtube'
- media_url: text (URL de Spotify/YouTube, nullable)
- thumbnail_url: text (URL del thumbnail, nullable)
- aspect_ratio: numeric (ratio ancho/alto de imagen principal)
- published_at: timestamptz (nullable para borradores)
- is_draft: boolean (opcional, puede no existir en BD)
```

---

## DISEÑO Y ESTILOS

### Paleta de Colores
- **Fondo principal**: `#f5f1e8` (beige cálido)
- **Fondo editor**: `#fefefe` (blanco papel)
- **Líneas cuaderno**: `#d1d5db` (gris claro)
- **Bordes**: `#e5e7eb` (gris medio)
- **Texto**: `#2c2416` (marrón oscuro)

### Tipografía
- **Fuente base**: Inter (formal), fallback a Segoe UI, system-ui
- **Tamaño base**: 16px
- **Line-height**: 1.8 (28.8px) - CRÍTICO para alineación con líneas

### Layout del Modal
```
┌─────────────────────────────────────────────────┐
│ Barra Superior                                  │
│ [X] Nueva publicación  [Estadísticas] [Botones]│
├─────────────────────────────────────────────────┤
│                                                 │
│  [Editor Principal]        [Sidebar Derecho]   │
│  ┌──────────────────┐     ┌─────────────┐     │
│  │ Campo Título     │     │ Multimedia  │     │
│  │                  │     │             │     │
│  │ ┌──────────────┐ │     │ [Colapsable]│     │
│  │ │Editor Cuaderno│ │     │             │     │
│  │ │(con líneas)  │ │     │ Referencias │     │
│  │ │              │ │     │             │     │
│  │ └──────────────┘ │     │ Validación  │     │
│  │                  │     │             │     │
│  └──────────────────┘     └─────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## FUNCIONES TÉCNICAS IMPORTANTES

### processPastedHTML()
- Limpia HTML pegado de fuentes externas
- Preserva estructura importante (código, listas, blockquotes)
- Aplica line-height correcto a todos los elementos
- Ajusta márgenes para múltiplos de line-height

### markdownToHTML()
- Convierte markdown a HTML
- Procesa en orden: bloques de código → listas → títulos → formato inline
- Crea estructura HTML válida
- Aplica line-height después de conversión

### getStatistics()
- Cuenta palabras excluyendo HTML
- Calcula tiempo de lectura (200 palabras/min)
- Retorna objeto con words, characters, readingTime

### getValidationStatus()
- Verifica título, contenido, multimedia
- Retorna objeto con isValid y flags individuales
- Usado para mostrar checklist visual

---

## FLUJO DE DATOS

```
Usuario escribe en editor
  ↓
onChange() del RichTextEditor
  ↓
setDescription() en UploadModal
  ↓
Auto-guardado a localStorage (cada 2s)
  ↓
Usuario hace clic en "Publicar"
  ↓
handleSubmit()
  ↓
Validación de campos
  ↓
Subida de imágenes a Supabase Storage
  ↓
Inserción en BD (tabla 'posts')
  ↓
onSuccess() callback
  ↓
Refrescar feed principal
```

---

## CASOS ESPECIALES

### Borrador sin Imágenes
- Usa placeholder SVG en base64
- Permite guardar solo texto
- Se puede publicar después agregando imágenes

### Edición de Post Existente
- Carga imágenes existentes desde `post.images[]`
- NO borra imágenes antiguas si no se seleccionan nuevas
- Combina imágenes existentes con nuevas subidas

### Múltiples Imágenes
- Todas las imágenes se guardan en array `images`
- Primera imagen es `image_url` (imagen principal)
- Aspect ratio se calcula de la primera imagen

### Referencias a Posts
- Se agregan al final del HTML como:
```html
<div style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #ddd;">
  <p style="font-weight: 600;">Referencias:</p>
  <ul>
    <li><a href="#post-{id}">{title}</a></li>
  </ul>
</div>
```

---

## IMPORTANTE PARA CHATGPT

Cuando me preguntes sobre esta funcionalidad, ten en cuenta:

1. **El line-height es CRÍTICO**: Todo debe alinearse con las líneas horizontales del cuaderno (28.8px exactos)

2. **El HTML se preserva**: El editor guarda HTML completo, no markdown. La conversión markdown→HTML solo ocurre al pegar.

3. **Auto-guardado es automático**: No requiere acción del usuario, ocurre cada 2 segundos.

4. **El diseño tipo cuaderno es visual**: Las líneas son un fondo CSS, no elementos HTML.

5. **Todas las funciones respetan el line-height**: Cualquier nuevo elemento agregado debe tener line-height: 28.8px para alinearse.

6. **Los bloques especiales son HTML con estilos inline**: Se insertan como divs con estilos completos.

7. **La validación es en tiempo real**: El estado de validación se recalcula en cada cambio.

8. **Supabase Storage requiere autenticación**: Todas las operaciones de almacenamiento requieren usuario autenticado.

---

## PREGUNTAS FRECUENTES QUE DEBES PODER RESPONDER

- ¿Cómo funciona el auto-guardado?
- ¿Cómo se procesa el contenido pegado desde ChatGPT?
- ¿Por qué las líneas del cuaderno son importantes?
- ¿Cómo se alinea el texto con las líneas?
- ¿Qué pasa si pego markdown?
- ¿Cómo funciona el sistema de referencias?
- ¿Cómo se guardan las imágenes?
- ¿Qué validaciones hay antes de publicar?
- ¿Cómo funciona el modo de enfoque?
- ¿Qué son los bloques especiales y cómo se usan?
- ¿Cómo funcionan los layouts de columnas?
- ¿Cómo se integra todo con Supabase?

---

Este es el sistema completo. Entiéndelo a fondo antes de responder cualquier pregunta sobre él.

