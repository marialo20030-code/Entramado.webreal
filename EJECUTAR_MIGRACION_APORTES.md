# ✅ Solución: Error al Publicar Comentarios

## 🔴 Problema
Al intentar publicar un comentario, aparece el error:
**"Perhaps you meant the table 'public.posts'"**

Esto significa que la tabla `aportes` no existe en tu base de datos de Supabase.

## ✅ Solución: Ejecutar la Migración

### Paso 1: Abrir Supabase SQL Editor
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu proyecto
3. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
4. Haz clic en **"New query"** (o botón verde "New query")

### Paso 2: Copiar el SQL de la Migración
1. Abre este archivo en tu computadora:
   - Ruta: `project/supabase/migrations/20250102000000_create_aportes_table.sql`
   - O simplemente copia el contenido de abajo

### Paso 3: Pegar y Ejecutar
1. **Copia TODO este contenido:**

```sql
/*
  # Create Aportes (Comments) Table

  ## Overview
  This migration creates the aportes table for comments on posts.
  Each aporte is linked to a post and a user.

  ## New Table
  
  ### `aportes`
  Comments/contributions on posts
  - `id` (uuid, primary key)
  - `post_id` (uuid) - References posts table
  - `user_id` (uuid) - References auth.users
  - `content` (text) - The aporte/comment content
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on aportes table
  - Authenticated users can view all aportes
  - Authenticated users can create aportes
  - Users can only update/delete their own aportes
  
  ## Indexes
  - Index on aportes.post_id for efficient queries
  - Index on aportes.user_id for user queries
  - Index on aportes.created_at for sorting
*/

-- Create aportes table
CREATE TABLE IF NOT EXISTS aportes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aportes_post_id ON aportes(post_id);
CREATE INDEX IF NOT EXISTS idx_aportes_user_id ON aportes(user_id);
CREATE INDEX IF NOT EXISTS idx_aportes_created_at ON aportes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE aportes ENABLE ROW LEVEL SECURITY;

-- Aportes policies
CREATE POLICY "Anyone authenticated can view all aportes"
  ON aportes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create aportes"
  ON aportes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own aportes"
  ON aportes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own aportes"
  ON aportes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update folders RLS to make them private (users can only see their own folders)
DROP POLICY IF EXISTS "Anyone authenticated can view all folders" ON folders;
CREATE POLICY "Users can only view their own folders"
  ON folders FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);
```

2. **Pega el contenido en el editor SQL de Supabase**
3. **Haz clic en "Run"** (o presiona `Ctrl+Enter`)
4. Deberías ver: ✅ **"Success. No rows returned"**

### Paso 4: Verificar
1. En Supabase, ve a **"Table Editor"** (menú lateral)
2. Busca la tabla **`aportes`**
3. Si la ves ✅ → ¡Funcionó!

### Paso 5: Probar
1. Recarga tu página web
2. Intenta publicar un comentario
3. Debería funcionar ahora ✅

---

## 🆘 Si sigue sin funcionar

1. **Verifica que estás en el proyecto correcto de Supabase**
   - Asegúrate de que las variables de entorno en Vercel apuntan al mismo proyecto

2. **Verifica las políticas RLS:**
   - Ve a Supabase → Authentication → Policies
   - Busca políticas para la tabla `aportes`
   - Deberían existir 4 políticas

3. **Revisa la consola del navegador:**
   - Presiona F12
   - Ve a la pestaña "Console"
   - Busca errores adicionales

---

## ✅ Checklist
- [ ] Abrí SQL Editor en Supabase
- [ ] Copié y pegué el SQL completo
- [ ] Ejecuté el SQL (presioné Run)
- [ ] Vi el mensaje "Success"
- [ ] Verifiqué que la tabla `aportes` existe en Table Editor
- [ ] Probé publicar un comentario

**Si marcaste todo** ✅ → **¡Los comentarios deberían funcionar!**














