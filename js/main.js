/* ==========================================================================
   Lógica Principal de Interacción - Max Verstappen + Chicago MJ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const maxCharacter = document.getElementById('maxVerstappenChar');
  const speechBubble = document.getElementById('speechBubble');

  // Interactive Max Verstappen Click Effect
  if (maxCharacter) {
    maxCharacter.addEventListener('click', () => {
      triggerMaxVictoryEffect();
    });
  }

  function triggerMaxVictoryEffect() {
    playF1Roar();
    
    // Animate speech bubble pulse
    if (speechBubble) {
      speechBubble.style.transform = 'scale(1.08) translateY(-6px)';
      speechBubble.style.borderColor = '#ffd700';
      setTimeout(() => {
        speechBubble.style.transform = 'scale(1) translateY(0)';
      }, 350);
    }
  }

  function playF1Roar() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.85);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {
      console.log("Audio notice", e);
    }
  }
});
