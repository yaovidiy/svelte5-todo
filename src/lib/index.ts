// place files you want to import through the `$lib` alias in this folder.
export interface Toast {
  type: 'success' | 'info' | 'danger';
  content: string;
  id?: number;
}