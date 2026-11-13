class Flags {
  constructor() {
    this.enemyAmmo = false;
    this.antiAfk = false;
    this.hideLobbyInfo = false;
    this.hideUltiAiming = false;
    this.autoSpin = false;
    this.antiAutoShoot = false;
  }

  toggle(name) {
    this[name] = !this[name];
  }
}

export const flags = new Flags();
export { Flags };
