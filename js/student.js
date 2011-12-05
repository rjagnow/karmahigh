// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function Student(seed) {
    var self = this;
    self.seed = seed;
    self.pos = new Vector2D(80, 200);
    if(seed % 2 > 0) {
        self.frame = 3;
    } else {
        self.frame = 0;
    }
    self.frameInterval = 150;
    self.nextFrame = self.frameInterval;
    self.speed = 0.15;
    self.orientation = 0;  // 0=right, 1=left, 2=up, 3=down.
    self.asset_name = "char01c";
    self.can_punch = true;
    self.punching = 0;
    self.punched_a_guy = false;
    self.dead = false;
    self.dead_time = 0;
    self.ai = null;
    self.x = function() {
        return self.position.x;
    };
    self.y = function() {
        return self.position.y;
    };
    
    self.dead_update = function(run, camera, collider) {
        if(self.dead) {
            if(self.dead_time % 300 > 150) {
                self.frame = 8;
            } else {
                self.frame = 9;
            }
            self.dead_time += run.dt;
        }
    };
    
    // Update function for the NPC.
    self.update = function(run, camera, collider) {
        self.dead_update(run, camera, collider);
        if(self.dead) return;

        if(self.punching > 0) {
            self.punching -= run.dt;
            self.nextFrame = self.frameInterval;
            self.deal_damage(run, collider);
        }
    
        if(self.ai) {
            self.ai(run, camera, collider);
        }
    };
    
    // Update function for the player.
    self.updatePlayer = function(keyboard, run, camera, collider) {
        var delta = new V2(0, 0);

        self.dead_update(run, camera, collider);
        if(self.dead) return;
        
        if(keyboard.down(keyboard.commands.action) && self.can_punch) {
            self.punching = 150;
            self.nextFrame = self.frameInterval;
        } else {
            if(self.punching > 0) {
                self.punching -= run.dt;
                self.nextFrame = self.frameInterval;
            }
            if (keyboard.down(keyboard.commands.right)) {
                delta.x += run.dt*self.speed;
            }
            else if (keyboard.down(keyboard.commands.left)) {
                delta.x -= run.dt*self.speed;
            }
            if (keyboard.down(keyboard.commands.up)) {
                delta.y -= run.dt*self.speed;
            }
            else if (keyboard.down(keyboard.commands.down)) {
                delta.y += run.dt*self.speed;
            }
        }
        
        if(self.punching > 0) {
            self.deal_damage(run, collider);
        }
        
        self.pos.assign(collider.move_me(self, delta));
        self.setFrame(run, delta);
    };
    
    self.deal_damage = function(run, collider) {
        // this is really cheap, calling the move routine "forward" and seeing whether it would have let us move in that direction
        var direction;
        if(self.frame < 3)
            direction = new V2(20, 0);
        else
            direction = new V2(-20, 0);
        var punchPos = this.pos.dup().plusEq(direction);
        var colliders = collider.detect_colliders(this, punchPos);
        for(var i = 0; i < colliders.length; i++) {
            colliders[i].dead = true;
            self.punched_a_guy = true;
        }
    };
    
    // Change the frame of the animation depending on how the character is moving.
    self.setFrame = function(run, delta) {
        self.nextFrame -= run.dt;
        if (self.nextFrame <= 0) {
            if (delta.x > 0) {
                // Moving right.
                if (self.frame == 0)
                    self.frame = 1;
                else
                    self.frame = 0;
            }
            else if (delta.x < 0) {
                // Moving left
                if (self.frame == 3)
                    self.frame = 4;
                else
                    self.frame = 3;
            }
            // Else stationary.
                
            // Reset the frame timer.
            self.nextFrame = self.frameInterval;
        }
        // If we just changed orientation, change the frame immediately.
        else if (delta.x > 0 && (self.frame != 0 && self.frame != 1)) {
            self.frame = 0;
            self.nextFrame = self.frameInterval;
        }
        else if (delta.x < 0 && (self.frame != 3 && self.frame != 4)) {
            self.frame = 3;
            self.nextFrame = self.frameInterval;
        }
    };
    
    self.draw = function(layers, run, camera) {
        var ctx = layers.player.ctx;
        var viewPos = camera.transform(self.pos)
        if(self.punching > 0) {
            // hackily figure out whether punching left or right
            var punchFrame;
            if(self.frame < 3)
                punchFrame = 2;
            else
                punchFrame = 5;
            ctx.drawImage(asset_manager.assets[self.asset_name], 0+punchFrame*40, 0, 40, 80, viewPos.x, viewPos.y, 40, 80);
        } else {
            ctx.drawImage(asset_manager.assets[self.asset_name], 0+self.frame*40, 0, 40, 80, viewPos.x, viewPos.y, 40, 80);
        }
    };
}
