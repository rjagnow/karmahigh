// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function ScreenSelect(levelidx) {
    console.log("new ScreenSelect", levelidx);
    this.next_screen = null;
    this.levelidx = levelidx;
}

ScreenSelect.prototype.update = function(screenManager, keyboard, run, camera, gamestate) {
    // Advance when the user presses space, unless on win screen.
    if (this.levelidx <= 2 && keyboard.pressed(keyboard.commands.action)) {
        this.next_screen = new ScreenGame(this.levelidx, gamestate);
    }
};

ScreenSelect.prototype.draw = function(layers, run, camera) {
    var ctx = layers.bg.ctx;
    ctx.clearRect(0, 0, 640, 480);
    if (this.levelidx == 0) {
        ctx.drawImage(asset_manager.assets["screen_select_punch"], 0, 0);
    }
    else if (this.levelidx == 1) {
        ctx.drawImage(asset_manager.assets["screen_select_shout"], 0, 0);
    }
    else if (this.levelidx == 2) {
        ctx.drawImage(asset_manager.assets["screen_select"], 0, 0);
    }
    else {
        ctx.drawImage(asset_manager.assets["screen_win"], 0, 0);
    }
    
    ctx = layers.player.ctx;
    ctx.clearRect(0,0,640,480);
    
    ctx = layers.hud.ctx;
    ctx.clearRect(0,0,640,480);
};
