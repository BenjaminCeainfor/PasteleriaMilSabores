// ============================================
// validaciones.js
// Revisa los datos de los formularios ANTES de
// enviarlos, y muestra mensajes de error
// personalizados junto a cada campo.
// ============================================

// Muestra un mensaje de error debajo de un campo específico
function mostrarError(idSpanError, idCampo, mensaje) {
  const span = document.getElementById(idSpanError);
  const campo = document.getElementById(idCampo);
  span.textContent = mensaje;       // escribimos el mensaje de error
  campo.classList.add("invalido");  // le ponemos el borde rojo con CSS
}

// Limpia el mensaje de error de un campo (cuando el dato ya es válido)
function limpiarError(idSpanError, idCampo) {
  const span = document.getElementById(idSpanError);
  const campo = document.getElementById(idCampo);
  span.textContent = "";
  campo.classList.remove("invalido");
}

// Revisa que el correo termine en uno de los dominios permitidos por el caso
function correoValido(correo) {
  const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  // some() revisa si AL MENOS uno de los dominios calza con el final del correo
  return dominiosPermitidos.some(function (dominio) {
    return correo.toLowerCase().endsWith(dominio);
  });
}

// ---------- Validación del formulario de INICIO DE SESIÓN ----------
function inicializarValidacionLogin() {
  const formulario = document.getElementById("form-login");
  if (!formulario) return; // esta página no tiene el formulario de login

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evitamos que la página se recargue
    let formularioValido = true;

    const correo = document.getElementById("login-correo").value.trim();
    const clave = document.getElementById("login-clave").value;

    // el correo no puede estar vacío
    if (correo === "") {
      mostrarError("error-login-correo", "login-correo", "Debes ingresar tu correo.");
      formularioValido = false;
    } else if (correo.length > 100) {
      mostrarError("error-login-correo", "login-correo", "El correo es demasiado largo (máx. 100 caracteres).");
      formularioValido = false;
    } else if (!correoValido(correo)) {
      mostrarError("error-login-correo", "login-correo", "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      formularioValido = false;
    } else {
      limpiarError("error-login-correo", "login-correo");
    }

    // la contraseña debe tener entre 4 y 10 caracteres
    if (clave === "") {
      mostrarError("error-login-clave", "login-clave", "Debes ingresar tu contraseña.");
      formularioValido = false;
    } else if (clave.length < 4 || clave.length > 10) {
      mostrarError("error-login-clave", "login-clave", "La contraseña debe tener entre 4 y 10 caracteres.");
      formularioValido = false;
    } else {
      limpiarError("error-login-clave", "login-clave");
    }

    // si todo salió bien, avisamos y simulamos el ingreso (no hay backend todavía)
    if (formularioValido) {
      alert("Bienvenido/a a Pastelería Mil Sabores.");
      formulario.reset();
    }
  });
}

