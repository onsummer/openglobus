/**
 * @module og/bv/Box
 */

"use strict";

import { Vec3 } from "../math/Vec3.js";

/**
 * Bounding box class.
 * @class
 */
class Box {
    constructor(boundsArr) {
        /**
         * Vertices array.
         * @public
         * @type {[Vec3,Vec3,Vec3,Vec3,Vec3,Vec3,Vec3,Vec3]}
         */
        this.vertices = [
            new Vec3(),
            new Vec3(),
            new Vec3(),
            new Vec3(),
            new Vec3(),
            new Vec3(),
            new Vec3(),
            new Vec3()
        ];

        if (boundsArr) {
            this.setFromBoundsArr(boundsArr);
        }
    }

    /**
     * Sets bounding box coordinates by the bounds array.
     * @param {[number,number,number,number,number,number]} bounds - Bounds is an array where [minX, minY, minZ, maxX, maxY, maxZ]
     */
    setFromBoundsArr(bounds) {
        var xmin = bounds[0],
            xmax = bounds[3],
            ymin = bounds[1],
            ymax = bounds[4],
            zmin = bounds[2],
            zmax = bounds[5];

        var v = this.vertices;

        v[0].set(xmin, ymin, zmin);
        v[1].set(xmax, ymin, zmin);
        v[2].set(xmax, ymin, zmax);
        v[3].set(xmin, ymin, zmax);
        v[4].set(xmin, ymax, zmin);
        v[5].set(xmax, ymax, zmin);
        v[6].set(xmax, ymax, zmax);
        v[7].set(xmin, ymax, zmax);
    }

    /**
     * Sets bounding box coordiantes by ellipsoid geodetic extend.
     * @param {import('../ellipsoid').Ellipsoid} ellipsoid - Ellipsoid.
     * @param {import('../Extent').Extent} extent - Geodetic extent.
     */
    setFromExtent(ellipsoid, extent) {
        this.setFromBoundsArr(extent.getCartesianBounds(ellipsoid));
    }
}

export { Box };
