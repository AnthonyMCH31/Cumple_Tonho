document.addEventListener("DOMContentLoaded", () => {
  // 1. Leer el parámetro ?nombre= de la URL
  const params = new URLSearchParams(window.location.search);
  const nombre = params.get("nombre");

  if (nombre) {
    document.querySelectorAll(".nombre-invitado").forEach(el => {
      el.textContent = nombre;
    });
    document.title = `¡Hola ${nombre}! Tengo algo que decirte...`;
  }

  // 2. Botón de confirmación con tu número de Costa Rica (8779-4540)
  const miNumero = "50687794540";
  const mensajeWhatsApp = encodeURIComponent(
    `¡Hola Toño! Soy ${nombre || "yo"}, ¡cuenta conmigo para celebrar tu cumple el lunes 21 de diciembre a las 9:00 a. m.! 💜🎂`
  );
  document.getElementById("btn-confirmar").href = `https://wa.me/${miNumero}?text=${mensajeWhatsApp}`;

  // 3. "Feliz Cumpleaños" en piano suave
  let audioCtx = null;
  let musicaActiva = false;
  let loopTimeout = null;

  // Melodía de "Feliz Cumpleaños" en Do mayor (frecuencia en Hz, duración en seg, pausa tras la nota)
  const felizCumplePiano = [
    // "Cum-plea-ños fe-liz"
    { freq: 392.00, dur: 0.42, pausa: 0.36 }, // G4 (Cum-)
    { freq: 392.00, dur: 0.35, pausa: 0.24 }, // G4 (-plea-)
    { freq: 440.00, dur: 0.75, pausa: 0.62 }, // A4 (-ños)
    { freq: 392.00, dur: 0.75, pausa: 0.62 }, // G4 (fe-)
    { freq: 523.25, dur: 0.75, pausa: 0.62 }, // C5 (-liz)
    { freq: 493.88, dur: 1.35, pausa: 1.15 }, // B4 (alargado)

    // "Cum-plea-ños fe-liz"
    { freq: 392.00, dur: 0.42, pausa: 0.36 }, // G4
    { freq: 392.00, dur: 0.35, pausa: 0.24 }, // G4
    { freq: 440.00, dur: 0.75, pausa: 0.62 }, // A4
    { freq: 392.00, dur: 0.75, pausa: 0.62 }, // G4
    { freq: 587.33, dur: 0.75, pausa: 0.62 }, // D5
    { freq: 523.25, dur: 1.35, pausa: 1.15 }, // C5 (alargado)

    // "Cum-plea-ños que-ri-do [Nombre]"
    { freq: 392.00, dur: 0.42, pausa: 0.36 }, // G4
    { freq: 392.00, dur: 0.35, pausa: 0.24 }, // G4
    { freq: 783.99, dur: 0.75, pausa: 0.62 }, // G5 (alto)
    { freq: 659.25, dur: 0.75, pausa: 0.62 }, // E5
    { freq: 523.25, dur: 0.75, pausa: 0.62 }, // C5
    { freq: 493.88, dur: 0.75, pausa: 0.62 }, // B4
    { freq: 440.00, dur: 1.25, pausa: 1.05 }, // A4

    // "Cum-plea-ños fe-liz"
    { freq: 698.46, dur: 0.42, pausa: 0.36 }, // F5
    { freq: 698.46, dur: 0.35, pausa: 0.24 }, // F5
    { freq: 659.25, dur: 0.75, pausa: 0.62 }, // E5
    { freq: 523.25, dur: 0.75, pausa: 0.62 }, // C5
    { freq: 587.33, dur: 0.75, pausa: 0.62 }, // D5
    { freq: 523.25, dur: 1.60, pausa: 1.45 }  // C5 (cierre suave)
  ];

  function tocarNotaPiano(freq, dur) {
    if (!audioCtx || !musicaActiva) return;

    const ahora = audioCtx.currentTime;
    const fundamental = audioCtx.createOscillator();
    const armonico = audioCtx.createOscillator();
    const gananciaArmonico = audioCtx.createGain();
    const filtro = audioCtx.createBiquadFilter();
    const envolvente = audioCtx.createGain();

    fundamental.type = "triangle";
    fundamental.frequency.setValueAtTime(freq, ahora);

    armonico.type = "sine";
    armonico.frequency.setValueAtTime(freq * 2, ahora);
    gananciaArmonico.gain.setValueAtTime(0.22, ahora);

    filtro.type = "lowpass";
    filtro.frequency.setValueAtTime(1600, ahora);
    filtro.Q.setValueAtTime(0.8, ahora);

    envolvente.gain.setValueAtTime(0.0001, ahora);
    envolvente.gain.linearRampToValueAtTime(0.11, ahora + 0.035);
    envolvente.gain.exponentialRampToValueAtTime(0.0001, ahora + dur);

    fundamental.connect(filtro);
    armonico.connect(gananciaArmonico);
    gananciaArmonico.connect(filtro);
    filtro.connect(envolvente);
    envolvente.connect(audioCtx.destination);

    fundamental.start(ahora);
    armonico.start(ahora);
    fundamental.stop(ahora + dur + 0.05);
    armonico.stop(ahora + dur + 0.05);
  }

  function reproducirFelizCumple() {
    if (!musicaActiva) return;

    let acumulado = 0;
    felizCumplePiano.forEach((nota) => {
      setTimeout(() => {
        if (musicaActiva) {
          tocarNotaPiano(nota.freq, nota.dur);
        }
      }, acumulado * 1000);
      acumulado += nota.pausa;
    });

    loopTimeout = setTimeout(reproducirFelizCumple, acumulado * 1000 + 1400);
  }

  function iniciarMusica() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    musicaActiva = true;
    actualizarBotonMusica();

    clearTimeout(loopTimeout);
    reproducirFelizCumple();
  }

  function detenerMusica() {
    musicaActiva = false;
    clearTimeout(loopTimeout);
    actualizarBotonMusica();
  }

  function actualizarBotonMusica() {
    const btnMusica = document.getElementById("btn-musica");
    if (!btnMusica) return;
    btnMusica.textContent = musicaActiva ? "🎹 Feliz Cumple ON" : "🔇 Música OFF";
  }

  document.getElementById("btn-musica").addEventListener("click", () => {
    if (musicaActiva) {
      detenerMusica();
    } else {
      iniciarMusica();
    }
  });

  // 4. Lluvia intensa de confeti al abrir la invitación
  function lanzarConfetiCelebracion() {
    const colores = ["#fde047", "#f43f5e", "#38bdf8", "#a855f7", "#22c55e", "#fb923c"];

    confetti({
      particleCount: 170,
      spread: 105,
      origin: { y: 0.55 },
      colors: colores
    });

    const duracion = 4200;
    const fin = Date.now() + duracion;

    const rafaga = setInterval(() => {
      if (Date.now() > fin) {
        clearInterval(rafaga);
        return;
      }

      confetti({
        particleCount: 38,
        angle: 60,
        spread: 68,
        origin: { x: 0, y: 0.65 },
        colors: colores
      });

      confetti({
        particleCount: 38,
        angle: 120,
        spread: 68,
        origin: { x: 1, y: 0.65 },
        colors: colores
      });
    }, 250);
  }

  // 5. Transición suave de entrada a tarjeta
  const btnAbrir = document.getElementById("btn-abrir");
  const pantallaIntro = document.getElementById("pantalla-intro");
  const pantallaTarjeta = document.getElementById("pantalla-tarjeta");
  const tarjetaContenedor = document.querySelector(".tarjeta-contenedor");

  btnAbrir.addEventListener("click", () => {
    pantallaIntro.classList.add("saliendo");
    iniciarMusica();

    setTimeout(() => {
      pantallaIntro.classList.add("oculta");
      pantallaIntro.classList.remove("activa", "saliendo");

      pantallaTarjeta.classList.remove("oculta");
      pantallaTarjeta.classList.add("activa");

      tarjetaContenedor.classList.remove("tarjeta-entrada");
      void tarjetaContenedor.offsetWidth;
      tarjetaContenedor.classList.add("tarjeta-entrada");

      lanzarConfetiCelebracion();
    }, 550);
  });
});