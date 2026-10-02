/**
 * World layout — every station lives on the floor plane (y = 0) of one
 * continuous scene. The camera travels between them (see choreography.ts).
 * Units are roughly metres; the desk is ~7 wide.
 */
export type V3 = [number, number, number];

export const stations = {
  desk: { position: [0, 0, 0] as V3 },
  phone: { position: [-20, 0, -13] as V3 },
  backend: { position: [-7, 0, -25] as V3 },
  systems: { position: [10, 0, -28] as V3 },
  pc: { position: [13, 0, -13] as V3 },
  laptop: { position: [22, 0, -9] as V3 },
  constellation: { position: [4, 7.4, -16] as V3 },
};

/** Desk model placement inside its station (model origin ≠ floor). */
export const deskPlacement = {
  position: [-0.3, 2.43, 2.2] as V3,
  scale: 1.6,
};

/** Laptop placement on its plinth: scale + offset that centres the model. */
export const laptopPlacement = {
  scale: 1.9,
  position: [0.95, 0.5, 0.29] as V3,
};

/** Meshes in the laptop GLB that belong to the dev-room, not the laptop. */
export const laptopHidden = ["Object_9", "Object_10", "Object_12", "Object_14"];
