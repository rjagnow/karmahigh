// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function Student() {
    var self = this;
    self.pos = new Vector2D(80, 200);
    self.frame = 0;
    self.frameInterval = 150;
    self.nextFrame = self.frameInterval;
    self.speed = 0.15;
    self.orientation = 0;  // 0=right, 1=left, 2=up, 3=down.
    self.asset_name = "char01c";
    self.ai = null;
    self.x = function() {
        return self.position.x;
    };
    self.y = function() {
        return self.position.y;
    };
    
    // Update function for the NPC.
    self.update = function(run, camera, collider) {
        if(self.ai) {
            self.ai(run, camera, collider);
        }
    }
    
    // Update function for the player.
    self.updatePlayer = function(keyboard, run, camera, collider) {
        var delta = new V2(0, 0);
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
        self.pos.assign(collider.move_me(self, delta));
        self.setFrame(run, delta);
    }
    
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
                if (self.frame == 2)
                    self.frame = 3;
                else
                    self.frame = 2;
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
        else if (delta.x < 0 && (self.frame != 2 && self.frame != 3)) {
            self.frame = 2;
            self.nextFrame = self.frameInterval;
        }
    }
    
    self.draw = function(layers, run, camera) {
        var ctx = layers.player.ctx;
        var viewPos = camera.transform(self.pos)
        ctx.drawImage(asset_manager.assets[self.asset_name], 0+self.frame*40, 0, 40, 80, viewPos.x, viewPos.y, 40, 80);
    }
}
