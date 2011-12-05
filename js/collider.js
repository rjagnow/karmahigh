// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function Collider() {
    var sz = 40 - 5;
    var self = this;
    self.set_colliders = function(chars) {
        self.colliders = chars;
    };
    
    self.detect_colliders = function(student, to) {
        var result = [];
        var colliders = self.colliders;
        for(var i = 0; i < colliders.length; i++) {
            if(colliders[i] === student) continue;  // avoid self-collision
            if(colliders[i].dead) continue;  // the dead are no obstacle
            
            var o = colliders[i].pos;
            if(to.x >= o.x - sz && to.x <= o.x + sz &&
               to.y > o.y - sz && to.y <= o.y + sz) {
                result.push(colliders[i]);
            }
        }
        return result;
    };
    
    self.move_me = function(student, delta) {
        var to = student.pos.dup().plusEq(delta);
        
        var colliders = self.detect_colliders(student, to);
        if(colliders.length > 0)
            return student.pos;
        
        // Wall collisions.
        if (to.x < 0)
            to.x = 0;
        if (to.x > gameWidth-40)
            to.x = gameWidth-40
        if (to.y < 120)
            to.y = 120;
        if (to.y > 480 - 80)
            to.y = 480 - 80;
        
        return to;
    };
}
