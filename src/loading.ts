import { LoadingManager } from 'three';

const loadingScreen = document.getElementById('loading-page');
const progressBar = document.getElementById('progress-bar');
export const manager = new LoadingManager();

manager.onStart = function () {};

manager.onLoad = function () {
  if (!loadingScreen) {
    return;
  }
  loadingScreen.style.display = 'none'; // 로딩 페이지 숨기기
};

manager.onProgress = function (_url, itemsLoaded, itemsTotal) {
  if (!progressBar) {
    return;
  }
  const progress = (itemsLoaded / itemsTotal) * 100;
  progressBar.style.width = progress + '%';
};

manager.onError = function (url) {
  console.error(`Error loading: ${url}`);
};
