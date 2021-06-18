/**
 * @module og/LonLat
 */

import * as mercator from "./mercator.js";

const HALF_PI = Math.PI * 0.5;
const INV_PI_BY_180 = 180.0 / Math.PI;
const INV_PI_BY_360 = INV_PI_BY_180 * 2.0;
const PI_BY_360 = Math.PI / 360.0;
const INV_PI_BY_180_HALF_PI = INV_PI_BY_180 * HALF_PI;

/**
 * Represents a geographical point with a certain latitude, longitude and height.
 * @class
 */
class LonLat {
    /**
     * @constructor
     * @param {number} [lon] - Longitude.
     * @param {number} [lat] - Latitude.
     * @param {number} [height] - Height over the surface.
     */
    constructor(lon, lat, height) {
        /**
         * Longitude.
         * @public
         * @type {number}
         */
        this.lon = lon || 0;

        /**
         * Latitude.
         * @public
         * @type {number}
         */
        this.lat = lat || 0;

        /**
         * Height.
         * @public
         * @type {number}
         */
        this.height = height || 0;
    }

    isZero() {
        return this.lon === 0.0 && this.lat === 0.0 && this.height === 0.0;
    }

    /**
     * Sets coordinates.
     * @public
     * @param {number} [lon] - Longitude.
     * @param {number} [lat] - Latitude.
     * @param {number} [height] - Height.
     * @returns {LonLat} -
     */
    set(lon, lat, height) {
        this.lon = lon || 0;
        this.lat = lat || 0;
        this.height = height || 0;
        return this;
    }

    /**
     * Copy coordinates.
     * @public
     * @param {LonLat} [lonLat] - Coordinates to copy.
     * @returns {LonLat} -
     */
    copy(lonLat) {
        this.lon = lonLat.lon;
        this.lat = lonLat.lat;
        this.height = lonLat.height;
        return this;
    }

    /**
     * Clone the coordiante.
     * @public
     * @returns {LonLat} -
     */
    clone() {
        return new LonLat(this.lon, this.lat, this.height);
    }

    /**
     * Converts to mercator coordinates.
     * @public
     * @returns {LonLat} -
     */
    forwardMercator() {
        return LonLat.forwardMercator(this.lon, this.lat, this.height);
    }

    forwardMercatorEPS01() {
        let lat = this.lat;
        if (lat > 89.9) {
            lat = 89.9;
        } else if (lat < -89.9) {
            lat = -89.9;
        }
        return new LonLat(
            this.lon * mercator.POLE_BY_180,
            Math.log(Math.tan((90.0 + lat) * PI_BY_360)) * mercator.POLE_BY_PI
        );
    }

    /**
     * Converts from mercator coordinates.
     * @public
     * @returns {LonLat}
     */
    inverseMercator() {
        return LonLat.inverseMercator(this.lon, this.lat, this.height);
    }

    /**
     * Compares coordinates.
     * @public
     * @param {LonLat} value - Coordinate to compare with.
     * @returns {boolean} -
     */
    equal(value) {
        if (value.height) {
            return this.lon === value.lon && this.lat === value.lat && this.height === value.height;
        } else {
            return this.lon === value.lon && this.lat === value.lat;
        }
    }

    /**
     * Creates coordinates array.
     * @static
     * @param {number[][]} arr - Coordinates array data.
     * @return {LonLat[]} the same coordinates array but each element is LonLat instance.
     */
    static join(arr) {
        const res = [];
        for (let i = 0; i < arr.length; i++) {
            const ai = arr[i];
            res[i] = new LonLat(ai[0], ai[1], ai[2]);
        }
        return res;
    }

    /**
     * Creates an object by coordinate array.
     * @static
     * @param {number[][]} arr - Coordiante array, where first is longitude, second is latitude and third is a height.
     * @returns {LonLat}
     */
    static createFromArray(arr) {
        return new LonLat(arr[0], arr[1], arr[2]);
    }

    /**
     * Converts degrees to mercator coordinates.
     * @static
     * @param {number} lon - Degrees longitude.
     * @param {number} lat - Degrees latitude.
     * @param {number} [height] - Height.
     * @returns {LonLat}
     */
    static forwardMercator(lon, lat, height) {
        return new LonLat(
            lon * mercator.POLE_BY_180,
            Math.log(Math.tan((90.0 + lat) * PI_BY_360)) * mercator.POLE_BY_PI,
            height
        );
    }

    /**
     * Converts mercator to degrees coordinates.
     * @static
     * @param {number} x - Mercator longitude.
     * @param {number} y - Mercator latitude.
     * @param {number} [height] - Height.
     * @returns {LonLat}
     */
    static inverseMercator(x, y, height) {
        return new LonLat(
            x * mercator.INV_POLE_BY_180,
            INV_PI_BY_360 * Math.atan(Math.exp(y * mercator.PI_BY_POLE)) - INV_PI_BY_180_HALF_PI,
            height
        );
    }
}

export { LonLat };
