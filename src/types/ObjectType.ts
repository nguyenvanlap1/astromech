export const ObjectType = {
  ShipModule: "Ship Module",
  Planet: "Planet",
  Asteroid: "Asteroid",
  Star: "Star",
} as const;

export type ObjectType = (typeof ObjectType)[keyof typeof ObjectType];
