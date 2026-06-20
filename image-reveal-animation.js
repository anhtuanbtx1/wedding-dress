(function () {
  const revealRoot = document.querySelector('.album-reveal');
  if (!revealRoot) return;

  const cards = Array.from(revealRoot.querySelectorAll('.album-reveal__card'));
  if (cards.length < 3) return;

  const pagination = revealRoot.querySelector('.album-reveal__dots');
  const totalGroups = Math.ceil(cards.length / 3);
  let currentGroup = 0;
  let autoTimer = null;

  function getGroupImages(groupIndex) {
    const start = groupIndex * 3;
    const group = [];
    for (let i = 0; i < 3; i++) {
      group.push(cards[(start + i) % cards.length]);
    }
    return group;
  }

  function clearActive() {
    cards.forEach((card) => {
      card.classList.remove('is-left', 'is-middle', 'is-right', 'is-active');
      card.setAttribute('aria-hidden', 'true');
    });
  }

  function renderDots() {
    if (!pagination) return;
    pagination.innerHTML = '';
    for (let i = 0; i < totalGroups; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'album-reveal__dot' + (i === currentGroup ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Xem nhóm ảnh ' + (i + 1));
      dot.addEventListener('click', function () {
        showGroup(i, true);
      });
      pagination.appendChild(dot);
    }
  }

  function showGroup(groupIndex, restartTimer) {
    currentGroup = groupIndex % totalGroups;
    clearActive();

    const trio = getGroupImages(currentGroup);
    const leftCard = trio[0];
    const middleCard = trio[1];
    const rightCard = trio[2];

    requestAnimationFrame(() => {
      leftCard.classList.add('is-active', 'is-left');
      middleCard.classList.add('is-active', 'is-middle');
      rightCard.classList.add('is-active', 'is-right');
      leftCard.setAttribute('aria-hidden', 'false');
      middleCard.setAttribute('aria-hidden', 'false');
      rightCard.setAttribute('aria-hidden', 'false');
      renderDots();
    });

    if (restartTimer) startAuto();
  }

  function nextGroup() {
    showGroup((currentGroup + 1) % totalGroups, false);
  }

  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextGroup, 3200);
  }

  revealRoot.addEventListener('mouseenter', function () {
    if (autoTimer) clearInterval(autoTimer);
  });

  revealRoot.addEventListener('mouseleave', function () {
    startAuto();
  });

  showGroup(0, false);
  startAuto();

  if (window.lazySizes && window.lazySizes.loader) {
    window.lazySizes.loader.checkElems();
  }
})();
