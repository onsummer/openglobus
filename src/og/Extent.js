/**
 * @module og/Extent
 */

import * as math from "./math.js";
import * as mercator from "./mercator.js";
import { LonLat } from "./LonLat.js";

/**
 * Represents geographical coordinates extent.
 * @class
 */
class Extent {
    /**
     * @constructor
     * @param {LonLat} [sw] - South West extent corner coordiantes.
     * @param {LonLat} [ne] - North East extent corner coordiantes.
     */
    constructor(sw, ne) {
        /**
         * @public
         * @type {LonLat}
         */
        this.southWest = sw || new LonLat();

        /**
         * @public
         * @type {LonLat}
         */
        this.northEast = ne || new LonLat();
    }

    /**
     * Creates extent instance from values in array.
     * @static
     * @param {[number,number,number,number]} arr - South west and north east longitude and latidudes packed in array.
     * @returns {Extent} Extent object.
     */
    static createFromArray(arr) {
        return new Extent(new LonLat(arr[0], arr[1]), new LonLat(arr[2], arr[3]));
    }

    /**
     * Creates bound extent instance by coordinate array.
     * @static
     * @param {LonLat[]} arr - Coordinate array.
     * @returns {Extent} Extent object.
     */
    static createByCoordinates(arr) {
        // prettier-ignore
        const lonmin = math.MAX, lonmax = math.MIN,
            latmin = math.MAX, latmax = math.MIN;
        for (let i = 0; i < arr.length; i++) {
            const vi = arr[i];
            if (vi.lon < lonmin) lonmin = vi.lon;
            if (vi.lon > lonmax) lonmax = vi.lon;
            if (vi.lat < latmin) latmin = vi.lat;
            if (vi.lat > latmax) latmax = vi.lat;
        }
        return new Extent(new LonLat(lonmin, latmin), new LonLat(lonmax, latmax));
    }

    /**
     * Creates bound extent instance by coordinate array.
     * @static
     * @param {[number, number][]} arr - Coordinate array.
     * @returns {Extent} Extent object.
     */
    static createByCoordinatesArr(arr) {
        // prettier-ignore
        const lonmin = math.MAX, lonmax = math.MIN,
            latmin = math.MAX, latmax = math.MIN;
        for (let i = 0; i < arr.length; i++) {
            const vi = arr[i];
            if (vi[0] < lonmin) lonmin = vi[0];
            if (vi[0] > lonmax) lonmax = vi[0];
            if (vi[1] < latmin) latmin = vi[1];
            if (vi[1] > latmax) latmax = vi[1];
        }
        return new Extent(new LonLat(lonmin, latmin), new LonLat(lonmax, latmax));
    }

    /**
     * Creates extent by meractor grid tile coordinates.
     * @static
     * @param {number} x -
     * @param {number} y -
     * @param {number} z -
     * @param {number} width -
     * @param {number} height -
     * @returns {Extent} -
     */
    static fromTile(x, y, z, width, height) {
        width = width || mercator.POLE_DOUBLE;
        height = height || mercator.POLE_DOUBLE;

        // prettier-ignore
        const H = Math.pow(2, z),
            W = Math.pow(2, z),
            lnSize = width / W,
            ltSize = height / H;

        // prettier-ignore
        const left = -width * 0.5 + x * lnSize,
            top = height * 0.5 - y * ltSize,
            bottom = top - ltSize,
            right = left + lnSize;

        return new Extent(new LonLat(left, bottom), new LonLat(right, top));
    }

    /**
     * Sets current bounding extent object by coordinate array.
     * @public
     * @param {LonLat[]} arr - Coordinate array.
     * @returns {Extent} Current extent.
     */
    setByCoordinates(arr) {
        // prettier-ignore
        const lonmin = math.MAX, lonmax = math.MIN,
            latmin = math.MAX, latmax = math.MIN;
        for (let i = 0; i < arr.length; i++) {
            const vi = arr[i];
            if (vi.lon < lonmin) lonmin = vi.lon;
            if (vi.lon > lonmax) lonmax = vi.lon;
            if (vi.lat < latmin) latmin = vi.lat;
            if (vi.lat > latmax) latmax = vi.lat;
        }
        this.southWest.lon = lonmin;
        this.southWest.lat = latmin;
        this.northEast.lon = lonmax;
        this.northEast.lat = latmax;
        return this;
    }

    /**
     * Determines if point inside extent.
     * @public
     * @param {LonLat} lonlat - Coordinate point.
     * @returns {boolean} Returns true if point inside extent.
     */
    isInside(lonlat) {
        // prettier-ignore
        const sw = this.southWest,
            ne = this.northEast;
        return (
            lonlat.lon >= sw.lon &&
            lonlat.lon <= ne.lon &&
            lonlat.lat >= sw.lat &&
            lonlat.lat <= ne.lat
        );
    }

    /**
     * Returns true if two extent overlap each other.
     * @public
     * @param {Extent} e - Another extent.
     * @returns {boolean} -
     */
    overlaps(e) {
        // prettier-ignore
        const sw = this.southWest,
            ne = this.northEast;
        return (
            sw.lon <= e.northEast.lon &&
            ne.lon >= e.southWest.lon &&
            sw.lat <= e.northEast.lat &&
            ne.lat >= e.southWest.lat
        );
    }

