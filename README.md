# Pekitas Landing para Vercel

Landing estatica conectada a Supabase.

## Variables en Vercel

Configura estas variables en Project Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

No subas `SUPABASE_SERVICE_ROLE_KEY` a Vercel.

## Build

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Flujo

1. El panel admin local guarda productos, categorias, tags, settings e imagenes en Supabase.
2. La landing en Vercel lee esos datos con `SUPABASE_ANON_KEY`.
3. Las imagenes se sirven desde Supabase Storage, bucket `product-images`.
4. El newsletter inserta emails en la tabla `newsletter`.
