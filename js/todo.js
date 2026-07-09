export function createTodoManager(elements, callbacks) {
  let todos = [];
  let filter = 'all';
  let selectedId = null;

  const { todoList, todoEmpty, todoForm, todoInput, filterTabs } = elements;
  const { onSelect, onTodosChange } = callbacks;

  function getFilteredTodos() {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }

  function render() {
    const filtered = getFilteredTodos();
    todoList.innerHTML = '';

    filtered.forEach((todo) => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (todo.completed) li.classList.add('completed');
      if (todo.id === selectedId) li.classList.add('selected');
      li.dataset.id = todo.id;

      const checkLabel = document.createElement('label');
      checkLabel.className = 'todo-check';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', `${todo.text} 완료 토글`);

      const checkBox = document.createElement('span');
      checkBox.className = 'todo-check__box';

      checkLabel.append(checkbox, checkBox);

      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;

      const pomodoro = document.createElement('span');
      pomodoro.className = 'todo-pomodoro';
      if (todo.pomodoroCount > 0) {
        pomodoro.classList.add('has-count');
        pomodoro.textContent = `🍅 ${todo.pomodoroCount}`;
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'todo-delete';
      deleteBtn.setAttribute('aria-label', `${todo.text} 삭제`);
      deleteBtn.textContent = '×';

      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleComplete(todo.id);
      });

      checkLabel.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
      });

      li.addEventListener('click', () => selectTodo(todo.id));

      li.append(checkLabel, text, pomodoro, deleteBtn);
      todoList.appendChild(li);
    });

    todoEmpty.classList.toggle('hidden', filtered.length > 0);
    onTodosChange?.(todos);
  }

  function persist() {
    onTodosChange?.(todos);
    render();
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const todo = {
      id: typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: trimmed,
      completed: false,
      pomodoroCount: 0,
      createdAt: Date.now(),
    };

    todos.unshift(todo);
    persist();
    todoInput.value = '';
  }

  function toggleComplete(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;
    if (todo.completed && selectedId === id) {
      selectedId = null;
      onSelect?.(null);
    }
    persist();
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    if (selectedId === id) {
      selectedId = null;
      onSelect?.(null);
    }
    persist();
  }

  function selectTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo || todo.completed) return;

    selectedId = id;
    onSelect?.(id);
    render();
  }

  function incrementPomodoro(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    todo.pomodoroCount += 1;
    persist();
  }

  function getTodoText(id) {
    return todos.find((t) => t.id === id)?.text ?? null;
  }

  function setSelectedId(id) {
    selectedId = id;
    render();
  }

  function init(initialTodos, initialSelectedId) {
    todos = initialTodos;
    selectedId = initialSelectedId;
    render();
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(todoInput.value);
  });

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filter = tab.dataset.filter;
      filterTabs.forEach((t) => t.classList.toggle('active', t === tab));
      render();
    });
  });

  return {
    init,
    addTodo,
    incrementPomodoro,
    getTodoText,
    setSelectedId,
    getTodos: () => todos,
  };
}
