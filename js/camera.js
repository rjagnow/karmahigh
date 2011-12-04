// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

// camera maintains a viewport relative to a worldspace coordinate system
//  x, y, width, height

function Camera(width, height) {
    var self = this;
    var x_world = 0;
    var y_world = 0;
    self.width = width;
    self.height = height;
    self.x = function() {
        return x_world;
    };
    self.y = function() {
        return y_world;
    };
    // transform a Vector2 (point) from world-space to camera-space
    self.transform = function(v) {
        var res = v.dup();
        res.x -= x_world;
        res.y -= y_world;
        return res;
    };
    // set position in world coordinates
    self.set_pos = function(v) {
        x_world = v.x;
        y_world = v.y;
    };
}
