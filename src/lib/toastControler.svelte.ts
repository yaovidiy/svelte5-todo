import type { Toast } from "$lib";

class ToastControler {
  toasts: Toast[] = $state([]);
  autoRemoveTimeout: number = 3000;

  add(toast: Toast, autoRemove = true) {
    toast.id = Math.random();
    this.toasts = [...this.toasts, toast];

    if (autoRemove) {
      this.autoRemove(toast);
    }
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t.id !== toast.id);
  }

  removeAll() {
    this.toasts = [];
  }

  autoRemove(toast: Toast) {
    setTimeout(() => {
      this.remove(toast);
    }, this.autoRemoveTimeout);
  }
}

export const toast = new ToastControler();