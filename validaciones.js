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
  const dominiosPermitidos = ["@duocuc.cl", "@profesor.duoc.cl", "@gmail.com"];
  return dominiosPermitidos.some(function (dominio) {
    return correo.toLowerCase().endsWith(dominio);
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

      const nombre = document.getElementById('registro-nombre');
      const correo = document.getElementById('registro-correo');
      const clave = document.getElementById('registro-clave');
      const confirmarClave = document.getElementById('registro-clave-confirmar');
      const fechaNacimiento = document.getElementById('registro-fecha-nacimiento');
      const codigo = document.getElementById('registro-codigo');

      const errorNombre = document.getElementById('error-registro-nombre');
      const errorCorreo = document.getElementById('error-registro-correo');
      const errorClave = document.getElementById('error-registro-clave');
      const errorConfirmarClave = document.getElementById('error-registro-clave-confirmar');
      const errorFechaNacimiento = document.getElementById('error-registro-fecha');
      const errorCodigo = document.getElementById('error-registro-codigo');

      let esValido = true;
      limpiarErrores([errorNombre, errorCorreo, errorClave, errorConfirmarClave, errorFechaNacimiento, errorCodigo]);

      if (nombre.value.trim() === '') {
        errorNombre.textContent = 'El nombre completo es obligatorio.';
        esValido = false;
      }

      if (correo.value.trim() === '') {
        errorCorreo.textContent = 'El correo es obligatorio.';
        esValido = false;
      } else if (!correoValido(correo.value.trim())) {
        errorCorreo.textContent = 'El correo debe terminar en @duocuc.cl, @profesor.duoc.cl o @gmail.com.';
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

      if (fechaNacimiento.value.trim() === '') {
        errorFechaNacimiento.textContent = 'La fecha de nacimiento es obligatoria.';
        esValido = false;
      }
      if (esValido) {
        const edad = calcularEdad(fechaNacimiento.value);
        let mensajeBienvenida = "¡Registro exitoso! Bienvenido/a a Pastelería Mil Sabores.";
        if (edad >= 50) {
          mensajeBienvenida += " Por ser mayor de 50 años, tienes un 50% de descuento en todos los productos.";
        }
        if (codigo.value.trim() === 'FELICES50') {
          mensajeBienvenida += " Además, aplicaste el código de descuento FELICES50, ¡disfruta tu descuento adicional!";
        }
      alert(mensajeBienvenida);
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
      const mensaje = document.getElementById('contacto-mensaje');

      const errorNombre = document.getElementById('error-contacto-nombre');
      const errorCorreo = document.getElementById('error-contacto-correo');
      const errorMensaje = document.getElementById('error-contacto-mensaje');

      let esValido = true;
      limpiarErrores([errorNombre, errorCorreo, errorMensaje]);

      if (nombre.value.trim() === '') {
        errorNombre.textContent = 'El nombre es obligatorio.';
        esValido = false;
      }

      if (correo.value.trim() !== '' && !correoValido(correo.value.trim())) {
        errorCorreo.textContent = 'El correo debe terminar en @duocuc.cl, @profesor.duoc.cl o @gmail.com.';
        esValido = false;
      }

      if (mensaje.value.trim() === '') {
        errorMensaje.textContent = 'El mensaje no puede estar vacío.';
        esValido = false;
      }

      if (esValido) {
        alert('¡Mensaje enviado con éxito!, nos pondremos en contacto contigo pronto.');
        // formContacto.submit();
      }
    });
  }

  function limpiarErrores(elementos) {
    elementos.forEach(el => {
      if (el) el.textContent = '';
    });
  }

});