import { registerSW } from 'virtual:pwa-register';

export const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new Event('pwa-update-available'));
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});
