// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function ScreenMain() {
    this.next_screen = null;
    this.option = 0;
}

ScreenMain.prototype.update = function(screenManager, keyboard, run, camera) {
    // Advance when the user presses space.
    if (keyboard.pressed(keyboard.commands.action)) {
        this.next_screen = new ScreenSelect(0);
    }
    if (keyboard.pressed(keyboard.commands.down) || keyboard.pressed(keyboard.commands.up)) {
        this.option = (this.option+1)%2;
    }
};

ScreenMain.prototype.draw = function(layers, run, camera) {
    var ctx = layers.bg.ctx;
    ctx.clearRect(0, 0, 640, 480);
    ctx.drawImage(asset_manager.assets["screen_menu"], 0, 0);
    
    ctx = layers.player.ctx;
    ctx.clearRect(0,0,640,480);
    if (this.option == 0)
        ctx.drawImage(asset_manager.assets["arrow_horiz"], 120, 320);
    else
        ctx.drawImage(asset_manager.assets["arrow_horiz"], 120, 380);
    
    ctx = layers.hud.ctx;
    ctx.clearRect(0,0,640,480);
};
