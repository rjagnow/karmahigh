// Copyright (c) 2011 Glug Glug LLC
// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

'use strict';
/**
 * @constructor
 */
var Vector2D = function(x, y)
{
    this.x = x;
    this.y = y;
};

Vector2D.prototype.equals = function(o) {
    return (this.x === o.x && this.y === o.y);
};

Vector2D.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

Vector2D.prototype.assign = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
};

Vector2D.prototype.copy = Vector2D.prototype.assign;

Vector2D.prototype.clone = function() {
    return new Vector2D(this.x, this.y);
};
Vector2D.prototype.dup = Vector2D.prototype.clone;

Vector2D.prototype.lengthSquared = function() {
    return this.x * this.x + this.y * this.y;
};

Vector2D.prototype.length = function() {
    return Math.sqrt(this.lengthSquared());
};

Vector2D.prototype.scaleEq = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
};

Vector2D.prototype.minusEq = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

Vector2D.prototype.plusEq = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

Vector2D.prototype.convolveEq = function(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
};

Vector2D.prototype.plusEq2 = function(x, y) {
    this.x += x;
    this.y += y;
    return this;
};

Vector2D.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

Vector2D.prototype.normalizeEq = function() {
    if (this.length() !== 0) {
        this.scaleEq(1 / this.length());
    }
    return this;
};

Vector2D.prototype.floorEq = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
};
Vector2D.prototype.ceilEq = function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
};
Vector2D.prototype.absEq = function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
};
Vector2D.prototype.rotateCwEq = function() {
    var tmp = this.x;
    this.x = this.y;
    this.y = -tmp;
    return this;
};
Vector2D.prototype.rotateCcwEq = function() {
    var tmp = this.x;
    this.x = -this.y;
    this.y = tmp;
    return this;
};
Vector2D.prototype.toString = function() {
    return "V2(" + this.x + ", " + this.y + ")";
};

/**
 * @constructor
 */
var V2 = Vector2D;
V2.zero = function() {
    return new Vector2D(0, 0);
};

/**
 * @constructor
 */
var Box2D = function(pos, size) {
    this.pos = pos;
    this.size = size;
};
Box2D.prototype.constructor = Box2D;
Box2D.prototype.ptWithin = function(pt) {
    return (pt.x > this.pos.x && pt.x < (this.pos.x + this.size.x) &&
        pt.y > this.pos.y && pt.y < (this.pos.y + this.size.y));
};
Box2D.prototype.center = function() {
    return new V2(this.pos.x + this.size.x / 2,
        this.pos.y + this.size.y / 2);
};
// returns a vector that is the smallest addition to v such that it'd
// be inside the box
Box2D.prototype.distanceToEdge = function(v) {
    var retval = V2.zero();
    if (v.x < this.pos.x) {
        retval.set(this.pos.x - v.x, 0);
    } else if (v.x > this.pos.x + this.size.x) {
        retval.set((this.pos.x + this.size.x) - v.x, 0);
    } // todo else
    if (v.y < this.pos.y) {
        retval.set(retval.x, this.pos.y - v.y);
    } else if (v.y > this.pos.y + this.size.y) {
        retval.set(retval.x, (this.pos.y + this.size.y) - v.y);
    } // todo else
    return retval;
};
Box2D.prototype.setCenter = function(v) {
    this.pos.set(v.x - this.size.x / 2,
        v.y - this.size.y / 2);
};
Box2D.prototype.toString = function() {
    return "B2(" + this.pos.toString() + ", " + this.size.toString() + ")";
};
var B2 = Box2D;

