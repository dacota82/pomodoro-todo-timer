function createFlipCard(id) {
  const el = document.createElement('div');
  el.className = 'flip-card';
  el.dataset.id = id;

  const top = document.createElement('div');
  top.className = 'flip-card__top';
  const topText = document.createElement('span');
  topText.className = 'flip-card__text';
  topText.textContent = '0';
  top.appendChild(topText);

  const bottom = document.createElement('div');
  bottom.className = 'flip-card__bottom';
  const bottomText = document.createElement('span');
  bottomText.className = 'flip-card__text';
  bottomText.textContent = '0';
  bottom.appendChild(bottomText);

  const hingeL = document.createElement('span');
  hingeL.className = 'flip-card__hinge flip-card__hinge--left';
  const hingeR = document.createElement('span');
  hingeR.className = 'flip-card__hinge flip-card__hinge--right';

  el.append(hingeL, top, bottom, hingeR);

  let current = '0';

  function setValue(value) {
    topText.textContent = value;
    bottomText.textContent = value;
    current = value;
  }

  function flip(value) {
    if (value === current) return;
    el.classList.add('is-flipping');
    topText.textContent = value;
    bottomText.textContent = current;
    setTimeout(() => {
      setValue(value);
      el.classList.remove('is-flipping');
    }, 280);
  }

  setValue('0');

  return { el, flip, setValue };
}

export function createFlipClock(containerEl) {
  const groups = [
    { key: 'hours', label: 'HOURS' },
    { key: 'minutes', label: 'MINUTES' },
    { key: 'seconds', label: 'SECONDS' },
  ];

  const cards = {};
  containerEl.innerHTML = '';
  containerEl.className = 'flip-clock';

  const inner = document.createElement('div');
  inner.className = 'flip-clock__panel';

  const row = document.createElement('div');
  row.className = 'flip-clock__row';

  groups.forEach((group, index) => {
    if (index > 0) {
      const gap = document.createElement('div');
      gap.className = 'flip-clock__gap';
      row.appendChild(gap);
    }

    const unit = document.createElement('div');
    unit.className = 'flip-unit';

    const digits = document.createElement('div');
    digits.className = 'flip-unit__digits';

    for (let i = 0; i < 2; i++) {
      const id = `${group.key}-${i}`;
      const card = createFlipCard(id);
      cards[id] = card;
      digits.appendChild(card.el);
    }

    const label = document.createElement('span');
    label.className = 'flip-unit__label';
    label.textContent = group.label;

    unit.append(digits, label);
    row.appendChild(unit);
  });

  inner.appendChild(row);
  containerEl.appendChild(inner);

  let isFirstUpdate = true;

  function setPair(prefix, str, animate) {
    const apply = animate ? 'flip' : 'setValue';
    cards[`${prefix}-0`][apply](str[0]);
    cards[`${prefix}-1`][apply](str[1]);
  }

  function update(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const animate = !isFirstUpdate;
    isFirstUpdate = false;
    setPair('hours', String(h).padStart(2, '0'), animate);
    setPair('minutes', String(m).padStart(2, '0'), animate);
    setPair('seconds', String(s).padStart(2, '0'), animate);
  }

  return { update };
}
