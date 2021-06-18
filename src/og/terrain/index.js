/**
 * @module og/terrain
 * @typedef {EmptyTerrain | GlobusTerrain | MapboxTerrain | BilTerrain} terrain
 */

import { EmptyTerrain } from "./EmptyTerrain";
import { GlobusTerrain } from "./GlobusTerrain";
import { MapboxTerrain } from "./MapboxTerrain";
import { BilTerrain } from "./BilTerrain";

export * from "./Geoid.js";

export { EmptyTerrain, GlobusTerrain, MapboxTerrain, BilTerrain };
