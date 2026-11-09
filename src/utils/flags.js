export let flags = {
  enemyAmmo: false,
  antiAfk: false,
  hideLobbyInfo: false,
  staticEmoji: false
};
export function toggleFlag(name) {
  flags[name] = !flags[name];
  return flags[name];
}
