    // Ocultar splash introducion luego de 2 segundos y habilitar scroll
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 2000);
});
document.body.style.overflow = 'hidden';






// Datos para clima
const regiones = [
  "Santiago, Chile",
  "Arica, Chile",
  "Iquique, Chile",
  "Antofagasta, Chile",
  "Calama, Chile",
  "Copiapó, Chile",
  "La Serena, Chile",
  "Coquimbo, Chile",
  "Valparaíso, Chile",
  "Viña del Mar, Chile",
  "Rancagua, Chile",
  "Talca, Chile",
  "Chillán, Chile",
  "Concepción, Chile",
  "Los Ángeles, Chile",
  "Temuco, Chile",
  "Valdivia, Chile",
  "Osorno, Chile",
  "Puerto Montt, Chile",
  "Coyhaique, Chile",
  "Punta Arenas, Chile"
];
const traduccionesClima = {
  'Sunny': 'Soleado', 'Clear': 'Despejado', 'Partly cloudy': 'Parcialmente nublado',
  'Cloudy': 'Nublado', 'Overcast': 'Cubierto', 'Mist': 'Neblina',
  'Patchy rain possible': 'Posible lluvia dispersa', 'Light drizzle': 'Lluvia ligera',
  'Heavy rain': 'Lluvia intensa', 'Showers': 'Chubascos',
  'Thundery outbreaks possible': 'Posibles tormentas', 'Snow': 'Nieve' ,'Rain' : 'Lluvia','Light drizzle and rain' : 'Lluvia ligera y llovizna'
};
// api para clima
async function cargarClima() {
  const contenedor = document.getElementById('weather-container');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  const hoy = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  for (const region of regiones) {
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(region)}?format=j1`);
      const data = await res.json();

      const condition = data.current_condition[0].weatherDesc[0].value;
      const tempC = data.current_condition[0].temp_C;
      const feelsLikeC = data.current_condition[0].FeelsLikeC;
      const humidity = data.current_condition[0].humidity;
      const maxTemp = data.weather[0].maxtempC;
      const minTemp = data.weather[0].mintempC;
  

      const descEsp = traduccionesClima[condition] || condition;

      const div = document.createElement('div');
      div.className = 'mb-3 p-2 bg-dark rounded';
      div.innerHTML = `
        <strong>${region}</strong><br>
        Clima: ${descEsp}<br>
        Humedad: ${humidity}%<br>
        Maxima: ${maxTemp}°C<br>
        Minima: ${minTemp}°C<br> 
      
      `;
      contenedor.appendChild(div);
    } catch (e) {
      console.error('Error cargando clima:', e);
    }
  }
}





// Función para cargar noticias
let noticiasInternacionales = [];
let noticiasChile = [];
async function cargarNoticias(apiUrl, contenedorId, limit = 10) {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = '';

    const items = data.articles || data.items || [];

    // Ordenar noticias de más reciente a más antigua
    items.sort((a, b) => new Date(b.publishedAt || b.pubDate) - new Date(a.publishedAt || a.pubDate));

    if (!items.length) {
      contenedor.innerHTML = '<p>No hay noticias disponibles.</p>';
      return;
    }

    // Obtener fecha actual y hace 2 días
    const ahora = new Date();
    const hace2Dias = new Date();
    hace2Dias.setDate(ahora.getDate() - 2);

    // Filtrar noticias publicadas en los últimos 2 días
    const noticiasRecientes = items.filter(item => {
      const fecha = new Date(item.publishedAt || item.pubDate);
      return fecha >= hace2Dias && fecha <= ahora;
    });

    if (noticiasRecientes.length === 0) {
      contenedor.innerHTML = '<p>No hay noticias recientes disponibles.</p>';
      return;
    }

    // Guardar noticias según el contenedor
    if (contenedorId === 'mundo-news') {
      noticiasInternacionales = noticiasRecientes.slice(0, limit);


    } else if (contenedorId === 'chile-news') {
      noticiasChile = noticiasRecientes.slice(0, limit);
    }

    if (contenedorId === 'chile-news' && noticiasChile.length > 0) {
  const noticia = noticiasChile[0];
  mostrarAlertaNoticia(noticia.title, noticia.url || noticia.link);
}

    // Mostrar noticias en el contenedor
    for (let i = 0; i < Math.min(limit, noticiasRecientes.length); i++) {
      const item = noticiasRecientes[i];
      const fecha = new Date(item.publishedAt || item.pubDate);
      const titulo = item.title || 'Sin título';
      const link = item.url || item.link || '#';

      if (i === 0) {
        const tituloDiv = document.createElement('h6');
        tituloDiv.className = 'titulo-ultima-noticia text-center';
        tituloDiv.textContent = '';
        contenedor.appendChild(tituloDiv);
      }

      const div = document.createElement('div');
      div.className = 'news-item';

      if (i === 0) {
        div.classList.add('ultima-noticia');
      }

      div.innerHTML = `
        <div class="news-title">${titulo}</div>
        <div class="news-date">${fecha.toLocaleString('es-CL', { hour12: false })}</div>
        <a href="${link}" target="_blank" class="btn-vermas">Ver más</a>
        <div class="d-flex justify-content-end"> 
          <span class="badge rounded-pill text-bg-dark ">VIVO24® | Noticias</span>
        </div>
      `;
      contenedor.appendChild(div);
    }
  } catch (e) {
    console.error('Error cargando noticias:', e);
  }
}



// Scroll botón bajar
document.querySelectorAll('.scroll-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollBy({top: 100, behavior: 'smooth'});
  });
});



// Contador actualización
let tiempoRestante = 60;
const contador = document.getElementById('contador');
setInterval(() => {
  tiempoRestante--;
  if (tiempoRestante <= 0) {
    tiempoRestante = 60;
    cargarTodasLasFuentes();
  }
  if (contador) contador.textContent = `Próxima actualización en: ${tiempoRestante} segundos`;
}, 1000);



// === Sismos ===
async function fetchEarthquakes() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    const data = await response.json();

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const quakes = data.features.filter(q => new Date(q.properties.time) >= oneDayAgo)
                                .sort((a,b)=>b.properties.time - a.properties.time);
    if (!quakes.length) {
      document.getElementById('mayor-detalle').textContent = 'No hay datos recientes.';
      document.getElementById('ultimo-detalle').textContent = 'No hay datos recientes.';
      document.getElementById('top3-list').textContent = 'No hay datos recientes.';
      return;
    }

    const ultimo = quakes[0];
    const top1 = [...quakes].sort((a,b) => b.properties.mag - a.properties.mag)[0];
    const top3 = [...quakes].sort((a,b) => b.properties.mag - a.properties.mag).slice(0,3);

    document.getElementById('mayor-detalle').innerHTML = 
      `${new Date(top1.properties.time).toLocaleString('es-CL', { hour12:false })} - Mag ${top1.properties.mag} en ${top1.properties.place}`;
    const [lngMayor, latMayor] = top1.geometry.coordinates;
    document.getElementById('mayor-mapa').innerHTML = `<iframe src="https://maps.google.com/maps?q=${latMayor},${lngMayor}&z=5&output=embed" ></iframe>`;

    document.getElementById('ultimo-detalle').innerHTML = 
      `${new Date(ultimo.properties.time).toLocaleString('es-CL', { hour12:false })} - Mag ${ultimo.properties.mag} en ${ultimo.properties.place}`;
    const [lngUlt, latUlt] = ultimo.geometry.coordinates;
    document.getElementById('ultimo-mapa').innerHTML = `<iframe src="https://maps.google.com/maps?q=${latUlt},${lngUlt}&z=5&output=embed" ></iframe>`;

     document.getElementById('ticker-text').innerHTML = 
      `${new Date(ultimo.properties.time).toLocaleString('es-CL', { hour12:false })} - Mag ${ultimo.properties.mag} en ${ultimo.properties.place}`;

    const top3Html = top3.map((q,i) => `
      <div style="margin-bottom:6px;">
        <strong>Top ${i+1}:</strong> Mag ${q.properties.mag} - ${q.properties.place} <br>
        <small>${new Date(q.properties.time).toLocaleString('es-CL', { hour12:false })}</small>
      </div>`).join('');
    document.getElementById('top3-list').innerHTML = top3Html;

  } catch(err) {
    console.error('Error al obtener sismos:', err);
  }
}




// cerebro para chatbot
const conocimientos = {

  "preguntar":"Este chat te sirve para encontrar las ultima noticias nacionales y internacionales, sismos y clima de hoy en Santiago",
  "sirve":"Este chat te sirve para encontrar las ultima noticias nacionales y internacionales, sismos y clima de hoy en Santiago",
  
  "hola":"Buenos días, desde este chat puede preguntar por la ultimos sismos, noticias y clima"
};
// Función para mostrar mensaje inicial
function mostrarMensajeInicial() {
  appendMessage("Asistente", "¡Hola! Soy tu asistente. Pregúntame sobre el clima en Santiago, noticias nacionales, noticias internacionales, Ultimo sismos y más.");
}
// Modifica toggleChat para mostrar el mensaje la primera vez que se abre
function toggleChat() {
  const chatWindow = document.getElementById("chat-window");
  const isHidden = chatWindow.style.display === "none" || chatWindow.style.display === "";
  
  chatWindow.style.display = isHidden ? "flex" : "none";
  
  if (isHidden) {
    // Si se abre el chat, y no hay mensajes aún, mostrar mensaje inicial
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages && chatMessages.children.length === 0) {
      mostrarMensajeInicial();
    }
  }
}
// Añadir mensajes al chat
function appendMessage(author, text) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;
  const message = document.createElement("div");
  message.innerHTML = `<b>${author}:</b> ${text}`;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Manejar input usuario y generar respuesta
function handleUserInput() {
  const inputField = document.getElementById("user-input");
  if (!inputField) return;
  const pregunta = inputField.value.trim().toLowerCase();
  if (pregunta === "") return;
  appendMessage("Tú", pregunta);

  let respuesta = "No tengo información sobre eso ahora.";

  if (pregunta.includes("clima") || pregunta.includes("tiempo")) {
    const climaContenedor = document.getElementById("weather-container");
    const santiagoDiv = climaContenedor
      ? Array.from(climaContenedor.children).find(div => div.innerHTML.includes("Santiago"))
      : null;
    respuesta = santiagoDiv ? santiagoDiv.innerText : "No tengo el clima de Santiago cargado aún.";
  } else if (pregunta.includes("internacionales") || pregunta.includes("noticias internacionales")) {
    if (noticiasInternacionales && noticiasInternacionales.length > 0) {
      const noticia = noticiasInternacionales[0];
      respuesta = `Última noticia internacional: <a href="${noticia.url || noticia.link}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">${noticia.title}</a>`;
    } else {
      respuesta = "No hay noticias internacionales disponibles aún.";
    }
  } else if (pregunta.includes("noticias nacional") || pregunta.includes("noticias") ) {
    if (noticiasChile && noticiasChile.length > 0) {
      const noticia = noticiasChile[0];
      respuesta = `Última noticia de Chile: <a href="${noticia.url || noticia.link}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">${noticia.title}</a>`;
    } else {
      respuesta = "No hay noticias de Chile disponibles aún.";
    }
  } else if (pregunta.includes("sismo") || pregunta.includes("terremoto")) {
    const sismoDetalle = document.getElementById("ultimo-detalle");
    const ultimoMapa = document.getElementById("ultimo-mapa").querySelector("iframe");
    if (sismoDetalle && ultimoMapa) {
      const src = ultimoMapa.src;
      const coordsMatch = src.match(/q=([^&]*)/);
      const coords = coordsMatch ? coordsMatch[1] : null;
      const mapaLink = coords ? `https://maps.google.com/maps?q=${coords}` : null;
      respuesta = `Último sismo: ${sismoDetalle.innerText}` +
        (mapaLink ? ` <a href="${mapaLink}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">Ver mapa</a> Escribe mayor intensidad para ver el ultimo sismo de mayor intensidad ` : "");
        
    } else {
      respuesta = "No tengo datos del último sismo aún.";
    }
  } else if (pregunta.includes("mayor")||pregunta.includes("mayor intensidad") ) {
    const mayorDetalle = document.getElementById("mayor-detalle");
    const mayorMapa = document.getElementById("mayor-mapa").querySelector("iframe");
    if (mayorDetalle && mayorMapa) {
      const src = mayorMapa.src;
      const coordsMatch = src.match(/q=([^&]*)/);
      const coords = coordsMatch ? coordsMatch[1] : null;
      const mapaLink = coords ? `https://maps.google.com/maps?q=${coords}` : null;
      respuesta = `Sismo de mayor intensidad: ${mayorDetalle.innerText}` +
        (mapaLink ? ` <a href="${mapaLink}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">Ver mapa</a>` : "");
    } else {
      respuesta = "No tengo datos del sismo de mayor intensidad.";
    }
  } else if (pregunta.includes("top") && pregunta.includes("sismo")) {
    const top3 = document.getElementById("top3-list");
    respuesta = top3 ? `Top 3 sismos:\n${top3.innerText}` : "No tengo datos de los top 3 sismos.";
  } else {
    for (const clave in conocimientos) {
      if (pregunta.includes(clave)) {
        respuesta = conocimientos[clave];
        break;
      }
    }
  }

  appendMessage("Asistente", respuesta);
  inputField.value = "";
}

