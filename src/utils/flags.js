export let flags = {
  enemyAmmo: false,
  antiAfk: false
};
export function toggleFlag(name) {
  flags[name] = !flags[name];
  return flags[name];
}
