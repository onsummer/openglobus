/**
 * @module og/bv/Sphere
 */

"use strict";

import { Vec3 } from "../math/Vec3.js";
import { Ellipsoid } from "../ellipsoid";
import { Extent } from "../Extent";

/**
 * @classdesc
 * Bounding sphere class.
 */
class Sphere {
    /**
     * @constructor
     * @param {number} [radius] - Bounding sphere radius.
     * @param {Vec3} [center] - Bounding sphere coordiantes.
     */
    constructor(radius, center) {
        /**
         * Sphere radius.
         * @public
         * @type {number}
         */
        this.radius = radius || 0;

        /**
         * Sphere coordiantes.
         * @public
         * @type {Vec3}
         */
        this.center = center ? center.clone() : new Vec3();
    }

    /**
     * Sets bounding sphere coordinates by the bounds array.
     * @param {number[]} bounds - Bounds is an array where [minX, minY, minZ, maxX, maxY, maxZ]
     */
    setFromBounds(bounds) {
        let m = new Vec3(bounds[0], bounds[1], bounds[2]);
        this.center.set(
            m.x + (bounds[3] - m.x) * 0.5,
            m.y + (bounds[3] - m.y) * 0.5,
            m.z + (bounds[5] - m.z) * 0.5
        );
        this.radius = this.center.distance(m);
    }

    /**
     * Sets bounding sphere coordiantes by ellipsoid geodetic extend.
     * @param {Ellipsoid} ellipsoid - Ellipsoid.
     * @param {Extent} extent - Geodetic extent.
     */
    setFromExtent(ellipsoid, extent) {
        this.setFromBounds(extent.getCartesianBounds(ellipsoid));
    }
}

export { Sphere };
