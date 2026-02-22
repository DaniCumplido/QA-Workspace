const prisma = require("../config/db");

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    // 1. Llamamos a la base de datos con prisma.
    // El modelo en tu schema.prisma se llamaba 'Profile'
    // En Prisma Client se suele acceder en minúsculas: prisma.profile
    // Se trata de una función asíncrona, debemos usar await
    const users = await prisma.profile.findMany();

    // 2. Devolvemos los usuarios encontrados
    // Usamos .json para indicarle qué estamos enviando
    res.status(200).json(users);
  } catch (error) {
    // 3. Si algo falla, avisamos
    res.status(500).json({ error: "No pude conectar con la BBDD" });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    // 1. Recibimos los campos mediante body y los guardamos en variables
    const { email, full_name, role } = req.body;

    // 2. Llamamos a prisma.profile para crearle un nuevo registro
    // El registro se crea con la data recibida
    // Al tener el mismo nombre en const como en la BD, en JS no hace falta poner email: email
    const newUser = await prisma.profile.create({
      data: { email, full_name, role },
    });

    // 3. Enviamos el nuevo usuario como respuesta
    // Usamos código 201 (creado con éxito)
    res.status(201).json(newUser);
  } catch (error) {
    // 3. Si algo falla, avisamos 
    res.status(500).json({ error: "No se puede conectar con la BBDD" });
  }
};

module.exports = { getAllUsers, createUser };
