    // Ocultar splash introducion luego de 2 segundos y habilitar scroll
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 2000);
});
document.body.style.overflow = 'hidden';




// Datos de clima y api
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










// Scroll botón bajar
document.querySelectorAll('.scroll-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollBy({top: 100, behavior: 'smooth'});
  });
});





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










// cerebro para chatbot, 
const chistes = [
  "¿Por qué las focas miran siempre hacia arriba? ¡Porque ahí están los focos!",
  "¿Qué le dijo una cebolla a otra cebolla? ¡Eres la única que me hace llorar!",
  "¿Cuál es el colmo de un jardinero? Que siempre lo dejen plantado.",
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "¿Por qué los pájaros no usan Facebook? ¡Porque ya tienen Twitter!",
  "¿Qué le dijo una impresora a otra? ¿Esa hoja es tuya o es una impresión mía?",
  "¿Cómo se despiden los químicos? Ácido un placer.",
  "¿Qué le dijo un pez a otro pez? ¡Nada, nada!",
  "¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro.",
  "¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.",
  "¿Qué le dijo el semáforo al coche? No me mires que me estoy cambiando.",
  "¿Qué hace una vaca cuando sale el sol? Sombra.",
  "¿Por qué los esqueletos no pelean entre ellos? Porque no tienen agallas.",
  "¿Cuál es el colmo de un sastre? Que le queden cortas las ideas.",
  "¿Qué le dijo un jaguar a otro? Jaguar you!",
  "¿Cómo se llama el café más peligroso del mundo? Ex-preso.",
  "¿Por qué los perros no usan reloj? Porque tienen pulgas.",
  "¿Qué le dijo una iguana a su hermana gemela? Somos iguana-les.",
  "¿Qué le dijo el cero al ocho? ¡Bonito cinturón!",
  "¿Por qué los pájaros no usan reloj? Porque vuelan en el tiempo.",
  "¿Qué le dijo un pez a otro? ¡Tanto tiempo sin verte!",
  "¿Cuál es el colmo de un electricista? Que le dé miedo la oscuridad.",
  "¿Qué le dijo la luna al sol? ¡Eres tan brillante!",
  "¿Qué hace una computadora cuando tiene frío? Se pone un byte.",
  "¿Por qué las plantas odian las matemáticas? Porque les da raíz cuadrada.",
  "¿Qué le dijo un árbol a otro? ¡Estamos enraizados en la amistad!",
  "¿Por qué las tortugas no juegan al fútbol? Porque son unos tortugazos.",
  "¿Qué le dijo una tortilla a otra tortilla? ¡Eres mi media naranja!",
  "¿Qué le dijo un teléfono móvil a otro? ¡Tengo batería para rato!",
  "¿Por qué el mar nunca se seca? Porque tiene una marea de agua.",
  "¿Qué le dijo un pez payaso a otro? ¡Eres muy divertido!",
  "¿Por qué el ordenador fue al doctor? Porque tenía un virus.",
  "¿Qué hace un pez cuando choca? ¡Nada!",
  "¿Por qué el tomate se puso rojo? Porque vio la ensalada.",
  "¿Cuál es el colmo de un peluquero? Cortar por lo sano.",
  "¿Qué le dijo el café al azúcar? Sin ti, soy amargo.",
  "¿Por qué las vacas usan campana? Porque suena mejor que el móvil.",
  "¿Qué le dijo un muro a otro? Nos vemos en la esquina.",
  "¿Qué le dijo un plátano a una gelatina? No tiembles, que soy yo.",
  "¿Por qué los fantasmas no mienten? Porque se transparentan.",
  "¿Qué le dijo un zapato a otro? Vamos a dar una vuelta.",
  "¿Qué le dijo el viento al árbol? ¡Eres muy sensible!",
  "¿Por qué el reloj está siempre feliz? Porque siempre da la hora.",
  "¿Qué le dijo un libro a otro? ¡Estoy lleno de historias!",
  "¿Qué hace un perro con un taladro? Taladrando.",
  "¿Por qué las arañas son malas para contar chistes? Porque son muy tela.",
  "¿Qué le dijo el océano a la playa? Nada, solo hizo una ola.",
  "¿Cuál es el colmo de un electricista? Que le dé miedo la oscuridad.",
  "¿Por qué el pollo cruzó la carretera? Para llegar al otro lado.",
  "¿Qué le dijo el pan al horno? ¡No me quemes!",
  "¿Qué le dijo el pez al mar? Gracias por tu compañía.",
  "¿Por qué la luna no sale de día? Porque es tímida.",
  "¿Qué hace una computadora en el gimnasio? Ejecuta programas.",
  "¿Qué le dijo un globo a otro? ¡Estoy lleno de aire!",
  "¿Por qué los gatos no hablan? Porque son muy misteriosos.",
  "¿Qué le dijo la cuchara al tenedor? Somos compañeros de mesa.",
  "¿Qué hace un pez cuando quiere jugar? Nada.",
  "¿Cuál es el colmo de un matemático? Perder la cuenta.",
  "¿Qué le dijo una guitarra a otra? ¡Eres mi nota perfecta!",
  "¿Por qué las plantas hablan poco? Porque son de hojas calladas.",
  "¿Qué le dijo un semáforo a otro? No me cambies.",
  "¿Qué le dijo un camaleón a otro? Cambiemos de color.",
  "¿Por qué los relojes son malos para correr? Porque siempre se detienen.",
  "¿Qué le dijo el papel a la tijera? ¡Me cortas el rollo!",
  "¿Qué le dijo el sol a la luna? Nos vemos en el amanecer.",
  "¿Por qué las estrellas no hacen ruido? Porque son silenciosas.",
  "¿Qué le dijo el gato a la gata? Eres muy gatuna.",
  "¿Qué hace un caracol en una autopista? Va lento pero seguro.",
  "¿Por qué los peces no usan internet? Porque no tienen red.",
  "¿Qué le dijo un oso a otro? Estoy oso de frío.",
  "¿Qué le dijo la nieve al sol? No me derritas.",
  "¿Por qué las ranas son buenas en matemáticas? Porque saben contar croac.",
  "¿Qué le dijo un árbol al hacha? No me cortes las ramas.",
  "¿Qué hace una abeja en el gimnasio? Zum-ba.",
  "¿Por qué los perros no usan reloj? Porque tienen pulgas.",
  "¿Qué le dijo el mar a la orilla? Te espero siempre.",
  "¿Qué le dijo un ratón a un gato? No me comas.",
  "¿Por qué el cielo es azul? Porque el sol se pone triste.",
  "¿Qué hace una flor cuando ve al sol? Sonríe.",
  "¿Por qué las hormigas no se pierden? Porque tienen GPS natural.",
  "¿Qué le dijo una nube a otra? Vamos a llover juntos.",
  "¿Por qué el cartero siempre está feliz? Porque entrega buenas noticias.",
  "¿Qué le dijo un pez a una sirena? Eres mi fantasía.",
  "¿Por qué las mariposas son tan bonitas? Porque son almas en colores.",
  "¿Qué le dijo una estrella fugaz a otra? Vamos a brillar juntos.",
  "¿Por qué las abejas trabajan tanto? Porque la miel no se hace sola.",
  "¿Qué le dijo un globo terráqueo a otro? Somos el mundo.",
  "¿Qué hace un oso polar en el desierto? Está perdido.",
  "¿Por qué los búhos son sabios? Porque escuchan en la oscuridad.",
  "¿Qué le dijo un tren a otro? Vamos en la misma vía.",
  "¿Por qué el fuego no puede mentir? Porque siempre arde la verdad.",
  "¿Qué le dijo un pez globo a otro? No te infles más.",
  "¿Por qué las serpientes no usan zapatos? Porque tienen pies de serpiente.",
  "¿Qué le dijo un cangrejo a otro? ¡Vamos para atrás!",
  "¿Por qué los árboles no usan celulares? Porque prefieren las raíces.",
  "¿Qué le dijo una vaca a otra? Estoy muuu feliz.",
  "¿Por qué el elefante nunca usa computadora? Porque le tiene miedo al ratón.",
  "¿Qué le dijo una guitarra a otra? ¡Tocamos juntos!",
  "¿Por qué los peces no hablan? Porque están debajo del agua.",
  "¿Qué le dijo una montaña a otra? ¡Somos grandes amigos!",
  "¿Por qué los tigres son tan buenos en matemáticas? Porque saben multiplicar.",
  "¿Qué hace un pulpo con un reloj? Da muchas horas.",
  "¿Por qué el oso nunca usa sombrero? Porque tiene la cabeza grande.",
  "¿Qué le dijo una estrella al sol? Brillas mucho.",
  "¿Por qué los leones no juegan a las cartas? Porque hay muchos tramposos.",
  "¿Qué le dijo un pato a otro? Estamos en el agua.",
  "¿Por qué los pájaros no usan paraguas? Porque vuelan sobre la lluvia.",
  "¿Qué le dijo un caracol a otro? Vamos lento pero seguro."
];
let ultimoIndice = -1;
const conocimientos = {
  "preguntar": "Este chat te sirve para encontrar las últimas noticias nacionales e internacionales, sismos y clima de hoy en Santiago",
  "sirve": "Este chat te sirve para encontrar las últimas noticias nacionales e internacionales, sismos y clima de hoy en Santiago",
  "hola": "Buenos días, desde este chat puede preguntar por los últimos sismos, noticias y clima",
  "chiste": () => {
    // Elegir un chiste aleatorio
     let indice;
    do {
      indice = Math.floor(Math.random() * chistes.length);
    } while (indice === ultimoIndice && chistes.length > 1); // evita repetir el mismo chiste

    ultimoIndice = indice;
    return chistes[indice];
  }
};

