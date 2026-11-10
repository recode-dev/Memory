export let flags = {
  enemyAmmo: false,
  antiAfk: false,
  hideLobbyInfo: false,
  hideUltiAiming: false,
  autoSpin: false,
  antiAutoShoot: false,
  antiAutoSuper: false
};
export function toggleFlag(name) {
  flags[name] = !flags[name];
}
