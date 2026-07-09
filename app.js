import {
  loadTodos,
  saveTodos,
  loadTimerState,
  saveTimerState,
  loadStats,
  incrementTodayCount,
} from './js/storage.js';
import { createTimer } from './js/timer.js';
import { createTodoManager } from './js/todo.js';

function showBootError(message) {
  const banner = document.createElement('div');
  banner.style.cssText =
    'position:fixed;top:0;left:0;right:0;padding:12px 16px;background:#db4035;color:#fff;font-size:14px;z-index:9999;text-align:center';
  banner.textContent = `앱 로드 오류: ${message} — http://localhost:8080 으로 접속했는지 확인하세요.`;
  document.body.prepend(banner);
}

let timer;
let todoManager;

try {
  const todayCountEl = document.getElementById('today-count');

  timer = createTimer(
    {
      timerDisplay: document.getElementById('timer-display'),
      modeLabel: document.getElementById('mode-label'),
      flipClockEl: document.getElementById('flip-clock'),
      timerCard: document.querySelector('.timer-zone'),
      modeTabs: document.querySelectorAll('.mode-tab'),
      btnStart: document.getElementById('btn-start'),
      btnPause: document.getElementById('btn-pause'),
      btnReset: document.getElementById('btn-reset'),
      timerHint: document.getElementById('timer-hint'),
      activeTaskLabel: document.getElementById('active-task-label'),
    },
    {
      onFocusComplete: () => {
        const activeId = timer.getActiveTodoId();
        if (activeId) {
          todoManager.incrementPomodoro(activeId);
        }
        incrementTodayCount();
        todayCountEl.textContent = String(loadStats().count);
      },
      onStateChange: saveTimerState,
      getActiveTodoText: () => {
        const id = timer.getActiveTodoId();
        return id ? todoManager.getTodoText(id) : null;
      },
    }
  );

  todoManager = createTodoManager(
    {
      todoList: document.getElementById('todo-list'),
      todoEmpty: document.getElementById('todo-empty'),
      todoForm: document.getElementById('todo-form'),
      todoInput: document.getElementById('todo-input'),
      filterTabs: document.querySelectorAll('.filter-tab'),
    },
    {
      onSelect: (id) => {
        timer.setActiveTodoId(id);
        todoManager.setSelectedId(id);
      },
      onTodosChange: saveTodos,
    }
  );

  const todos = loadTodos();
  const savedTimer = loadTimerState();
  const activeTodoId = savedTimer?.activeTodoId ?? null;

  todayCountEl.textContent = String(loadStats().count);
  todoManager.init(todos, activeTodoId);
  timer.init(savedTimer);

  if (activeTodoId) {
    timer.setActiveTodoId(activeTodoId);
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      timer.toggleStartPause();
    }
  });

  window.addEventListener('beforeunload', (e) => {
    const btnPause = document.getElementById('btn-pause');
    if (!btnPause.disabled) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
} catch (error) {
  console.error(error);
  showBootError(error.message);
}
