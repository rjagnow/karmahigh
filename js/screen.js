// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function Screen() {
    this.next_screen = null;
    this.prev_ybob = 10;
    this.ybob = 10;
}

Screen.prototype.update = function(screenManager, keyboard, run) {
    this.prev_ybob = this.ybob;
    this.ybob = parseInt(Math.cos(run.gameTime/100.0) * 10 + 10);
    
    if(keyboard.pressed(keyboard.commands.up)) {
        console.log("up");
    }
};

Screen.prototype.draw = function(layers, run) {
    var ctx = layers.player.ctx;
    ctx.clearRect(0, this.prev_ybob, 128, 128);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fillRect(0, this.ybob, 128, 128);
};


