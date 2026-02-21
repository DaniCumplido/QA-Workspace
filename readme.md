## BACKEND:

# Inicializar el proyecto
npm init -y

# Express para el servidor y CORS para permitir que React se conecte
npm i express cors

# Prisma Client para hacer las consultas a la BBDD
npm i @prisma/client@6

# Dotenv para leer el archivo .env (configuración de Supabase)
npm i dotenv

# Morgan (Opcional pero recomendado) para ver los logs de las peticiones en consola
npm i morgan

# (Desarrollo)
# Prisma CLI para gestionar las migraciones y el esquema
npm i -D prisma@6

# Nodemon para que el servidor se reinicie solo al guardar cambios
npm i -D nodemon

# Crea la carpeta /prisma y el archivo schema.prisma
npx prisma init

## FRONTEND:

# Crear proyecto Vite con React
npm create vite@latest frontend -- --template react

# Entrar en la carpeta e instalar dependencias base
cd frontend
npm install

# Instalar Axios (para las peticiones a tu API) y Lucide React (para iconos bonitos)
npm install axios lucide-react react-router-dom

# Para que el dashboard se vea moderno sin escribir mil líneas de CSS, instalamos Tailwind + postcss + el plugin de postcss llamado autoprefixer que añade automáticamente prefijos de proveedor (-webkit-, -moz-, -ms-) al código CSS,garantizando la compatibilidad entre diferentes navegadores y versiones antiguas
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @tailwindcss/postcss