// Eventos para enviar mensaje con botón o tecla Enter
document.addEventListener("DOMContentLoaded", () => {
  const btnEnviar = document.getElementById("send-btn");
  const input = document.getElementById("user-input");

  if (btnEnviar) {
    btnEnviar.addEventListener("click", handleUserInput);
  }
  if (input) {
    input.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleUserInput();
      }
    });
  }
});



  const menuButton = document.getElementById('menu-button');
  const menu = document.getElementById('menu');

  menuButton.addEventListener('click', () => {
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
  });

  // Opcional: cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuButton) {
      menu.style.display = 'none';
    }
  });




function actualizarFechaHora() {
      const ahora = new Date();

      const opciones = {
        weekday: 'long', // día de la semana
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };

      // Formato en español
      const fechaHoraFormateada = ahora.toLocaleString('es-ES', opciones);

      document.getElementById('fechaHora').textContent = fechaHoraFormateada;
    }

    // Actualizar la fecha y hora cada segundo
    setInterval(actualizarFechaHora, 1000);

    // Mostrar inmediatamente al cargar la página
    actualizarFechaHora();





// Cargar todas las fuentes (noticias, clima, sismos)
async function cargarTodasLasFuentes() {
  const fuentesInternacionales = [
  // Español
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%3Fhl%3Des-419%26gl%3DUS%26ceid%3DUS%3Aes',
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Felpais.com%2Frss%2Ffeed%2Felpais%2Fportada.xml',
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.infobae.com%2Ffeed%2F',

  // Inglés — BBC Mundo
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Frss.xml',

  // Más fuentes en inglés para ampliar cobertura:
  // CNN Top Stories
  'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Frss.cnn.com%2Frss%2Fcnn_topstories.rss',
  // Reuters World News
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.reuters.com%2FReuters%2FWorldNews',
  // NPR News
  'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.npr.org%2Frss%2Frss.php%3Fid%3D1004',
  // AP News World
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fapnews.com%2Fworld-news.rss'
  ];

  // Llamamos la función modificada para múltiples fuentes
  await cargarNoticiasMultiples(fuentesInternacionales, 'mundo-news', 15);

  // Cargar noticias Chile (una sola fuente)
  await cargarNoticias(
    'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%3Fhl%3Des-419%26gl%3DCL%26ceid%3DCL%3Aes',
    'chile-news',
    15
  );

  // Cargar clima y sismos como antes
  cargarClima();
  fetchEarthquakes();
}


