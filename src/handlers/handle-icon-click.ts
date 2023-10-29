import { AudioNode } from '../models/node';

export function handleIconClick(iconElementId: string, object: AudioNode) {
  const iconEl = document.getElementById(iconElementId);
  if (!iconEl) {
    return;
  }

  iconEl.addEventListener('click', () => {
    object.toggle();
  });
}
