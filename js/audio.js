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

    // Mechanical soft wooden/felt click (warm and satisfying, not harsh)
    function playTick(pitchMultiplier = 1) {
        if (isMuted) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            // Lowpass filter removes any piercing high frequencies
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);

            // Sine wave starting with a quick gentle transient drop (210Hz -> 55Hz)
            osc.type = 'sine';
            const baseFreq = (200 + Math.random() * 25) * pitchMultiplier;
            osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.025);

            // Soft volume envelope: gentle tactile click
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.03);
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
