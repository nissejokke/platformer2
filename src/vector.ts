// @ts-nocheck
"use strict";

/******************************************************
 ************** Simple ES6 Vector Class  **************
 ******************************************************
 * Author: Starbeamrainbowlabs
 * Twitter: @SBRLabs
 * Email: feedback at starbeamrainbowlabs dot com
 *
 * From https://gist.github.com/sbrl/69a8fa588865cacef9c0
 ******************************************************
 * Originally written for my 2D Graphics ACW at Hull
 * University.
 ******************************************************
 * Changelog
 ******************************************************
 * 19th December 2015:
 * Added this changelog.
 * 28th December 2015:
 * Rewrite tests with klud.js + Node.js
 * 30th January 2016:
 * Tweak angleFrom function to make it work properly.
 * 31st January 2016:
 * Add the moveTowards function.
 * Add the minComponent getter.
 * Add the maxComponent getter.
 * Add the equalTo function.
 * Tests still need to be written for all of the above.
 * 19th September 2016:
 * Added Vector support to the multiply method.
 * 10th June 2017:
 * Fixed a grammatical mistake in a comment.
 * Added Vector.fromBearing static method.
 * 21st October 2017:
 * Converted to ES6 module.
 * Added Vector.zero and Vector.one constants. Remember to clone them!
 * 4th August 2018: (#LOWREZJAM!)
 * Optimised equalTo()
 * 6th August 2018: (#LOWREZJAM again!)
 * Added round(), floor(), and ceil()
 * 7th August 2018: (moar #LOWREZJAM :D)
 * Added area() and snapTo(grid_size)
 * 10th August 2018: (even more #LOWREZJAM!)
 * Added Vector support to divide()
 * 12th June 2019:
 * Fixed limitTo() behaviour
 * Added setTo() that uses the old limitTo() behaviour
 * Squash a nasty bug in angleFrom()
 * Fix & update the test suite to cover new and bugfixed functionality
 * Squash another nasty bug in .minComponent and .maxComponent involving negative numbers
 */

class Vector {
  x: number;
  y: number;
  // Constructor
  constructor(inX, inY) {
    if (typeof inX != "number") throw new Error("Invalid x value.");
    if (typeof inY != "number") throw new Error("Invalid y value.");

    // Store the (x, y) coordinates
    this.x = inX;
    this.y = inY;
  }

  /**
   * Add another Vector to this Vector.
   * @param	{Vector}	v	The Vector to add.
   * @return	{Vector}	The current Vector. useful for daisy-chaining calls.
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  /**
   * Take another Vector from this Vector.
   * @param  {Vector} v The Vector to subtrace from this one.
   * @return {Vector}   The current Vector. useful for daisy-chaining calls.
   */
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  /**
   * Divide the current Vector by a given value.
   * @param  {Number|Vector} value The number (or Vector) to divide by.
   * @return {Vector}	   The current Vector. Useful for daisy-chaining calls.
   */
  divide(value) {
    if (value instanceof Vector) {
      this.x /= value.x;
      this.y /= value.y;
    } else if (typeof value == "number") {
      this.x /= value;
      this.y /= value;
    } else throw new Error("Can't divide by non-number value.");

    return this;
  }

  /**
   * Multiply the current Vector by a given value.
   * @param  {Number|Vector} value The number (or Vector) to multiply the current Vector by.
   * @return {Vector}	   The current Vector. useful for daisy-chaining calls.
   */
  multiply(value) {
    if (value instanceof Vector) {
      this.x *= value.x;
      this.y *= value.y;
    } else if (typeof value == "number") {
      this.x *= value;
      this.y *= value;
    } else throw new Error("Can't multiply by non-number value.");

    return this;
  }

  /**
   * Move the Vector towards the given Vector by the given amount.
   * @param  {Vector} v      The Vector to move towards.
   * @param  {Number} amount The distance to move towards the given Vector.
   */
  moveTowards(v, amount) {
    // From http://stackoverflow.com/a/2625107/1460422
    var dir = new Vector(v.x - this.x, v.y - this.y).limitTo(amount);
    this.x += dir.x;
    this.y += dir.y;

    return this;
  }

