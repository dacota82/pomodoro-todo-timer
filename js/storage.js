const KEYS = {
  TODOS: 'pomodoro_todos',
  TIMER: 'pomodoro_timer',
  STATS: 'pomodoro_stats',
};

export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function readJSON(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable
  }
}

export function loadTodos() {
  const todos = readJSON(KEYS.TODOS, []);
  return Array.isArray(todos) ? todos : [];
}

export function saveTodos(todos) {
  writeJSON(KEYS.TODOS, todos);
}

export function loadTimerState() {
  return readJSON(KEYS.TIMER, null);
}

export function saveTimerState(state) {
  writeJSON(KEYS.TIMER, state);
}

export function loadStats() {
  const stats = readJSON(KEYS.STATS, { today: getTodayString(), count: 0 });
  if (!stats || stats.today !== getTodayString()) {
    return { today: getTodayString(), count: 0 };
  }
  return { today: stats.today, count: Number(stats.count) || 0 };
}

export function saveStats(stats) {
  writeJSON(KEYS.STATS, stats);
}

/** 오늘 완료한 할 일 개수를 통계에 반영 */
export function setTodayCompletedCount(count) {
  const stats = { today: getTodayString(), count: Math.max(0, count) };
  saveStats(stats);
  return stats.count;
}

export function countTodosCompletedToday(todos) {
  const today = getTodayString();
  return todos.filter(
    (todo) => todo.completed && todo.completedAt === today
  ).length;
}
