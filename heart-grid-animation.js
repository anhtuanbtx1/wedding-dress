(() => {
  const images = [
    './wwwroot/wp-content/pic/album1.webp',
    './wwwroot/wp-content/pic/album2.webp',
    './wwwroot/wp-content/pic/album3.webp',
    './wwwroot/wp-content/pic/album4.webp',
    './wwwroot/wp-content/pic/album5.webp',
    './wwwroot/wp-content/pic/album6.webp',
    './wwwroot/wp-content/pic/album7.webp',
    './wwwroot/wp-content/pic/album8.webp',
    './wwwroot/wp-content/pic/wedding1.webp',
    './wwwroot/wp-content/pic/damcuoi.webp',
    './wwwroot/wp-content/pic/damcuoi1.webp',
    './wwwroot/wp-content/pic/end.webp',
    './wwwroot/wp-content/pic/timeline1.webp',
    './wwwroot/wp-content/pic/timeline2.webp',
    './wwwroot/wp-content/pic/timeline3.webp',
    './wwwroot/wp-content/pic/timeline5.webp',
    './wwwroot/wp-content/pic/timeline6.webp',
    './wwwroot/wp-content/pic/timeline7.webp',
    './wwwroot/wp-content/pic/avatar_bride.webp',
    './wwwroot/wp-content/pic/avatar_groom.webp',
    './wwwroot/wp-content/pic/wedding_invitation.webp',
    './wwwroot/wp-content/pic/mylove.webp',
    './wwwroot/wp-content/pic/antoi.webp',
    './wwwroot/wp-content/pic/huyentran.webp',
  ];

  const container = document.getElementById('heart-grid');
  if (!container) return;

  const cards = [];
  const count = Math.min(images.length, 24);
  const size = 520;
  const center = size / 2;
  
  // Responsive adjust
  const isMobile = window.innerWidth <= 768;
  const heartScale = isMobile ? 8.5 : 12.5;

  // Base 3D points in heart shape
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = (Math.PI * 2 * i) / count;
    // Parametric heart formula
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    // We add depth Z to map it onto a 3D volume (inflated heart)
    // Z will be thicker in the middle, thin at the edges
    const z = (Math.random() - 0.5) * 12; 
    
    points.push({
      x: x * heartScale,
      y: y * heartScale,
      z: z * heartScale
    });
  }

  // Create card DOM elements
  points.forEach((pt, i) => {
    const img = document.createElement('img');
    img.src = images[i % images.length];
    img.alt = `Heart photo ${i + 1}`;
    img.className = 'heart-card';
    img.style.left = `${center}px`;
    img.style.top = `${center}px`;
    img.loading = i < 4 ? 'eager' : 'lazy';
    img.decoding = 'async';
    
    img.addEventListener('click', () => {
      const full = document.getElementById('heart-modal');
      const fullImg = document.getElementById('heart-modal-img');
      if (full && fullImg) {
        fullImg.src = img.src;
        full.classList.add('open');
      }
    });
    
    container.appendChild(img);
    cards.push({ el: img, pt: pt });
  });

  const modal = document.getElementById('heart-modal');
  const close = () => modal && modal.classList.remove('open');
  if (modal) modal.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  let angleY = 0;
  let dragging = false;
  let lastX = 0;
  let velocityY = 0.3; // automatic start spin

  const render3D = () => {
    if (!dragging) {
      angleY += velocityY;
      velocityY *= 0.98; // friction
      
      // Auto rotate base speed
      if (Math.abs(velocityY) < 0.1) {
        angleY += 0.2; 
      }
    }

    const radY = angleY * Math.PI / 180;
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);

    cards.forEach((card, idx) => {
      const pt = card.pt;
      
      // Rotate coordinates around Y axis
      const rx = pt.x * cosY - pt.z * sinY;
      const rz = pt.x * sinY + pt.z * cosY;
      const ry = pt.y; // Y remains unchanged in Y-axis rotation

      // 3D Perspective simulation
      const depthRange = 250; 
      const scale = 1 + rz / depthRange; // Closer = bigger, farther = smaller
      const opacity = 0.5 + (rz + depthRange) / (2 * depthRange) * 0.5; // Closer = opaque, farther = transparent
      
      const left = center + rx;
      const top = center + ry;
      const zIndex = Math.round(100 + rz);

      card.el.style.left = `${left}px`;
      card.el.style.top = `${top}px`;
      card.el.style.zIndex = `${zIndex}`;
      
      // We also apply minor tilt for organic feel
      const tilt = (idx % 2 === 0 ? -6 : 6) * (1 - Math.abs(rz)/300);
      card.el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${tilt}deg)`;
      card.el.style.opacity = `${opacity}`;
    });

    requestAnimationFrame(render3D);
  };

  // Pointer drag logic
  container.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    container.setPointerCapture(e.pointerId);
  });
  
  container.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    angleY += dx * 0.45;
    velocityY = dx * 0.25;
  });
  
  container.addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointercancel', () => { dragging = false; });

  render3D();
})();