// Función para mostrar mensaje inicial
function mostrarMensajeInicial() {
 appendMessage("Asistente", "¡Hola! Soy tu asistente. Escribe lo que quieras saber, por ejemplo: clima en Santiago, noticias , últimos sismos o un chiste.");

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
async function handleUserInput() {
  const inputField = document.getElementById("user-input");
  if (!inputField) return;
  const pregunta = inputField.value.trim().toLowerCase();
  if (pregunta === "") return;
  appendMessage("Tú", pregunta);

  let respuesta = "No tengo información sobre eso ahora.";

  // 🔽 Normalizamos la pregunta sin acentos
  const preguntaNormalizada = pregunta.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (pregunta.includes("chiste")) {
    if (typeof conocimientos.chiste === "function") {
      respuesta = conocimientos.chiste();
    } else {
      respuesta = "No tengo chistes disponibles ahora.";
    }
  } else if (pregunta.includes("clima") || pregunta.includes("tiempo")) {
    const climaContenedor = document.getElementById("weather-container");
    let regionEncontrada = null;

    // Buscar si alguna región está en la pregunta
    for (const region of regiones) {
      const ciudad = region.split(",")[0];
      const ciudadNormalizada = ciudad.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (preguntaNormalizada.includes(ciudadNormalizada)) {
        regionEncontrada = ciudad;
        break;
      }
    }

    if (climaContenedor) {
      let divClima = null;

      if (regionEncontrada) {
        divClima = Array.from(climaContenedor.children).find(div =>
          div.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(regionEncontrada.toLowerCase())
        );
        respuesta = divClima
          ? divClima.innerText
          : `No tengo el clima de ${regionEncontrada} cargado aún.`;
      } else {
        // Si no detecta región, muestra Santiago
        divClima = Array.from(climaContenedor.children).find(div =>
          div.innerText.toLowerCase().includes("santiago")
        );
        respuesta = divClima
          ? divClima.innerText
          : "No tengo el clima de Santiago cargado aún.";
      }
    } else {
      respuesta = "No tengo información del clima disponible aún.";
    }

  } else if (pregunta.includes("internacionales") || pregunta.includes("noticias internacionales")) {
    if (noticiasInternacionales && noticiasInternacionales.length > 0) {
      const noticia = noticiasInternacionales[0];
      respuesta = `Última noticia internacional: <a href="${noticia.url || noticia.link}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">${noticia.title}</a>`;
    } else {
      respuesta = "No hay noticias internacionales disponibles aún.";
    }
  } else if (pregunta.includes("noticias")) {
    let noticiasMostrar = "";

    if (noticiasChile && noticiasChile.length > 0) {
      const noticiaChile = noticiasChile[0];
      noticiasMostrar += `Última noticia de Chile: <a href="${noticiaChile.url || noticiaChile.link}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">${noticiaChile.title}</a><br><br>`;
    } else {
      noticiasMostrar += "No hay noticias de Chile.<br><br>";
    }

    if (noticiasInternacionales && noticiasInternacionales.length > 0) {
      const noticiaInternacional = noticiasInternacionales[0];
      noticiasMostrar += `Última noticia internacional: <a href="${noticiaInternacional.url || noticiaInternacional.link}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">${noticiaInternacional.title}</a>`;
    } else {
      noticiasMostrar += "No hay noticias internacionales.";
    }

    respuesta = noticiasMostrar;

  } else if (pregunta.includes("sismo") || pregunta.includes("terremoto")) {
    const sismoDetalle = document.getElementById("ultimo-detalle");
    const ultimoMapa = document.getElementById("ultimo-mapa")?.querySelector("iframe");
    if (sismoDetalle && ultimoMapa) {
      const src = ultimoMapa.src;
      const coordsMatch = src.match(/q=([^&]*)/);
      const coords = coordsMatch ? coordsMatch[1] : null;
      const mapaLink = coords ? `https://maps.google.com/maps?q=${coords}` : null;
      respuesta = `Último sismo: ${sismoDetalle.innerText}` +
        (mapaLink ? ` <a href="${mapaLink}" target="_blank" style="color:#1DA1F2; text-decoration:underline;">Ver mapa</a>` : "");
    } else {
      respuesta = "No tengo datos del último sismo aún.";
    }
  } else {
    for (const clave in conocimientos) {
      if (pregunta.includes(clave)) {
        const valor = conocimientos[clave];
        if (typeof valor === "function") {
          respuesta = valor();
        } else {
          respuesta = valor;
        }
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




  // Opcional: cerrar  y abrir menú al hacer clic fuera
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



 // fecha y hora
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



//---------noticias-------

// Cargar todas las fuentes (noticias, clima, sismos)
async function cargarTodasLasFuentes() {
  const fuentesInternacionales = [
  // Español
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%3Fhl%3Des-419%26gl%3DUS%26ceid%3DUS%3Aes',
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Felpais.com%2Frss%2Ffeed%2Felpais%2Fportada.xml',
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.infobae.com%2Ffeed%2F',
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%3Fhl%3Des-419%26gl%3DCL%26ceid%3DCL%3Aes-419%26topic%3Dh',


  // Google News España
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%3Fhl%3Des%26gl%3DES%26ceid%3DES%3Aes',


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
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fapnews.com%2Fworld-news.rss',
   // Google News USA Inglés
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%3Fhl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen',

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
// Función para cargar noticias para chile

let noticiasChile = [];
let noticiasInternacionales = [];

// Función auxiliar para calcular tiempo transcurrido desde la publicación
// Función para calcular el tiempo transcurrido desde la fecha publicada
function formatearTiempoYHoraChile(pubDateStr) {
  const publicado = new Date(pubDateStr); // Se asume en UTC o ISO
  const ahoraChile = new Date().toLocaleString("en-US", { timeZone: "America/Santiago" });
  const ahora = new Date(ahoraChile); // Ahora, pero en Chile

  // Convertir la hora de publicación a hora Chile
  const publicadoChileStr = publicado.toLocaleString("en-US", { timeZone: "America/Santiago" });
  const publicadoChile = new Date(publicadoChileStr);

  let diffMs = ahora - publicadoChile;

  // Si la noticia es futura, mostramos "Publicado recientemente"
  if (diffMs < 0) {
    return `Publicado recientemente`;
  }

  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} min atrás | ${publicadoChile.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false })}`;

  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} h atrás | ${publicadoChile.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false })}`;

  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} días atrás | ${publicadoChile.toLocaleDateString('es-CL', { timeZone: 'America/Santiago' })}`;
}



// Función para cargar noticias locales o de una fuente única
async function cargarNoticias(apiUrl, contenedorId, limit = 10) {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = '';

    const items = data.articles || data.items || [];
    if (!items.length) {
      contenedor.innerHTML = '<p>No hay noticias disponibles.</p>';
      return;
    }

    items.sort((a, b) => new Date(b.publishedAt || b.pubDate) - new Date(a.publishedAt || a.pubDate));
    const noticiasRecientes = items.slice(0, limit);

    if (contenedorId === 'mundo-news') {
      noticiasInternacionales = noticiasRecientes;
    } else if (contenedorId === 'chile-news') {
      noticiasChile = noticiasRecientes;
      if (noticiasChile.length > 0) {
        const noticia = noticiasChile[0];
        mostrarAlertaNoticia(noticia.title, noticia.url || noticia.link);
      }
    }

    for (let i = 0; i < noticiasRecientes.length; i++) {
      const item = noticiasRecientes[i];
      const titulo = item.title || 'Sin título';
      const link = item.url || item.link || '#';
      const infoTiempo = formatearTiempoYHoraChile(item.publishedAt || item.pubDate);

      const div = document.createElement('div');
      div.className = 'news-item';
      if (i === 0) div.classList.add('ultima-noticia');

      div.innerHTML = `
        <div class="news-title">${titulo}</div>
        <div class="news-date">${infoTiempo}</div>
        <a href="${link}" target="_blank" class="btn-vermas">Ver más</a>
        <div class="d-flex justify-content-end">
          <span class="badge rounded-pill text-bg-dark">VIVO24® | Noticias</span>
        </div>
      `;
      contenedor.appendChild(div);
    }
  } catch (e) {
    console.error('Error cargando noticias:', e);
  }
}


// Función para cargar noticias de múltiples fuentes (internacionales)
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
      todasLasNoticias = todasLasNoticias.concat(items);
    } catch (e) {
      console.warn(`Error al cargar fuente: ${url}`, e);
    }
  }

  if (todasLasNoticias.length === 0) {
    contenedor.innerHTML = '<p>No hay noticias internacionales recientes disponibles.</p>';
    return;
  }

  todasLasNoticias.sort((a, b) => new Date(b.publishedAt || b.pubDate) - new Date(a.publishedAt || a.pubDate));
  const noticiasRecientes = todasLasNoticias.slice(0, limit);
  noticiasInternacionales = noticiasRecientes;

  if (noticiasRecientes.length > 0) {
    const noticia = noticiasRecientes[0];
    mostrarAlertaNoticia(noticia.title, noticia.url || noticia.link);
  }

  for (let i = 0; i < noticiasRecientes.length; i++) {
    const item = noticiasRecientes[i];
    const titulo = item.title || 'Sin título';
    const link = item.url || item.link || '#';
    const infoTiempo = formatearTiempoYHoraChile(item.publishedAt || item.pubDate);

    const div = document.createElement('div');
    div.className = 'news-item';
    if (i === 0) div.classList.add('ultima-noticia');

    div.innerHTML = `
      <div class="news-title">${titulo}</div>
      <div class="news-date">${infoTiempo}</div>
      <a href="${link}" target="_blank" class="btn-vermas">Ver más</a>
      <div class="d-flex justify-content-end">
        <span class="badge rounded-pill text-bg-dark">VIVO24® | Noticias</span>
      </div>
    `;
    contenedor.appendChild(div);
  }
}




// motrar alerta para noticias en chile
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



  // Cuando se haga click en el botón, recarga la página
    document.getElementById('btnActualizar').addEventListener('click', function() {
      location.reload();
    });




    

// Inicializar
cargarTodasLasFuentes();
// Actualizar cada 60 segundos




