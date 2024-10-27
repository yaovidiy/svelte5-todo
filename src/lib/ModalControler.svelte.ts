import type { Snippet } from "svelte";

class ModalControler {
  modalContent: Snippet | null = $state(null);
  modalHeader: Snippet | null = $state(null);
  modalFooter: Snippet | null = $state(null);
  modalProps: Record<string, unknown> = {};
  isModalOpen = $state(false);

  openModal({ content, header, footer }: { content: Snippet; header?: Snippet; footer?: Snippet; }, props: Record<string, unknown> = {}) {
    if (!content) {
      throw new Error('Content is required');
    }

    console.log('openModal', content, header, footer, props);

    this.modalContent = content;
    this.modalHeader = header ?? null;
    this.modalFooter = footer ?? null;

    this.modalProps = props;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalContent = null;
    this.modalHeader = null;
    this.modalFooter = null;
  }
}

export const modal = new ModalControler();
