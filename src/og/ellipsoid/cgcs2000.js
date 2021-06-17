/**
 * @module og/ellipsoid/cgcs2000
 */

"use strict";

import { Ellipsoid } from "./Ellipsoid.js";

/**
 * CGCS2000 ellipsoid object.
 * @type {Ellipsoid}
 */
export const cgcs2000 = new Ellipsoid(6378137.0, 6356752.31414);