// ---------- Validación del formulario de REGISTRO ----------
function inicializarValidacionRegistro() {
  const formulario = document.getElementById("form-registro");
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let formularioValido = true;

    const nombre = document.getElementById("registro-nombre").value.trim();
    const correo = document.getElementById("registro-correo").value.trim();
    const clave = document.getElementById("registro-clave").value;
    const claveConfirmar = document.getElementById("registro-clave-confirmar").value;
    const fechaNacimiento = document.getElementById("registro-fecha-nacimiento").value;

    // nombre obligatorio, máximo 50 caracteres
    if (nombre === "") {
      mostrarError("error-registro-nombre", "registro-nombre", "Debes ingresar tu nombre completo.");
      formularioValido = false;
    } else if (nombre.length > 50) {
      mostrarError("error-registro-nombre", "registro-nombre", "El nombre no puede superar los 50 caracteres.");
      formularioValido = false;
    } else {
      limpiarError("error-registro-nombre", "registro-nombre");
    }

    // correo obligatorio y con dominio permitido
    if (correo === "") {
      mostrarError("error-registro-correo", "registro-correo", "Debes ingresar tu correo.");
      formularioValido = false;
    } else if (!correoValido(correo)) {
      mostrarError("error-registro-correo", "registro-correo", "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      formularioValido = false;
    } else {
      limpiarError("error-registro-correo", "registro-correo");
    }

    // contraseña entre 4 y 10 caracteres
    if (clave.length < 4 || clave.length > 10) {
      mostrarError("error-registro-clave", "registro-clave", "La contraseña debe tener entre 4 y 10 caracteres.");
      formularioValido = false;
    } else {
      limpiarError("error-registro-clave", "registro-clave");
    }

    // la confirmación debe ser idéntica a la contraseña
    if (claveConfirmar !== clave || claveConfirmar === "") {
      mostrarError("error-registro-clave-confirmar", "registro-clave-confirmar", "Las contraseñas no coinciden.");
      formularioValido = false;
    } else {
      limpiarError("error-registro-clave-confirmar", "registro-clave-confirmar");
    }

    // fecha de nacimiento obligatoria (se usa para el descuento de mayores de 50 años)
    if (fechaNacimiento === "") {
      mostrarError("error-registro-fecha", "registro-fecha-nacimiento", "Debes ingresar tu fecha de nacimiento.");
      formularioValido = false;
    } else {
      limpiarError("error-registro-fecha", "registro-fecha-nacimiento");
    }

    if (formularioValido) {
      // avisamos si el usuario califica para el descuento por edad, como sugerencia dinámica
      const edad = calcularEdad(fechaNacimiento);
      let mensajeBienvenida = "¡Registro exitoso! Bienvenido/a a Pastelería Mil Sabores.";
      if (edad >= 50) {
        mensajeBienvenida += " Por ser mayor de 50 años, tienes un 50% de descuento en todos los productos.";
      }
      alert(mensajeBienvenida);
      formulario.reset();
    }
  });
}

// Calcula la edad de una persona a partir de su fecha de nacimiento (formato YYYY-MM-DD)
function calcularEdad(fechaTexto) {
  const hoy = new Date();
  const nacimiento = new Date(fechaTexto);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  // si todavía no llega el mes/día de cumpleaños este año, restamos 1
  const noHaCumplidoAnos =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (noHaCumplidoAnos) {
    edad = edad - 1;
  }
  return edad;
}

