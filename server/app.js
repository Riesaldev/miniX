//Añadir las variables de entorno
import 'dotenv/config';

//importar las deps
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

//import las rutas
import userRoutes from './src/routes/userRoutes.js';
import msgRoutes from './src/routes/msgRoutes.js';


const { UPLOADS_DIR } = process.env;

//creamos el server
const app = express();

//ruta raiz
app.get( '/', ( req, res ) => {
  res.send( '¡Servidor miniX funcionando!' );
} );
//middlewares de morgan(peticiones entrantes)
app.use( morgan( 'dev' ) );

//middlewares de cors (conexion cliente/servidor)
app.use( cors() );

//middleware que permite leer el body en formato json
app.use( express.json() );

//middleware que permite leer el body en formato form-data
app.use( fileUpload() );

//middleware que permite definir el directorio de archivos subidos
app.use( express.static( UPLOADS_DIR ) );

//middleware que indican donde se encuentran las rutas
app.use( '/api/users', userRoutes );
app.use( '/api/messages', msgRoutes );

//middleware de manejo de errores
app.use( ( err, req, res ) => {
  console.error( err );
  const statusCode = err.code && Number.isInteger( err.code ) ? err.code : 500;
  res.status( statusCode ).send( {
    status: 'error',
    message: err.message || 'Error interno del servidor',
  } );
} );

//middleware ruta no encontrada
app.use( ( req, res ) => {
  res.status( 404 ).send( {
    status: 'error',
    message: 'Ruta no encontrada',
  } );
} );

//Iniciamos el server
app.listen( process.env.PORT, () => {
  console.log( `Servidor corriendo en el puerto ${ process.env.PORT }` );
} );