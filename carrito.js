// ============================================
// carrito.js
// Maneja el carrito de compras guardándolo en
// localStorage, para que no se pierda al cambiar
// de página o al recargar el navegador.
// ============================================

// Lee el carrito guardado en el navegador; si no hay nada, devuelve un arreglo vacío
function obtenerCarrito() {
  const datosGuardados = localStorage.getItem("carritoMilSabores");
  // JSON.parse convierte el texto guardado de vuelta en un arreglo de objetos
  return datosGuardados ? JSON.parse(datosGuardados) : [];
}

// Guarda el arreglo del carrito en localStorage convertido a texto (JSON)
function guardarCarrito(carrito) {
  localStorage.setItem("carritoMilSabores", JSON.stringify(carrito));
}

// Agrega un producto al carrito (o suma 1 a la cantidad si ya estaba agregado)
function agregarAlCarrito(producto, mensajePersonalizado) {
  const carrito = obtenerCarrito();

  // buscamos si el producto ya está en el carrito con el mismo mensaje
  const existente = carrito.find(function (item) {
    return item.id === producto.id && item.mensaje === mensajePersonalizado;
  });

  if (existente) {
    existente.cantidad = existente.cantidad + 1; // si ya está, solo sumamos 1
  } else {
    // si no está, lo agregamos como un item nuevo con cantidad 1
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      emoji: producto.emoji,
      mensaje: mensajePersonalizado || "",
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito(); // refresca el número que se ve en el header
}

// Quita por completo un item del carrito según su posición (index) en el arreglo
function quitarDelCarrito(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1); // elimina 1 elemento en esa posición
  guardarCarrito(carrito);
  dibujarCarrito(); // vuelve a pintar la lista del carrito en pantalla
}

// Cambia la cantidad de un item (delta puede ser +1 o -1)
function cambiarCantidad(index, delta) {
  const carrito = obtenerCarrito();
  carrito[index].cantidad += delta;

  if (carrito[index].cantidad < 1) {
    carrito[index].cantidad = 1; // nunca dejamos que baje de 1
  }

  guardarCarrito(carrito);
  dibujarCarrito();
}

// Suma el total a pagar considerando precio x cantidad de cada item
function calcularTotal(carrito) {
  return carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);
}

// Actualiza el número que aparece junto al ícono del carrito en el header
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  const carrito = obtenerCarrito();
  // sumamos las cantidades de todos los items para saber cuántos productos hay en total
  const totalItems = carrito.reduce(function (total, item) { return total + item.cantidad; }, 0);
  contador.textContent = totalItems;
}

// Dibuja la lista completa del carrito en la página carrito.html
function dibujarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  if (!contenedor) return; // si no estamos en la página del carrito, no hacemos nada

  const carrito = obtenerCarrito();
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
  }

  carrito.forEach(function (item, index) {
    const fila = document.createElement("div");
    fila.className = "item-carrito";

    fila.innerHTML =
      "<div>" +
      "<strong>" + item.emoji + " " + item.nombre + "</strong>" +
      (item.mensaje ? '<p style="font-size:0.85rem">Mensaje: "' + item.mensaje + '"</p>' : "") +
      "<p>" + formatearPrecio(item.precio) + " c/u</p>" +
      "</div>" +
      '<div class="cantidad-controles">' +
      '<button data-accion="restar">-</button>' +
      ' <span>' + item.cantidad + '</span> ' +
      '<button data-accion="sumar">+</button>' +
      "</div>" +
      '<button class="btn btn-rosa" data-accion="quitar">Quitar</button>';

    // conectamos los 3 botones de esta fila con sus funciones correspondientes
    fila.querySelector('[data-accion="sumar"]').addEventListener("click", function () {
      cambiarCantidad(index, 1);
    });
    fila.querySelector('[data-accion="restar"]').addEventListener("click", function () {
      cambiarCantidad(index, -1);
    });
    fila.querySelector('[data-accion="quitar"]').addEventListener("click", function () {
      quitarDelCarrito(index);
    });

    contenedor.appendChild(fila);
  });

  // mostramos el total general del carrito
  const totalTexto = document.getElementById("total-carrito");
  if (totalTexto) {
    totalTexto.textContent = formatearPrecio(calcularTotal(carrito));
  }
}

// Estas dos líneas se ejecutan apenas carga cualquier página que incluya este archivo
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
document.addEventListener("DOMContentLoaded", dibujarCarrito);
