// Web Audio API Sound Effects (Zero external MP3 dependencies)
(function() {
    let audioCtx = null;
    let isMuted = localStorage.getItem('dilans_muted') === 'true';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function getMuteState() {
        return isMuted;
    }

    function toggleMute() {
        isMuted = !isMuted;
        localStorage.setItem('dilans_muted', isMuted);
        return isMuted;
    }

    // Mechanical roulette/slot tick
    function playTick(pitchMultiplier = 1) {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            const freq = (380 + Math.random() * 40) * pitchMultiplier;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {
            console.warn('Audio tick error', e);
        }
    }

    // Victory / Winner Fanfare
    function playWin() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
            notes.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

                gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
                gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.1 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.5);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + index * 0.1);
                osc.stop(ctx.currentTime + index * 0.1 + 0.55);
            });
        } catch (e) {
            console.warn('Audio win error', e);
        }
    }

    // Beer Bong Chug / Gulp Sound
    function playBeerBong() {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            // Fast gulp sequence
            const gulps = [220, 180, 260, 200];
            gulps.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                const startTime = ctx.currentTime + idx * 0.11;
                osc.frequency.setValueAtTime(freq, startTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.08);

                gain.gain.setValueAtTime(0.25, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.1);
            });
        } catch (e) {
            console.warn('Audio beerbong error', e);
        }
    }

    window.DilanAudio = {
        getMuteState,
        toggleMute,
        playTick,
        playWin,
        playBeerBong
    };
})();
