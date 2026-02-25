const { createClient } = require('@supabase/supabase-js');
const prisma = require('../config/db');

// Conectamos con Supabase para validar el token
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No se proporcionó un token" });
    }

    const token = authHeader.split(' ')[1];

    // 1. Le preguntamos a Supabase: "¿Es este token válido?"
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Sesión expirada o inválida" });
    }

    // 2. Buscamos en nuestra base de datos (Prisma) para saber qué ROL tiene
    const profile = await prisma.profile.findUnique({
      where: { email: user.email } // Buscamos por el email que nos dio Supabase
    });

    if (!profile) {
      return res.status(404).json({ error: "Usuario no autorizado en la base de datos" });
    }

    // 3. "Pegamos" el perfil al objeto request para que esté disponible después
    req.user = profile; 

    // 4. ¡Todo OK! Pasamos al siguiente paso
    next(); 

  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // Si el rol del usuario está en la lista de los que permitimos...
    if (rolesPermitidos.includes(req.user.role)) {
      next(); // Adelante, puedes pasar
    } else {
      // Si no, le cerramos la puerta con un 403
      return res.status(403).json({ error: "No tienes permisos suficientes" });
    }
  };
};

module.exports = { authenticate, checkRole };