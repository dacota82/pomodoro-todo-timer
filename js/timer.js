import { createFlipClock } from './flip-clock.js';

export const MODES = {
  focus: { label: 'FOCUS', duration: 25 * 60 },
  shortBreak: { label: 'BREAK', duration: 5 * 60 },
  longBreak: { label: 'LONG BREAK', duration: 15 * 60 },
};

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function createTimerState(saved = null) {
  const mode = saved?.mode && MODES[saved.mode] ? saved.mode : 'focus';
  return {
    mode,
    timeLeft: saved?.timeLeft ?? MODES[mode].duration,
    isRunning: false,
    completedFocusCount: saved?.completedFocusCount ?? 0,
    activeTodoId: saved?.activeTodoId ?? null,
  };
}

export function createTimer(elements, callbacks) {
  let state = createTimerState();
  let intervalId = null;

  const {
    timerDisplay,
    modeLabel,
    flipClockEl,
    timerCard,
    modeTabs,
    btnStart,
    btnPause,
    btnReset,
    timerHint,
    activeTaskLabel,
  } = elements;

  const { onFocusComplete, onStateChange, getActiveTodoText } = callbacks;
  const flipClock = createFlipClock(flipClockEl);

  function getDuration() {
    return MODES[state.mode].duration;
  }

  function updateFlipClock() {
    flipClock.update(state.timeLeft);
  }

  function updateModeUI() {
    timerCard.className = `timer-zone timer-card mode-${state.mode}`;
    modeLabel.textContent = MODES[state.mode].label;
    modeTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.mode === state.mode);
    });
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(state.timeLeft);
    document.title = `${formatTime(state.timeLeft)} · ${MODES[state.mode].label}`;
    updateFlipClock();
    updateControls();
    updateActiveTaskLabel();
  }

  function updateActiveTaskLabel() {
    const text = getActiveTodoText?.();
    if (text) {
      activeTaskLabel.textContent = `지금 집중: ${text}`;
      activeTaskLabel.classList.add('has-task');
    } else {
      activeTaskLabel.textContent = '집중할 할일을 선택하세요';
      activeTaskLabel.classList.remove('has-task');
    }
  }

  function updateControls() {
    const hasTodo = Boolean(state.activeTodoId);
    const needsTodo = state.mode === 'focus';
    const canStart = (!needsTodo || hasTodo) && !state.isRunning;

    // 시작: 집중 모드에서는 할 일 선택 필수 / 실행 중이면 비활성
    btnStart.disabled = !canStart;
    // 일시정지: 실행 중일 때만 활성
    btnPause.disabled = !state.isRunning;
    // 리셋: 실행 중이 아닐 때만 활성
    btnReset.disabled = state.isRunning;

    modeTabs.forEach((tab) => {
      tab.disabled = state.isRunning;
    });

    if (!hasTodo && state.mode === 'focus') {
      timerHint.textContent = '시작하려면 할일을 선택하세요';
    } else if (state.isRunning) {
      timerHint.textContent = 'Space 키로 일시정지할 수 있습니다';
    } else {
      timerHint.textContent = '';
    }
  }

  function persist() {
    onStateChange?.({
      mode: state.mode,
      timeLeft: state.timeLeft,
      completedFocusCount: state.completedFocusCount,
      activeTodoId: state.activeTodoId,
    });
  }

  function playNotification() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not available
    }
  }

  function switchMode(nextMode) {
    state.mode = nextMode;
    state.timeLeft = MODES[nextMode].duration;
    state.isRunning = false;
    clearInterval(intervalId);
    intervalId = null;
    updateModeUI();
    updateDisplay();
    persist();
  }

  function onSessionComplete() {
    playNotification();

    if (state.mode === 'focus') {
      onFocusComplete?.();
      state.completedFocusCount = (state.completedFocusCount + 1) % 4;
      const nextMode = state.completedFocusCount === 0 ? 'longBreak' : 'shortBreak';
      switchMode(nextMode);
    } else {
      switchMode('focus');
    }
  }

  function tick() {
    state.timeLeft -= 1;
    updateDisplay();
    persist();
    if (state.timeLeft <= 0) {
      onSessionComplete();
    }
  }

  function start() {
    if (!state.activeTodoId && state.mode === 'focus') return;
    if (state.isRunning) return;

    state.isRunning = true;
    intervalId = setInterval(tick, 1000);
    updateControls();
    persist();
  }

  function pause() {
    if (!state.isRunning) return;
    state.isRunning = false;
    clearInterval(intervalId);
    intervalId = null;
    updateControls();
    persist();
  }

  function reset() {
    state.isRunning = false;
    clearInterval(intervalId);
    intervalId = null;
    state.timeLeft = getDuration();
    updateDisplay();
    persist();
  }

  function setMode(mode) {
    if (state.isRunning || !MODES[mode]) return;
    switchMode(mode);
  }

  function setActiveTodoId(id) {
    state.activeTodoId = id;
    updateControls();
    updateActiveTaskLabel();
    persist();
  }

  function getActiveTodoId() {
    return state.activeTodoId;
  }

  function init(savedState) {
    if (savedState) {
      state = createTimerState(savedState);
      state.isRunning = false;
    }
    updateModeUI();
    updateDisplay();
  }

  function toggleStartPause() {
    if (state.isRunning) {
      pause();
    } else {
      start();
    }
  }

  btnStart.addEventListener('click', start);
  btnPause.addEventListener('click', pause);
  btnReset.addEventListener('click', reset);

  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  return {
    init,
    start,
    pause,
    reset,
    setMode,
    setActiveTodoId,
    getActiveTodoId,
    toggleStartPause,
    refreshUI: updateDisplay,
  };
}