  /**
   * Rounds the x and y components of this Vector down to the next integer.
   * @return	{Vector}	This Vector - useful for diasy-chaining.
   */
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }
  /**
   * Rounds the x and y components of this Vector up to the next integer.
   * @return	{Vector}	This Vector - useful for diasy-chaining.
   */
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }
  /**
   * Rounds the x and y components of this Vector to the nearest integer.
   * @return	{Vector}	This Vector - useful for diasy-chaining.
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  /**
   * Calculates the 'area' of this Vector and returns the result.
   * In other words, returns x * y. Useful if you're using a Vector to store
   * a size.
   * @return {Number} The 'area' of this Vector.
   */
  area() {
    return this.x * this.y;
  }

  /**
   * Snaps this Vector to an imaginary square grid with the specified sized
   * squares.
   * @param	{Number}	grid_size	The size of the squares on the imaginary  grid to which to snap.
   * @return	{Vector}	The current Vector - useful for daisy-chaining.
   */
  snapTo(grid_size) {
    this.x = Math.floor(this.x / grid_size) * grid_size;
    this.y = Math.floor(this.y / grid_size) * grid_size;

    return this;
  }

  /**
   * Limit the length of the current Vector to value without changing the
   * direction in which the Vector is pointing.
   * @param  {Number} value The number to limit the current Vector's length to.
   * @return {Vector}	   The current Vector. Useful for daisy-chaining calls.
   */
  limitTo(value) {
    if (typeof value != "number")
      throw new Error("Can't limit to non-number value.");

    if (this.length > value) {
      this.divide(this.length);
      this.multiply(value);
    }

    return this;
  }

  /**
   * Like limitTo(), but explicitly sets the length of the Vector without changing the direction.
   * In other words, it acts like limitTo, but also scales up small Vectors to match the specified length.
   * @param	{Number}	value	The length to set the Vector to.
   */
  setTo(value) {
    if (typeof value != "number")
      throw new Error("Can't limit to non-number value.");

    this.divide(this.length);
    this.multiply(value);

    return this;
  }

  /**
   * Return the dot product of the current Vector and another Vector.
   * @param  {Vector} v   The other Vector we should calculate the dot product with.
   * @return {Vector}	 The current Vector. Useful for daisy-chaining calls.
   */
  dotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculate the angle, in radians, from north to another Vector.
   * @param	{Vector}	v	The other Vector to which to calculate the angle.
   * @return	{Vector}	The current Vector. Useful for daisy-chaining calls.
   */
  angleFrom(v) {
    // From http://stackoverflow.com/a/16340752/1460422
    var angle = Math.atan2(v.y - this.y, v.x - this.x);
    angle += Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    return angle;
  }

  /**
   * Clones the current Vector.
   * @return {Vector} A clone of the current Vector. Very useful for passing around copies of a Vector if you don't want the original to be altered.
   */
  clone() {
    return new Vector(this.x, this.y);
  }

  /*
   * Returns a representation of the current Vector as a string.
   * @returns {string} A representation of the current Vector as a string.
   */
  toString() {
    return `(${this.x}, ${this.y})`;
  }

  /**
   * Whether the Vector is equal to another Vector.
   * @param  {Vector} v The Vector to compare to.
   * @return {boolean}  Whether the current Vector is equal to the given Vector.
   */
  equalTo(v) {
    return this.x == v.x && this.y == v.y;
  }

  /**
   * Get the unit Vector of the current Vector - that is a Vector poiting in the same direction with a length of 1. Note that this does *not* alter the original Vector.
   * @return {Vector} The current Vector's unit form.
   */
  get unitVector() {
    var length = this.length;
    return new Vector(this.x / length, this.y / length);
  }

  /**
   * Get the length of the current Vector.
   * @return {Number} The length of the current Vector.
   */
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get the value of the minimum component of the Vector.
   * @return {Number} The minimum component of the Vector.
   */
  get minComponent() {
    if (Math.abs(this.x) < Math.abs(this.y)) return this.x;
    return this.y;
  }

  /**
   * Get the value of the maximum component of the Vector.
   * @return {Number} The maximum component of the Vector.
   */
  get maxComponent() {
    if (Math.abs(this.x) > Math.abs(this.y)) return this.x;
    return this.y;
  }
}

/**
 * Returns a new Vector based on an angle and a length.
 * @param	{Number}	angle	The angle, in radians.
 * @param	{Number}	length	The length.
 * @return	{Vector}	A new Vector that represents the (x, y) of the specified angle and length.
 */
Vector.fromBearing = function (angle, length) {
  return new Vector(length * Math.cos(angle), length * Math.sin(angle));
};

Vector.zero = new Vector(0, 0);
Vector.one = new Vector(1, 1);

export default Vector;
