import { getRandomInRange } from '../../utils/get-random-in-range';
import { sleep } from '../../utils/sleep';

export class KeyboardModal {
  modalOpen: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    const modalEl = document.getElementById('keyboard-modal');
    const modalContentEl = document.getElementById('keyboard-modal-content');
    const formEl = document.getElementById('keyboard-form');
    const inputEl = document.getElementById(
      'keyboard-input',
    ) as HTMLInputElement;

    modalEl?.addEventListener('click', (e) => {
      // 모달의 내용을 클릭한 경우는 닫지 않음
      if (
        e.target &&
        (e.target === modalContentEl ||
          modalContentEl?.contains(e.target as Node))
      ) {
        return;
      }

      modalEl.classList.add('hidden');
    });

    document.getElementById('keyboard-icon')?.addEventListener('click', () => {
      if (modalEl && inputEl) {
        this.modalOpen = true;
        modalEl.classList.remove('hidden');
        inputEl.focus();
      }
    });

    formEl?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const asmrText = inputEl?.value;
      if (!asmrText) {
        return;
      }

      if (modalEl) {
        this.modalOpen = false;
        modalEl.classList.add('hidden');
      }
      await this.triggerKeyEvent(asmrText);

      inputEl.value = '';
    });
  }

  private async triggerKeyEvent(text: string) {
    for (let i = 0; i < text.length; i++) {
      const event = new KeyboardEvent('keydown', {
        key: text[i],
        code: 'Key' + text[i].toUpperCase(),
      });
      window.dispatchEvent(event);
      const sleepValue = getRandomInRange(100, 500);
      await sleep(sleepValue);
    }
  }
}
