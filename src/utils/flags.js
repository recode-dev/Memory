export let flags = {
  enemyAmmo: false,
  antiAfk: false,
  hideLobbyInfo: false,
  hideUltiAiming: false
};
export function toggleFlag(name) {
  flags[name] = !flags[name];
  return flags[name];
}
