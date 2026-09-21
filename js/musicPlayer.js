/* ==========================================================================
   Reproductor de Música Directo - Michael Jackson - Chicago
   ========================================================================== */

class CustomMusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.audioCtx = null;
    this.analyser = null;

    // Posibles rutas y nombres de archivo en Windows (incluyendo chicago.mp3.mp3)
    this.possibleSources = [
      "chicago.mp3.mp3",
      "chicago.mp3",
      "Chicago.mp3",
      "chicago.m4a",
      "chicago.wav",
      "audio/chicago.mp3"
    ];
    this.sourceIndex = 0;

    this.initElements();
    this.bindEvents();
    this.tryLoadNextSource();
  }

  initElements() {
    this.playBtn = document.getElementById('playPauseBtn');
    this.trackTitleEl = document.getElementById('trackTitle');
    this.trackArtistEl = document.getElementById('trackArtist');
    this.discArtEl = document.getElementById('discArt');
    this.vizCanvas = document.getElementById('visualizerCanvas');
    this.vizCtx = this.vizCanvas ? this.vizCanvas.getContext('2d') : null;
  }

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.playBtn) this.playBtn.innerHTML = '▶';
      if (this.discArtEl) this.discArtEl.classList.remove('playing');
    });

    this.audio.addEventListener('error', () => {
      // Si falla una ruta, probar la siguiente variante de nombre de archivo
      this.sourceIndex++;
      if (this.sourceIndex < this.possibleSources.length) {
        this.tryLoadNextSource();
      } else {
        if (this.trackTitleEl) {
          this.trackTitleEl.textContent = "Chicago (Haz clic para reproducir)";
        }
      }
    });

    this.audio.addEventListener('canplaythrough', () => {
      if (this.trackTitleEl) {
        this.trackTitleEl.textContent = "Chicago";
      }
    });
  }

  tryLoadNextSource() {
    if (this.sourceIndex < this.possibleSources.length) {
      this.audio.src = this.possibleSources[this.sourceIndex];
      this.audio.load();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      if (this.playBtn) this.playBtn.innerHTML = '▶';
      if (this.discArtEl) this.discArtEl.classList.remove('playing');
    } else {
      // Intentar reproducir el archivo de audio
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          if (this.playBtn) this.playBtn.innerHTML = '❚❚';
          if (this.discArtEl) this.discArtEl.classList.add('playing');
        }).catch(err => {
          console.warn("Intento de reproducción local:", err);
          // Si por alguna razón el navegador requiere re-cargar la fuente:
          this.audio.play();
          this.isPlaying = true;
          if (this.playBtn) this.playBtn.innerHTML = '❚❚';
          if (this.discArtEl) this.discArtEl.classList.add('playing');
        });
      }
    }
  }
}

// Global handle
window.musicPlayer = null;
document.addEventListener('DOMContentLoaded', () => {
  window.musicPlayer = new CustomMusicPlayer();
});
