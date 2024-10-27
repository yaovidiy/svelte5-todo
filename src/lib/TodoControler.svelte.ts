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
      toast.add({ type: 'info', content: 'No todos found' });
    }
  }

  add(todoName: string) {
    const todo: TODO = {
      id: Math.random(),
      name: todoName,
      done: false,
      createdAt: Date.now(),
    };

    this.items = [...this.items, todo];

    this.autoSaveToDB();

    toast.add({ type: 'success', content: 'Todo added' });
  }

  remove(id: number) {
    this.items = this.items.filter((t) => t.id !== id);

    db.todos.delete(id);
    toast.add({ type: 'success', content: 'Todo removed' });
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

    toast.add({ type: 'success', content: 'Todo updated' });

    this.autoSaveToDB();
  }

  toggleDone() {
    toast.add({ type: 'success', content: 'Todo is done' });

    this.autoSaveToDB();
  }

  autoSaveToDB() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(async () => {
      await db.todos.bulkPut($state.snapshot(this.items));
      toast.add({ type: 'success', content: 'DB is synced with current state' });
    }, this.autoSaveTimeoutTime);
  }
}

export const todo = new TodoControler();