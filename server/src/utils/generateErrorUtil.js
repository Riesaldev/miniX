
//Funcion controladora que lanza errores con msg y code
const generateError = (msg, code) => {
  const err = new Error(msg);
  err.code = code;
  throw err;
};

export default generateError;