async function cargarNoticiasMultiples(apiUrls, contenedorId, limit = 10) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  contenedor.innerHTML = '';

  let todasLasNoticias = [];

  for (const url of apiUrls) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const items = data.articles || data.items || [];

      const ahora = new Date();
      const hace2Dias = new Date();
      hace2Dias.setDate(ahora.getDate() - 2);

      const noticiasRecientes = items.filter(item => {
        const fecha = new Date(item.publishedAt || item.pubDate);
        return fecha >= hace2Dias && fecha <= ahora;
      });

      todasLasNoticias = todasLasNoticias.concat(noticiasRecientes);
    } catch (e) {
      console.warn(`Error al cargar fuente: ${url}`, e);
    }
  }

  if (todasLasNoticias.length === 0) {
    contenedor.innerHTML = '<p>No hay noticias internacionales recientes disponibles.</p>';
    return;
  }

  // Ordenar todas las noticias por fecha descendente
  todasLasNoticias.sort((a, b) => new Date(b.publishedAt || b.pubDate) - new Date(a.publishedAt || a.pubDate));

//alertas
  if (todasLasNoticias.length > 0) {
  const noticia = todasLasNoticias[0];
  mostrarAlertaNoticia(noticia.title, noticia.url || noticia.link);
}


  // Mostrar noticias (máximo según `limit`)
  for (let i = 0; i < Math.min(limit, todasLasNoticias.length); i++) {
    const item = todasLasNoticias[i];
    const fecha = new Date(item.publishedAt || item.pubDate);
    const titulo = item.title || 'Sin título';
    const link = item.url || item.link || '#';

    const div = document.createElement('div');
    div.className = 'news-item';
    if (i === 0) div.classList.add('ultima-noticia');

    div.innerHTML = `
      <div class="news-title">${titulo}</div>
      <div class="news-date">${fecha.toLocaleString('es-CL', { hour12: false })}</div>
      <a href="${link}" target="_blank" class="btn-vermas">Ver más</a>
      <div class="d-flex justify-content-end"> 
        <span class="badge rounded-pill text-bg-dark">VIVO24® | Noticias</span>
      </div>
    `;
    contenedor.appendChild(div);
  }
}


function mostrarAlertaNoticia(titulo, link) {
  const alerta = document.getElementById('alerta-noticia');
  if (!alerta) return;

  alerta.innerHTML = `<a href="${link}" target="_blank" style="color:#000; text-decoration:underline;">Urgente Chile: ${titulo}</a>`;
  alerta.classList.remove('hidden');

  // Ocultar después de 6 segundos
  setTimeout(() => {
    alerta.classList.add('hidden');
  }, 3500);
}




// Inicializar
cargarTodasLasFuentes();

// Actualizar cada 60 segundos
setInterval(cargarTodasLasFuentes, 60000);
