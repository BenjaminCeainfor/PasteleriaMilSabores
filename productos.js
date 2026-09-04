// ============================================
// productos.js
// Guarda el listado de productos de la pastelería
// y las funciones para mostrarlos en pantalla.
// ============================================

// Arreglo con todos los productos del catálogo (dato de ejemplo del caso)
// cada producto es un objeto con: id, categoria, nombre, precio, emoji, descripcion
const productos = [
  { id: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", precio: 45000, emoji: "🍫", descripcion: "Torta de chocolate con capas de ganache y avellanas." },
  { id: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Frutas", precio: 50000, emoji: "🍓", descripcion: "Frutas frescas y crema chantilly sobre bizcocho de vainilla." },
  { id: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular de Vainilla", precio: 40000, emoji: "🎂", descripcion: "Bizcocho de vainilla relleno con crema pastelera." },
  { id: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular de Manjar", precio: 42000, emoji: "🎂", descripcion: "Torta tradicional chilena con manjar y nueces." },
  { id: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate", precio: 5000, emoji: "🍮", descripcion: "Postre individual cremoso hecho con chocolate de alta calidad." },
  { id: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico", precio: 5500, emoji: "🍰", descripcion: "Postre italiano con capas de café, mascarpone y cacao." },
  { id: "PSA001", categoria: "Productos Sin Azúcar", nombre: "Torta Sin Azúcar de Naranja", precio: 48000, emoji: "🍊", descripcion: "Torta ligera endulzada naturalmente." },
  { id: "PG001", categoria: "Productos Sin Gluten", nombre: "Brownie Sin Gluten", precio: 4000, emoji: "🍫", descripcion: "Rico y denso, perfecto para quienes evitan el gluten." },
  { id: "PV001", categoria: "Productos Vegana", nombre: "Torta Vegana de Chocolate", precio: 50000, emoji: "🌱", descripcion: "Torta de chocolate húmeda, sin productos de origen animal." },
  { id: "TE001", categoria: "Tortas Especiales", nombre: "Torta Especial de Cumpleaños", precio: 55000, emoji: "🎉", descripcion: "Diseñada especialmente para celebraciones, con mensaje incluido." },
];

function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CL");
}

// Dibuja las tarjetas de producto dentro del contenedor con id "grid-productos"
// el parámetro categoriaFiltro es opcional: si viene, solo muestra esa categoría
function mostrarProductos(categoriaFiltro) {
  const contenedor = document.getElementById("grid-productos");
  if (!contenedor) return; // si la página no tiene ese elemento, no hacemos nada

  contenedor.innerHTML = ""; // limpiamos lo que hubiera antes de volver a dibujar

  // filtramos el arreglo: si no hay categoría o es "Todos", mostramos todo
  const lista = (!categoriaFiltro || categoriaFiltro === "Todos")
    ? productos
    : productos.filter(function (p) { return p.categoria === categoriaFiltro; });

  // recorremos cada producto y creamos su tarjeta en HTML
  lista.forEach(function (producto) {
    // creamos el contenedor de la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-producto";

    // arma el contenido interno de la tarjeta con una plantilla de texto
    tarjeta.innerHTML =
      '<div class="emoji-producto">' + producto.emoji + "</div>" +
      "<h3>" + producto.nombre + "</h3>" +
      '<p class="precio">' + formatearPrecio(producto.precio) + "</p>" +
      '<a class="btn" href="detalle-producto.html?id=' + producto.id + '">Ver más</a>';

    contenedor.appendChild(tarjeta); // agregamos la tarjeta al contenedor
  });
}

// Dibuja los botones de filtro por categoría (Todos + cada categoría única)
function mostrarFiltros() {
  const contenedorFiltros = document.getElementById("filtros");
  if (!contenedorFiltros) return;

  // Set sirve para sacar las categorías repetidas y dejar solo una vez cada una
  const categorias = ["Todos"].concat([...new Set(productos.map(function (p) { return p.categoria; }))]);

  categorias.forEach(function (categoria) {
    const boton = document.createElement("button");
    boton.textContent = categoria;
    if (categoria === "Todos") {
      boton.className = "activo"; // el filtro "Todos" empieza seleccionado
    }

    boton.addEventListener("click", function () {
      // sacamos la clase "activo" de todos los botones y se la ponemos solo a este
      document.querySelectorAll("#filtros button").forEach(function (b) {
        b.classList.remove("activo");
      });
      boton.classList.add("activo");
      mostrarProductos(categoria);
    });

    contenedorFiltros.appendChild(boton);
  });
}

// Muestra el detalle de un solo producto según el id que viene en la URL (?id=XXX)
function mostrarDetalleProducto() {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  // URLSearchParams lee los parámetros que vienen después del "?" en la URL
  const parametros = new URLSearchParams(window.location.search);
  const idProducto = parametros.get("id");

  // buscamos el producto que tenga ese id dentro del arreglo
  const producto = productos.find(function (p) { return p.id === idProducto; });

  if (!producto) {
    contenedor.innerHTML = "<p>No encontramos ese producto.</p>";
    return;
  }

  contenedor.innerHTML =
    '<div class="emoji-producto" style="font-size:6rem">' + producto.emoji + "</div>" +
    "<h1>" + producto.nombre + "</h1>" +
    '<p class="precio">' + formatearPrecio(producto.precio) + "</p>" +
    "<p>" + producto.descripcion + "</p>" +
    '<div class="campo">' +
    '<label for="mensaje-personalizado">Mensaje para la torta (opcional)</label>' +
    '<input type="text" id="mensaje-personalizado" maxlength="60" placeholder="Ej: Feliz cumpleaños Camila">' +
    "</div>" +
    '<button class="btn" id="btn-agregar-carrito">Añadir al carrito</button>';

  // conectamos el botón recién creado con la función de agregar al carrito (definida en carrito.js)
  document.getElementById("btn-agregar-carrito").addEventListener("click", function () {
    const mensaje = document.getElementById("mensaje-personalizado").value;
    agregarAlCarrito(producto, mensaje);
    alert("Se agregó " + producto.nombre + " al carrito.");
  });
}
