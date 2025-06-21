

let lastKnownEarthquakeTime = null;

async function fetchEarthquakes() {
  try {
    const response = await fetch('https://api.boostr.cl/earthquakes/recent.json', {
      method: 'GET',
      headers: { accept: 'application/json' }
    });
    const res = await response.json();
    const earthquakes = res.data;

    if (!earthquakes || earthquakes.length === 0) {
      console.log("No hay sismos recientes.");
      return;
    }

    // Convertimos fecha+hora a objeto Date para cada sismo
    earthquakes.forEach(q => {
      q.datetime = new Date(`${q.date}T${q.hour}`);
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const filteredQuakes = earthquakes.filter(q => q.datetime >= oneDayAgo);

    // Ordenamos por fecha descendente para el último sismo
    const sortedByDate = [...filteredQuakes].sort((a, b) => b.datetime - a.datetime);
    const latest = sortedByDate[0];

    // Ordenamos por magnitud descendente para el sismo más fuerte
    const sortedByMag = [...filteredQuakes].sort((a, b) => parseFloat(b.magnitude) - parseFloat(a.magnitude));
    const strongest = sortedByMag[0];

    // Sonido solo si hay nuevo sismo
   if (!lastKnownEarthquakeTime || lastKnownEarthquakeTime !== latest.datetime.toISOString()) {
  const alertSound = document.getElementById('alertSound');
  alertSound.volume = 0.05; // volumen al 20%
  alertSound.play();
}
    lastKnownEarthquakeTime = latest.datetime.toISOString();

    // Mostrar último sismo
    document.getElementById('alert-content').innerHTML = `${latest.date} ${latest.hour} - Magnitud ${latest.magnitude} en ${latest.place}`;
    document.getElementById('earthquake-alert').style.display = 'block';

    document.getElementById('map-container').innerHTML = `
      <iframe width="100%" height="220" frameborder="0"
        src="https://maps.google.com/maps?q=${latest.latitude},${latest.longitude}&z=5&output=embed"></iframe>`;

    // Mostrar sismo más fuerte (top 1)
    document.getElementById('top1-quake-content').innerHTML = `
      ${strongest.date} ${strongest.hour} - Magnitud ${strongest.magnitude} en ${strongest.place}`;
    document.getElementById('top1-map-container').innerHTML = `
      <iframe width="100%" height="220" frameborder="0"
        src="https://maps.google.com/maps?q=${strongest.latitude},${strongest.longitude}&z=7&output=embed" allowfullscreen></iframe>`;
    document.getElementById('top1-quake-alert').style.display = 'block';

    // Mostrar Top 3 sismos (por magnitud)
    const topThree = sortedByMag.slice(0, 3);
    const colors = ['red', 'yellow', 'green'];
    document.getElementById('top-quakes').innerHTML = topThree.map((q, i) => `
      <div class="quake-box ${colors[i]}">
        <div><strong>Top ${i+1}</strong></div>
        <div>Mag: ${q.magnitude}</div>
        <div>${q.place}</div>
        <div style="font-size:0.8rem;">${q.date} ${q.hour}</div>
      </div>`).join('');

    // Probabilidad avanzada simplificada:
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const recentQuakes = sortedByDate.filter(q => q.datetime >= fourHoursAgo);
    const cant = recentQuakes.length;
    let probFinal = cant * 10;
    probFinal = Math.min(probFinal, 100);

    if (probFinal >= 70) {
      document.getElementById('zona-caliente').style.display = 'block';
      document.getElementById('zona-caliente').textContent = `Zona caliente: ${strongest.place}`;
    } else {
      document.getElementById('zona-caliente').style.display = 'none';
    }

    // Tabla
    let tableHtml = `<table><thead><tr><th>Fecha</th><th>Hora</th><th>Mag</th><th>Prof (km)</th><th>Ubicación</th></tr></thead><tbody>`;
    sortedByDate.forEach((q, index) => {
      let rowClass = '';
      if (index === 0) rowClass = 'highlight-last';
      const mag = parseFloat(q.magnitude);
      if (mag >= 5) rowClass += ' high-mag';
      else if (mag >= 3) rowClass += ' mid-mag';
      else rowClass += ' low-mag';
      tableHtml += `<tr class="${rowClass.trim()}">
        <td>${q.date}</td>
        <td>${q.hour}</td>
        <td>${mag.toFixed(1)}</td>
        <td>${q.depth}</td>
        <td><a href="${q.info}" target="_blank">${q.place}</a></td>
      </tr>`;
    });
    tableHtml += `</tbody></table>`;
    document.getElementById('earthquakes-table').innerHTML = tableHtml;

    document.getElementById('last-update').textContent = `Actualizado: ${new Date().toLocaleString()}`;

  } catch (err) {
    console.error('Error al obtener datos:', err);
  }
}




function cargarNoticias() {
    const rssFeedUrl = 'https://news.google.com/rss/search?q=sismo+chile';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const contenedor = document.getElementById('rss-news');
        contenedor.innerHTML = ''; // Limpia para recargar

        // Ordenamos los items de más reciente a más antiguo
        data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        data.items.forEach(item => {
          const noticia = document.createElement('div');
          noticia.style.marginBottom = '1rem';
          noticia.innerHTML = `
            <a href="${item.link}" target="_blank" style="color:#00e6f6; font-weight:700;">${item.title}</a>
            <div style="font-size:0.8rem; color:#00b8ff;">${new Date(item.pubDate).toLocaleString()}</div>
          `;
          contenedor.appendChild(noticia);
        });
      })
      .catch(error => console.error('Error al cargar RSS:', error));
}

      const menuButton = document.getElementById('menu-button');
    const menu = document.getElementById('menu');

    menuButton.addEventListener('click', () => {
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
      } else {
        menu.style.display = 'block';
      }
    });

    // Cerrar menú si clic fuera de él
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== menuButton) {
        menu.style.display = 'none';
      }
    });
cargarNoticias();
fetchEarthquakes();
setInterval(fetchEarthquakes, 30000);
