import './style.css'

// Document Ready
document.addEventListener('DOMContentLoaded', () => {

    // Smooth Fade-in on Scroll (GSAP)
    gsap.registerPlugin(ScrollTrigger);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleClass: "visible",
                once: true
            }
        });
    });

    // Background Music Control
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    let isPlaying = false;

    const attemptPlay = () => {
        bgMusic.play().then(() => {
            isPlaying = true;
            muteBtn.textContent = '🎵';
        }).catch(err => {
            console.log("Autoplay blocked, waiting for interaction.");
        });
    };

    // Attempt to autoplay immediately
    attemptPlay();

    // Setup global listener to play music on first interaction if autoplay failed
    const startMusicOnInteract = () => {
        if (!isPlaying) {
            attemptPlay();
        }
        document.body.removeEventListener('click', startMusicOnInteract);
        document.body.removeEventListener('touchstart', startMusicOnInteract);
    };

    document.body.addEventListener('click', startMusicOnInteract);
    document.body.addEventListener('touchstart', startMusicOnInteract);

    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering body interaction event
        if (isPlaying) {
            bgMusic.pause();
            muteBtn.textContent = '🔇';
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            muteBtn.textContent = '🎵';
        }
        isPlaying = !isPlaying;
    });

    // 1. Hero Touch Button
    const touchBtn = document.getElementById('touch-me-btn');
    touchBtn.addEventListener('click', () => {
        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }

        touchBtn.innerHTML = "Imagine this is my hand holding yours right now… <br>🤍";
        touchBtn.style.fontSize = "1.2rem";

        // Scroll to next section smoothly
        setTimeout(() => {
            document.getElementById('virtual-touch').scrollIntoView({ behavior: 'smooth' });
            // Autoplay music on first interaction
            if (!isPlaying) muteBtn.click();
        }, 3000);
    });

    // Floating Hearts Animation (Hero Section)
    const floatContainer = document.getElementById('floating-hearts');
    function createHeart() {
        const heart = document.createElement('div');
        heart.innerHTML = '🤍';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
        heart.style.opacity = Math.random() * 0.5 + 0.2;
        heart.style.transition = 'top 4s linear, opacity 4s linear';
        heart.style.zIndex = -1;
        floatContainer.appendChild(heart);

        // Animate up
        setTimeout(() => {
            heart.style.top = '-10vh';
            heart.style.opacity = '0';
        }, 100);

        // Remove from DOM
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }
    setInterval(createHeart, 800);

    // 2. Virtual Touch Interactions

    // Heartbeat
    const heartbeatBtn = document.getElementById('heartbeat-btn');
    const heartbeatMsg = document.getElementById('heartbeat-msg');
    const heartbeatSound = document.getElementById('heartbeat-sound');

    heartbeatBtn.addEventListener('click', () => {
        heartbeatBtn.classList.add('pulse-animation');
        heartbeatMsg.classList.add('show');

        // Play heartbeat audio and increase its volume
        heartbeatSound.volume = 1.0;
        heartbeatSound.currentTime = 0; // reset if clicked rapidly
        heartbeatSound.play().catch(e => console.log('Heartbeat audio failed', e));

        // Slightly lower bg-music so she can hear the heartbeat
        if (isPlaying) {
            bgMusic.volume = 0.2;
        }

        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);

        setTimeout(() => {
            heartbeatBtn.classList.remove('pulse-animation');
            if (isPlaying) {
                bgMusic.volume = 1.0; // Restore bg-music volume
            }
        }, 3000);
    });

    // Virtual Hug
    const hugBtn = document.getElementById('hug-btn');
    const hugMsg = document.getElementById('hug-msg');

    hugBtn.addEventListener('click', () => {
        // Simple animation text replacing button
        hugBtn.style.display = 'none';
        hugMsg.style.display = 'block';
        hugMsg.classList.add('show');

        // You could add a more complex GSAP arm animation here wrapper in #hug-animation-container
        const hugAnim = document.getElementById('hug-animation-container');
        hugAnim.innerHTML = "<div style='font-size:4rem'>🤗</div>";
        gsap.fromTo(hugAnim, { scale: 0.5, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 1, yoyo: true, repeat: 1 });

        setTimeout(() => {
            hugBtn.style.display = 'inline-block';
            hugAnim.innerHTML = "";
            hugMsg.classList.remove('show');
        }, 4000);
    });

    // Hand on Screen
    const handContainer = document.querySelector('.hand-silhouette-container');
    const handMsg = document.getElementById('hand-msg');

    handContainer.addEventListener('mousedown', showHandMsg);
    handContainer.addEventListener('touchstart', showHandMsg);

    function showHandMsg(e) {
        e.preventDefault(); // Prevent default mobile behavior like context menu
        handMsg.classList.add('show');
        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            handMsg.classList.remove('show');
        }, 3000);
    }

    // 3. Love Letter Typewriter
    const letterText = `I know it hurts when you miss my touch…\nI know you wish I was there to hold you tight…\nBut listen to me…\nEvery second we survive this distance,\nwe are building a love story stronger than miles.\n\nYours always.`;
    const typeWriterEl = document.getElementById('typewriter-letter');

    // Use GSAP ScrollTrigger to start typing when visible
    ScrollTrigger.create({
        trigger: "#love-letter",
        start: "top center",
        once: true,
        onEnter: () => typeText(letterText, typeWriterEl, 50)
    });

    function typeText(text, element, speed) {
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    }

    // 4. Future Countdown — set your real reunion/meetup date here!
    // Format: new Date('YYYY-MM-DDTHH:MM:SS') — change this to your actual date 💛
    const countdownDate = new Date('2026-06-01T00:00:00');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance <= 0) {
            // Countdown reached! Show celebration message
            document.getElementById('countdown').innerHTML = "<p style='font-size:1.5rem;color:#ffc2d1;'>The wait is finally over! 🎉</p>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 5. Final Surprise Modal & Confetti
    const finalBtn = document.getElementById('final-btn');
    const finalModal = document.getElementById('final-modal');
    const closeModal = document.querySelector('.close-modal');

    finalBtn.addEventListener('click', () => {
        finalModal.style.display = 'flex';
        // Trigger Canvas Confetti
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ffc2d1', '#e2d1f9', '#ffffff', '#ff6f91']
        });
    });

    closeModal.addEventListener('click', () => {
        finalModal.style.display = 'none';
    });

});