    /**
     * Gets extent width.
     * @public
     * @returns {number} Extent width.
     */
    getWidth() {
        return this.northEast.lon - this.southWest.lon;
    }

    /**
     * Gets extent height.
     * @public
     * @returns {number} Extent height.
     */
    getHeight() {
        return this.northEast.lat - this.southWest.lat;
    }

    /**
     * Creates clone instance of the current extent.
     * @public
     * @returns {Extent} Extent clone.
     */
    clone() {
        return new Extent(this.southWest.clone(), this.northEast.clone());
    }

    /**
     * Gets the center coordinate of the extent.
     * @public
     * @returns {LonLat} Center coordinate.
     */
    getCenter() {
        // prettier-ignore
        const sw = this.southWest, ne = this.northEast;
        return new LonLat(sw.lon + (ne.lon - sw.lon) * 0.5, sw.lat + (ne.lat - sw.lat) * 0.5);
    }

    /**
     * @public
     * @returns {LonLat}
     */
    getNorthWest() {
        return new LonLat(this.southWest.lon, this.northEast.lat);
    }

    /**
     * @public
     * @returns {LonLat}
     */
    getNorthEast() {
        return new LonLat(this.northEast.lon, this.northEast.lat);
    }

    /**
     * @public
     * @returns {LonLat}
     */
    getSouthWest() {
        return new LonLat(this.southWest.lon, this.southWest.lat);
    }

    /**
     * @public
     * @returns {LonLat}
     */
    getSouthEast() {
        return new LonLat(this.northEast.lon, this.southWest.lat);
    }

    /**
     * @public
     * @returns {number}
     */
    getNorth() {
        return this.northEast.lat;
    }

    /**
     * @public
     * @returns {number}
     */
    getEast() {
        return this.northEast.lon;
    }

    /**
     * @public
     * @returns {number}
     */
    getWest() {
        return this.southWest.lon;
    }

    /**
     * @public
     * @returns {number}
     */
    getSouth() {
        return this.southWest.lat;
    }

    /**
     * Returns extents are equals.
     * @param {Extent} extent - Extent.
     * @returns {boolean} -
     */
    equals(extent) {
        return (
            this.southWest.lon === extent.southWest.lon &&
            this.southWest.lat === extent.southWest.lat &&
            this.northEast.lon === extent.northEast.lon &&
            this.northEast.lat === extent.northEast.lat
        );
    }

    /**
     * Converts extent coordinates to mercator projection coordinates.
     * @public
     * @return {Extent} New instance of the current extent.
     */
    forwardMercator() {
        return new Extent(this.southWest.forwardMercator(), this.northEast.forwardMercator());
    }

    /**
     * Converts extent coordinates from mercator projection to degrees.
     * @public
     * @return {Extent} New instance of the current extent.
     */
    inverseMercator() {
        return new Extent(this.southWest.inverseMercator(), this.northEast.inverseMercator());
    }

    /**
     * Gets cartesian bounding bounds of the current ellipsoid.
     * @public
     * @param {import('./ellipsoid/Ellipsoid.js').Ellipsoid} ellipsoid - Ellipsoid.
     * @return {[number,number,number,number,number,number]} Cartesian 3d coordinate array.
     */
    getCartesianBounds(ellipsoid) {
        // prettier-ignore
        const xmin = math.MAX, xmax = math.MIN, ymin = math.MAX,
            ymax = math.MIN, zmin = math.MAX, zmax = math.MIN;

        const v = [
            new LonLat(this.southWest.lon, this.southWest.lat),
            new LonLat(this.southWest.lon, this.northEast.lat),
            new LonLat(this.northEast.lon, this.northEast.lat),
            new LonLat(this.northEast.lon, this.southWest.lat)
        ];

        for (let i = 0; i < v.length; i++) {
            const coord = ellipsoid.lonLatToCartesian(v[i]);
            const x = coord.x,
                y = coord.y,
                z = coord.z;
            if (x < xmin) xmin = x;
            if (x > xmax) xmax = x;
            if (y < ymin) ymin = y;
            if (y > ymax) ymax = y;
            if (z < zmin) zmin = z;
            if (z > zmax) zmax = z;
        }

        return [xmin, ymin, zmin, xmax, ymax, zmax];
    }

    toString() {
        return `[${this.southWest.lon},${this.southWest.lat},${this.northEast.lon},${this.northEast.lat}]`;
    }
}

/**
 * Whole mercator extent.
 * @static
 * @readonly
 * @type {Extent}
 */
Extent.FULL_MERC = Object.freeze(new Extent(LonLat.SW_MERC, LonLat.NE_MERC));

/**
 * Degrees extent from north mercator limit to north pole.
 * @readonly
 * @static
 * @type {Extent}
 */
Extent.NORTH_POLE_DEG = Object.freeze(new Extent(LonLat.NW_MERC_DEG, new LonLat(180.0, 90.0)));
/**
 * Degrees extent from south pole to south mercator limit.
 * @readonly
 * @static
 * @type {Extent}
 */
Extent.SOUTH_POLE_DEG = Object.freeze(new Extent(new LonLat(-180.0, -90.0), LonLat.SE_MERC_DEG));

export { Extent };
