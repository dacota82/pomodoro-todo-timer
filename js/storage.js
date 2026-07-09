const KEYS = {
  TODOS: 'pomodoro_todos',
  TIMER: 'pomodoro_timer',
  STATS: 'pomodoro_stats',
};

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export function loadTodos() {
  try {
    const data = localStorage.getItem(KEYS.TODOS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(KEYS.TODOS, JSON.stringify(todos));
  } catch {
    // Storage unavailable
  }
}

export function loadTimerState() {
  try {
    const data = localStorage.getItem(KEYS.TIMER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveTimerState(state) {
  try {
    localStorage.setItem(KEYS.TIMER, JSON.stringify(state));
  } catch {
    // Storage unavailable
  }
}

export function loadStats() {
  try {
    const data = localStorage.getItem(KEYS.STATS);
    const stats = data ? JSON.parse(data) : { today: getTodayString(), count: 0 };
    if (stats.today !== getTodayString()) {
      return { today: getTodayString(), count: 0 };
    }
    return stats;
  } catch {
    return { today: getTodayString(), count: 0 };
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  } catch {
    // Storage unavailable
  }
}

export function incrementTodayCount() {
  const stats = loadStats();
  stats.count += 1;
  saveStats(stats);
  return stats.count;
}
