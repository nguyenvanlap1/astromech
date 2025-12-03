export class GameConfig {
  private static instance: GameConfig | null = null;

  private scale: number = 30;

  private constructor() {}

  static getInstance(): GameConfig {
    if (!this.instance) {
      this.instance = new GameConfig();
    }
    return this.instance;
  }

  /* =====================
          SCALE (ZOOM)
     ===================== */
  setScale(newScale: number): void {
    this.scale = newScale;
  }

  getScale(): number {
    return this.scale;
  }
}
