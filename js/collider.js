// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function Collider() {
    var sz = 40 - 5;
    var self = this;
    self.set_colliders = function(chars) {
        self.colliders = chars;
    }
    self.move_me = function(student, delta) {
        var colliders = self.colliders;
        var to = student.pos.dup().plusEq(delta);
        
        for(var i = 0; i < colliders.length; i++) {
            if(colliders[i] === student) continue;  // avoid self-collision
            
            var o = colliders[i].pos;
            if(to.x >= o.x - sz && to.x <= o.x + sz &&
               to.y > o.y - sz && to.y <= o.y + sz) {
                return student.pos;
            }
        }
        
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
