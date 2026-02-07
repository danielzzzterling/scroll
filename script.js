const videos = [
  document.getElementById('v1'),
  document.getElementById('v2'),
  document.getElementById('v3'),
];
const image = document.getElementById('img1');
const fade = document.getElementById('fade');

const layers = [...videos, image];

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
}

function startFadeIn() {
  requestAnimationFrame(() => {
    fade.style.opacity = '0';
  });
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(onScroll);
});

window.addEventListener('load', () => {
  prepareVideos();
  onScroll();
  startFadeIn();
});

window.addEventListener('resize', onScroll);
