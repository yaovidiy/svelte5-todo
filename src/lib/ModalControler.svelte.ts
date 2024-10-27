import type { Snippet } from "svelte";

class ModalControler {
  content: Snippet | null = $state(null);
  header: Snippet | null = $state(null);
  footer: Snippet | null = $state(null);
  props: Record<string, unknown> = {};
  isOpen = $state(false);

  open({ content, header, footer }: { content: Snippet; header?: Snippet; footer?: Snippet; }, props: Record<string, unknown> = {}) {
    if (!content) {
      throw new Error('Content is required');
    }

    console.log('openModal', content, header, footer, props);

    this.content = content;
    this.header = header ?? null;
    this.footer = footer ?? null;

    this.props = props;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.content = null;
    this.header = null;
    this.footer = null;
  }
}

export const modal = new ModalControler();
