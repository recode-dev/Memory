export let flags = {
  enemyAmmo: false,
  antiAfk: false,
  hideLobbyInfo: false
};
export function toggleFlag(name) {
  flags[name] = !flags[name];
  return flags[name];
}
