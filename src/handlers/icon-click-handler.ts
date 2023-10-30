import { IEventHandler } from '../models/event-handler';
import { ToggleNode } from '../models/node';

export class IconClickHandler implements IEventHandler {
  constructor(
    private iconElementId: string,
    private object: ToggleNode,
  ) {}

  handle() {
    const iconEl = document.getElementById(this.iconElementId);
    if (!iconEl) {
      return;
    }

    iconEl.addEventListener('click', () => {
      this.object.toggle();
    });
  }
}
