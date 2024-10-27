import db, { type TODO } from "./db";
import { toast } from "./toastControler.svelte";

class TodoControler {
  items: TODO[] = $state([]);
  doneItems = $derived(this.items.filter((t) => t.done));
  unDoneItems = $derived(this.items.filter((t) => !t.done));
  selectedItem: TODO | null = $state(null);
  isLoading = $state(false);
  autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;
  autoSaveTimeoutTime = 3000;

  setTodos(todos: TODO[]) {
    this.items = todos;
  }

  async loadFromDB() {
    this.isLoading = true;
    this.items = await db.todos.toArray();
    this.isLoading = false;

    if (this.items.length === 0) {
      toast.add({ type: 'info', content: 'No todos found 🤷' });
    }
  }

  add(todoData: string | TODO) {
    if (typeof todoData === 'string' && todoData.trim() === '' || typeof todoData !== 'string' && todoData.name.trim() === '') {
      toast.add({ type: 'danger', content: '⚠️ Todo name is required' });
      return;
    }

    let deadline = 0;
    if (typeof todoData !== 'string' && todoData.deadline) {
      deadline = new Date(todoData.deadline).getTime();

      if (deadline < Date.now()) {
        toast.add({ type: 'danger', content: '⚠️ Deadline is invalid' });
        return;
      }
    }
    const todo: TODO = {
      id: Math.random(),
      name: typeof todoData === 'string' ? todoData : todoData.name,
      done: false,
      createdAt: Date.now(),
      deadline,
    };

    this.items = [...this.items, todo];

    this.autoSaveToDB();

    toast.add({ type: 'success', content: '➕ Todo added' });
  }

  remove(id: number) {
    this.items = this.items.filter((t) => t.id !== id);

    db.todos.delete(id);
    toast.add({ type: 'success', content: '❌ Todo removed' });
  }

  select(todo: TODO) {
    this.selectedItem = todo;
  }

  update(todo: TODO) {
    this.items = this.items.map((t) => {
      if (t.id === todo.id) {
        return todo;
      }
      return t;
    });

    toast.add({ type: 'success', content: 'Todo updated 👍' });

    this.autoSaveToDB();
  }

  toggleDone(id: number) {
    const todo = this.items.find((t) => t.id === id);

    if (!todo) {
      return;
    }

    if (todo.done) {
      toast.add({ type: 'success', content: 'Congrats you\'ve done it! 🎉🎉🎉' });
    } else {
      toast.add({ type: 'info', content: 'Sorry but you need to work more on that. 😔' });
    }

    this.autoSaveToDB();
  }

  autoSaveToDB() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(async () => {
      try {
        await db.todos.bulkPut($state.snapshot(this.items));
        toast.add({ type: 'info', content: '🔄 DB is synced with current state' });
      } catch (e) {
        console.error(e);
        toast.add({ type: 'danger', content: '⚠️ Error while saving to DB' });
      }
    }, this.autoSaveTimeoutTime);
  }
}

export const todo = new TodoControler();