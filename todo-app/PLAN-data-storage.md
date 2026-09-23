# Todo List App — Data Storage Plan

## Decision: Use **localStorage** with an In-Memory Cache Layer

### TL;DR
**Primary storage: `localStorage`** (persistent)  
**Working layer: In-memory array** (fast access)  
**Sync strategy: Write-through to localStorage on every mutation**

---

## 1. Why Not Pure In-Memory?

| Criteria | In-Memory Only |
|---|---|
| Survives page refresh | ❌ No |
| Survives browser restart | ❌ No |
| Survives tab close | ❌ No |
| Speed | ✅ Instant |
| Complexity | ✅ Very simple |

**Verdict:** A todo app without persistence is just a fancy `<ul>`. Users expect their tasks to be there when they come back. In-memory alone is **not viable** for a todo app.

---

## 2. Why Not Pure localStorage Direct Access?

Every time you read/write, you'd be calling:
```js
JSON.parse(localStorage.getItem('todos'))   // read
localStorage.setItem('todos', JSON.stringify(todos))  // write
```

Problems:
- `JSON.parse()` on every read = unnecessary overhead
- `JSON.stringify()` on every write = unnecessary overhead
- localStorage is **synchronous** — blocks the main thread on large data
- Repeated serialize/deserialize is error-prone

**Verdict:** Use localStorage as the **source of truth for persistence**, but don't hit it on every operation.

---

## 3. Recommended Architecture: Hybrid (Cache + Persist)

```
┌──────────────────────────────────────────┐
│              Application UI              │
│         (render from memory)             │
└──────────────────┬───────────────────────┘
                   │ reads/writes (fast)
                   ▼
┌──────────────────────────────────────────┐
│         In-Memory Cache (Array)          │
│   let todos = []  ← working layer        │
└──────────────────┬───────────────────────┘
                   │ sync on mutation (write-through)
                   ▼
┌──────────────────────────────────────────┐
│          localStorage ("todos")          │
│   "[{...},{...}]"  ← persistence layer   │
└──────────────────────────────────────────┘
```

### How it works:
1. **On app start** → Load from localStorage → Parse once → Store in memory array
2. **On every mutation** (add/edit/delete/toggle) → Update memory array → Sync to localStorage
3. **On every render** → Read from memory array (instant, no parse)

---

## 4. Todo Data Structure

Each todo item:

```js
{
  id: string,        // unique ID (use Date.now() or crypto.randomUUID())
  text: string,      // task description
  completed: boolean, // done or not
  createdAt: number,  // timestamp (Date.now())
  priority: string    // 'low' | 'medium' | 'high' (optional)
}
```

**Storage format in localStorage:**
```
key:   "todos"
value: '[{"id":"1700000000000","text":"Buy groceries","completed":false,"createdAt":1700000000000,"priority":"high"}]'
```

---

## 5. Core Storage Module (API)

```js
// storage.js

const STORAGE_KEY = 'todos';
let todos = []; // in-memory cache

// ── Load ──
function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      todos = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load todos:', e);
    todos = [];
  }
  return todos;
}

// ── Save (sync to localStorage) ──
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos:', e);
    // Handle quota exceeded
  }
}

// ── Get all (from memory) ──
function getTodos() {
  return [...todos]; // return shallow copy to prevent external mutation
}

// ── Add ──
function addTodo(text, priority = 'medium') {
  const todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
    priority
  };
  todos.push(todo);
  saveTodos();
  return todo;
}

// ── Toggle ──
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
  }
  return todo;
}

// ── Edit ──
function editTodo(id, newText) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.text = newText.trim();
    saveTodos();
  }
  return todo;
}

// ── Delete ──
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
}

// ── Clear completed ──
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
}

// ── Delete all ──
function clearAll() {
  todos = [];
  saveTodos();
}
```

---

## 6. Why This Approach Wins

| Feature | This Hybrid Approach |
|---|---|
| **Persistence** | ✅ Survives refresh/restart |
| **Speed** | ✅ Reads from memory (instant) |
| **Simplicity** | ✅ Single source of truth pattern |
| **No server needed** | ✅ 100% client-side |
| **No dependencies** | ✅ Pure Web API |
| **Handles ~1000s of todos** | ✅ Well within localStorage limits |
| **Debuggable** | ✅ View data in DevTools → Application → Local Storage |

---

## 7. Limitations & Future Considerations

| Scenario | Current | Future Upgrade |
|---|---|---|
| Data sync across devices | ❌ Not supported | Add cloud sync / backend API |
| Very large lists (10k+) | ⚠️ localStorage sync may lag | Switch to IndexedDB |
| Undo/History | ❌ Not supported | Add change history stack |
| Search across sessions | ❌ Not supported | Add indexing |
| Sharing lists | ❌ Not supported | Add backend + user accounts |

---

## 8. File Structure (Phase 1)

```
todo-app/
├── index.html          ← HTML structure
├── style.css           ← Styling
├── app.js              ← UI logic (render, events)
├── storage.js          ← Data layer (this plan)
└── plan/
    ├── PLAN-data-storage.md    ← You are here
    ├── PLAN-ui-layout.md       ← Next step
    └── PLAN-features.md        ← Feature roadmap
```

---

## Summary

> **Use localStorage as your persistence engine. Use an in-memory array as your working cache. Sync on every write. Read from cache. This gives you the best of both worlds: persistence + performance, with zero dependencies.**