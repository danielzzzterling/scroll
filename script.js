const videos = Array.from(document.querySelectorAll('video.layer'));
const fade = document.getElementById('fade');
const heartPath = document.getElementById('heartPath');
const textCenter = document.getElementById('textCenter');
const spacer = document.getElementById('spacer');

const layers = Array.from(document.querySelectorAll('.layer'));
let heartLength = 0;
const message = 'Te amo con toda mi vida, Mariana, por siempre y para siempre.';

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function setOpacity(el, value) {
  el.style.opacity = value.toFixed(3);
}

async function prepareVideos() {
  for (const v of videos) {
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
  }

  try {
    await Promise.all(videos.map(v => v.play()));
  } catch {
    // Autoplay might be blocked until user scrolls/taps.
  }
}

function onScroll() {
  const doc = document.documentElement;
  const body = document.body;
  const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
  const scrollHeight = Math.max(body.scrollHeight, doc.scrollHeight);
  const maxScroll = Math.max(0, scrollHeight - window.innerHeight);

  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  const segmentCount = layers.length - 1;
  const segment = clamp(progress * segmentCount, 0, segmentCount);

  const index = Math.floor(segment);
  const t = segment - index;

  layers.forEach((layer, i) => {
    if (i === index) {
      setOpacity(layer, 1 - t);
    } else if (i === index + 1) {
      setOpacity(layer, t);
    } else {
      setOpacity(layer, 0);
    }
  });

  if (heartPath && heartLength > 0) {
    const draw = clamp(progress, 0, 1);
    const offset = heartLength * (1 - draw);
    heartPath.style.strokeDashoffset = offset.toFixed(2);
  }

  if (textCenter) {
    const count = Math.max(1, Math.round(message.length * clamp(progress, 0, 1)));
    textCenter.textContent = message.slice(0, count);
  }
}

function startFadeIn() {
  requestAnimationFrame(() => {
    fade.style.opacity = '0';
  });
}

function forceFadeOut() {
  fade.style.opacity = '0';
  setTimeout(() => {
    fade.style.display = 'none';
  }, 1600);
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(onScroll);
  forceFadeOut();
});

window.addEventListener('DOMContentLoaded', () => {
  if (spacer) {
    spacer.style.height = `${layers.length * 100}vh`;
  }

  prepareVideos();
  onScroll();
  startFadeIn();
  setTimeout(forceFadeOut, 1800);

  if (heartPath) {
    heartLength = heartPath.getTotalLength();
    heartPath.style.strokeDasharray = `${heartLength}`;
    heartPath.style.strokeDashoffset = `${heartLength}`;
  }
});

window.addEventListener('resize', onScroll);

