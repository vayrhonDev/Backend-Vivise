const session = require('express-session');


// const WebpayPlus = require("transbank-sdk").WebpayPlus; // CommonJS
// const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); // CommonJS


// // Versión 3.x del SDK
// const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));

// // Versión 2.x del SDK
// WebpayPlus.commerceCode = 597055555532;
// WebpayPlus.apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
// WebpayPlus.environment = Environment.Integration;
// // Configuración de express-session

const express = require('express');
const cors = require('cors');
const asyncHandler = require('express-async-handler'); // Importar asyncHandler
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express();
app.use(session({
  secret: 'miSecreto', // Cambia esto a una cadena secreta real
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.json());




// Configurar CORS
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type'],
  allowedMethods: ['GET','POST'],
}));

// app.post('/login', (req, res) => {
//   // Aquí verificarías las credenciales del usuario
//   const { username, password } = req.body;

//   // Verifica si las credenciales son correctas (esto debe personalizarse)
//   if (username === 'usuario' && password === 'contrasena') {
//     // Autenticación exitosa
//     req.session.loggedIn = true; // Marca al usuario como autenticado
//     res.status(200).json({ message: 'Inicio de sesión exitoso' });
//   } else {
//     // Credenciales incorrectas
//     res.status(401).json({ message: 'Credenciales incorrectas' });
//   }
// });

// app.get('/ruta-protegida', (req, res) => {
//   if (req.session.loggedIn) {
//     // El usuario está autenticado, puedes realizar acciones relacionadas con la sesión
//     res.status(200).json({ message: 'Acceso autorizado' });
//   } else {
//     // El usuario no está autenticado
//     res.status(401).json({ message: 'Acceso no autorizado' });
//   }
// });

// Definir una función de ruta asincrónica utilizando asyncHandler
app.get('/a', asyncHandler(async (req, res) => {
  try {
    // Se accede a la ruta '/vivise/a' del servidor de origen
    const respuesta = await axios.get('http://localhost:3000/a');
    res.json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
}));


app.get('/cupones', asyncHandler(async (req, res) => {
  try {
    // Se accede a la ruta '/vivise/a' del servidor de origen
    const respuesta = await axios.get('http://localhost:3000/cupones');
    res.json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
}));

app.post('/getCupon', asyncHandler(async(req,res)=>{
  let param ={
    cupon: req.body.cupon
  }
  console.log(param)
  try {
    const respuesta = await axios.post('http://localhost:3000/getCupon',param);
    console.log("respuesta",JSON.stringify(respuesta.data) )
    res.json(JSON.parse(respuesta.data.results));
  } catch (error) {
    console.error('Error al enviar datos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
  // Maneja la lógica para procesar el cupón
}));


app.post('/guardarCarrito', asyncHandler(async (req, res) => {
  // Maneja los datos recibidos desde el frontend
  let param = {
    id_producto: req.body.id_producto,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    cantidad_stock: req.body.cantidad_stock,
    imagen_producto: req.body.imagen_producto
  };
}));
//   console.log('Sesión actual:', req.session);
//   // Obtiene el carrito de la sesión actual o crea uno si no existe
//   const carrito = req.session.carrito || [];
//   if (carrito) {
//     console.log("existe")
//   } else {
//     req.session.carrito = [];
//   }
//   carrito.push(param);
//   console.log('Carrito en sesión:', carrito);
//   req.session.carrito = carrito;
//   console.log(req.session.carrito)
//   req.session.save((err) => {
//     if (err) {
//       console.error('Error al actualizar el carrito:', err.message);
//     }
//   });
//   // Envía una respuesta al frontend
//   // console.log('Producto agregado al carrito:', param);
//   res.status(200).json({ 
//     message: 'Producto agregado con éxito',
//     carrito: carrito // Devuelve el carrito actualizado
// });
// }));
app.post('/guardarCarrito', asyncHandler(async (req, res) => {
  // Maneja los datos recibidos desde el frontend
  let param = {
    id_producto: req.body.id_producto,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    cantidad_stock: req.body.cantidad_stock,
    imagen_producto: req.body.imagen_producto
  };
  // Obtiene el carrito de la sesión actual o crea uno si no existe
  const carrito = req.session.carrito || [];
  console.log(req.sessionID)
  // Agrega el producto al carrito
  carrito.push(param);
  console.log('Carrito en sesión:', carrito);
  req.session.carrito = carrito;
  req.session.save((err) => {
    if (err) {
      console.error('Error al actualizar el carrito:', err.message);
    }
  });
  // Envía una respuesta al frontend
  // console.log('Producto agregado al carrito:', param);
}));

app.get('/verCarrito', (req, res) => {
  const carrito = req.session.carrito || [];
  res.send('Carrito de compras: ' + JSON.stringify(carrito));
  console.log(carrito)
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