// ---------- Validación del formulario de CONTACTO ----------
function inicializarValidacionContacto() {
  const formulario = document.getElementById("form-contacto");
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let formularioValido = true;

    const nombre = document.getElementById("contacto-nombre").value.trim();
    const correo = document.getElementById("contacto-correo").value.trim();
    const mensaje = document.getElementById("contacto-mensaje").value.trim();

    if (nombre === "") {
      mostrarError("error-contacto-nombre", "contacto-nombre", "Cuéntanos tu nombre.");
      formularioValido = false;
    } else if (nombre.length > 100) {
      mostrarError("error-contacto-nombre", "contacto-nombre", "El nombre no puede superar los 100 caracteres.");
      formularioValido = false;
    } else {
      limpiarError("error-contacto-nombre", "contacto-nombre");
    }

    if (correo !== "" && !correoValido(correo)) {
      // el correo es opcional en contacto, pero si lo escriben debe ser válido
      mostrarError("error-contacto-correo", "contacto-correo", "Ese correo no parece válido, revísalo.");
      formularioValido = false;
    } else {
      limpiarError("error-contacto-correo", "contacto-correo");
    }

    if (mensaje === "") {
      mostrarError("error-contacto-mensaje", "contacto-mensaje", "Escríbenos tu consulta antes de enviar.");
      formularioValido = false;
    } else if (mensaje.length > 500) {
      mostrarError("error-contacto-mensaje", "contacto-mensaje", "El mensaje no puede superar los 500 caracteres.");
      formularioValido = false;
    } else {
      limpiarError("error-contacto-mensaje", "contacto-mensaje");
    }

    if (formularioValido) {
      alert("¡Gracias por escribirnos! Te responderemos pronto.");
      formulario.reset();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. VALIDACIÓN FORMULARIO LOGIN
  // ==========================================
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const correo = document.getElementById('login-correo');
      const clave = document.getElementById('login-clave');

      const errorCorreo = document.getElementById('error-login-correo');
      const errorClave = document.getElementById('error-login-clave');

      let esValido = true;
      limpiarErrores([errorCorreo, errorClave]);

      if (correo.value.trim() === '') {
        errorCorreo.textContent = 'El correo es obligatorio.';
        esValido = false;
      }

      if (clave.value.trim() === '') {
        errorClave.textContent = 'La contraseña es obligatoria.';
        esValido = false;
      }

      if (esValido) {
        alert('¡Inicio de sesión exitoso!');
        // formLogin.submit();
      }
    });
  }


  // ==========================================
  // 2. VALIDACIÓN FORMULARIO REGISTRO
  // ==========================================
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('reg-nombre');
      const correo = document.getElementById('reg-correo');
      const clave = document.getElementById('reg-clave');
      const confirmarClave = document.getElementById('reg-confirmar-clave');

      const errorNombre = document.getElementById('error-reg-nombre');
      const errorCorreo = document.getElementById('error-reg-correo');
      const errorClave = document.getElementById('error-reg-clave');
      const errorConfirmarClave = document.getElementById('error-reg-confirmar-clave');

      let esValido = true;
      limpiarErrores([errorNombre, errorCorreo, errorClave, errorConfirmarClave]);

      if (nombre.value.trim() === '') {
        errorNombre.textContent = 'El nombre completo es obligatorio.';
        esValido = false;
      }

      if (correo.value.trim() === '') {
        errorCorreo.textContent = 'El correo es obligatorio.';
        esValido = false;
      }

      if (clave.value.trim() === '') {
        errorClave.textContent = 'La contraseña es obligatoria.';
        esValido = false;
      }

      if (confirmarClave.value.trim() === '') {
        errorConfirmarClave.textContent = 'Debes confirmar la contraseña.';
        esValido = false;
      } else if (clave.value.trim() !== '' && clave.value !== confirmarClave.value) {
        errorConfirmarClave.textContent = 'Las contraseñas no coinciden.';
        esValido = false;
      }

      if (esValido) {
        alert('¡Registro completado con éxito!');
        // formRegistro.submit();
      }
    });
  }


  // ==========================================
  // 3. VALIDACIÓN FORMULARIO CONTACTO
  // ==========================================
  const formContacto = document.getElementById('form-contacto');
  if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('contacto-nombre');
      const correo = document.getElementById('contacto-correo');
      const asunto = document.getElementById('contacto-asunto');
      const mensaje = document.getElementById('contacto-mensaje');

      const errorNombre = document.getElementById('error-contacto-nombre');
      const errorCorreo = document.getElementById('error-contacto-correo');
      const errorAsunto = document.getElementById('error-contacto-asunto');
      const errorMensaje = document.getElementById('error-contacto-mensaje');

      let esValido = true;
      limpiarErrores([errorNombre, errorCorreo, errorAsunto, errorMensaje]);

      if (nombre.value.trim() === '') {
        errorNombre.textContent = 'El nombre es obligatorio.';
        esValido = false;
      }

      if (asunto.value.trim() === '') {
        errorAsunto.textContent = 'El asunto es obligatorio.';
        esValido = false;
      }

      if (mensaje.value.trim() === '') {
        errorMensaje.textContent = 'El mensaje no puede estar vacío.';
        esValido = false;
      }

      if (esValido) {
        alert('¡Mensaje enviado con éxito!');
        // formContacto.submit();
      }
    });
  }

  // Función auxiliar para borrar mensajes previos
  function limpiarErrores(elementos) {
    elementos.forEach(el => {
      if (el) el.textContent = '';
    });
  }

});