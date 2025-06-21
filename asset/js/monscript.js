
    let earthquakeChart, lastKnownEarthquakeId = null;
    let timer = 0;
    let timerInterval = null;

    function startTimer() {
      clearInterval(timerInterval);
      timer = 0;
      document.getElementById('timer').textContent = `Segundos desde última actualización: ${timer}s`;
      timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = `Segundos desde última actualización: ${timer}s`;
        if (timer >= 30) timer = 0;
      }, 1000);
    }

    async function fetchEarthquakes() {
      try {
        startTimer();
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const data = await response.json();

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const quakes = data.features.filter(q => new Date(q.properties.time) >= oneDayAgo)
                                    .sort((a,b)=>b.properties.time - a.properties.time);
        if (!quakes.length) return;

      const latest = quakes[0];
if (lastKnownEarthquakeId !== latest.id) {
  const alertSound = document.getElementById('alertSound');
  alertSound.volume = 0.05; // volumen al 20%
  alertSound.play();
}
        lastKnownEarthquakeId = latest.id;

        document.getElementById('last-update').textContent = `Actualizado: ${now.toLocaleString()}`;
        document.getElementById('alert-content').innerHTML =
          `${new Date(latest.properties.time).toLocaleTimeString()} - Mag ${latest.properties.mag} en ${latest.properties.place}`;
        document.getElementById('earthquake-alert').style.display = 'block';

        const [lng, lat] = latest.geometry.coordinates;
        document.getElementById('map-container').innerHTML = `
          <iframe width="100%" height="220" frameborder="0"
            src="https://maps.google.com/maps?q=${lat},${lng}&z=5&output=embed"></iframe>`;

        // TOP 3
        const top3 = [...quakes].sort((a,b)=>b.properties.mag - a.properties.mag).slice(0,3);

        // MOSTRAR CUADRO TOP 1
        const top1 = top3[0];
        document.getElementById('top1-quake-content').innerHTML =
          `${new Date(top1.properties.time).toLocaleTimeString()} - Mag ${top1.properties.mag} en ${top1.properties.place}`;
        document.getElementById('top1-quake-alert').style.display = 'block';
        const [topLng, topLat] = top1.geometry.coordinates;
        document.getElementById('top1-map-container').innerHTML = `
          <iframe width="100%" height="220" frameborder="0"
            src="https://maps.google.com/maps?q=${topLat},${topLng}&z=5&output=embed"></iframe>`;

        document.getElementById('top-quakes').innerHTML = top3.map((q,i)=>`
          <div class="quake-box ${['red','yellow','green'][i]}">
            <div><strong>Top ${i+1}</strong></div>
            <div>Mag: ${q.properties.mag}</div>
            <div>${q.properties.place}</div>
            <div style="font-size:.8rem;">${new Date(q.properties.time).toLocaleString()}</div>
          </div>`).join('');

        // TABLA
        let html = `<table><thead><tr><th>Fecha</th><th>Mag</th><th>Prof(km)</th><th>Ubicación</th></tr></thead><tbody>`;
        quakes.forEach((q,i)=>{
          let cls = i===0?'highlight-last':'';
          const m = q.properties.mag;
          cls += m>=5?' high-mag':m>=3?' mid-mag':' low-mag';
          html+= `<tr class="${cls.trim()}">
            <td>${new Date(q.properties.time).toLocaleString()}</td>
            <td>${m.toFixed(1)}</td>
            <td>${q.geometry.coordinates[2].toFixed(1)}</td>
            <td><a href="https://www.google.com/maps/search/?api=1&query=${q.geometry.coordinates[1]},${q.geometry.coordinates[0]}" target="_blank">${q.properties.place}</a></td>
          </tr>`;
        });
        html += `</tbody></table>`;
        document.getElementById('earthquakes-table').innerHTML = html;

      } catch(err) {
        console.error('Error:', err);
      }
    }

    function cargarNoticias() {
      const rssFeedUrl = 'https://news.google.com/rss/search?q=sismo&hl=es&gl=US&ceid=US:es';
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const contenedor = document.getElementById('rss-news');
          contenedor.innerHTML = '';
          data.items.sort((a,b)=> new Date(b.pubDate)-new Date(a.pubDate));
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

  window.addEventListener('load', function () {
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      splash.style.display = 'none';
    }, 3000); // 3 segundos
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

    // Cerrar menú si clic fuera de él
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== menuButton) {
        menu.style.display = 'none';
      }
    });

//simo chile






    cargarNoticias();
    fetchEarthquakes();
    setInterval(fetchEarthquakes, 10000);
    setInterval(cargarNoticias, 10000);
