// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

var levels = [
// 1
{layout:"" +
"   C         A     C     B     A       A         B  B       X   \n" +
"       A  A           B         A            B     A            \n" +
"   B      B   C   A       A   B      C    A  A       A    C     \n" +
" A      B    A   A     AC     A            B  A    A    A    B  \n" +
"     C        A            C        A  C       C       B        \n" +
"            A         C       A                    A   B     A  \n" +
"   C       A       A                 B       A      C           \n" +
"      A        B        A  C    B        C     A          A     \n",
 background:'background01'
 },
 // 2
{layout:"" +
"                          A                       B         X   \n" +
"       A                                                        \n" +
"                              B                                 \n" +
"                                         B                 C    \n" +
"    B                                                           \n" +
"                        C                                       \n" +
"                                          B                     \n" +
"                   A                                            \n",
 background:'background01'
 }
 ]


function ScreenGame(levelidx) {
    this.next_screen = null;
    this.exitpos = null;
    
    this.characters = [];
    this.characters.push(new Student()); // player
        
    this.levelidx = levelidx;
    this.level = levels[levelidx];
    this.asset_suffixes = ['a', 'b', 'c'];
    this.parseLevel(this.level.layout);
    this.collider = new Collider();
}

ScreenGame.prototype.update = function(screenManager, keyboard, run, camera) {
    // Update the NPCs.
    this.collider.set_colliders(this.characters);
    for (var i=1; i<this.characters.length; i++) {
        this.characters[i].update(run, camera, this.collider);
    }
    // Update the player.
    var player = this.characters[0];
    player.updatePlayer(keyboard, run, camera, this.collider)
    
    // Our first student is the player.  Update the camera based on his position.
    var cameraPos = new Vector2D(player.pos.x - 160, 0);
    if (cameraPos.x < 0)
        cameraPos.x = 0;
    if (cameraPos.x > gameWidth-640)
        cameraPos.x = gameWidth-640;
    camera.set_pos(cameraPos);
    
    // detect whether the player is at the exit
    if(this.exitpos && 
       player.pos.x >= this.exitpos.x - 20 && player.pos.x <= this.exitpos.x + 20 &&
       player.pos.y >= this.exitpos.y - 20 && player.pos.y <= this.exitpos.y + 20) {
        this.next_screen = new ScreenGame(this.levelidx+1); // just restart this level for now
    }

};

ScreenGame.prototype.draw = function(layers, run, camera) {
    var ctx = layers.bg.ctx;
    ctx.clearRect(0, 0, 640, 480);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fillRect(0, 0, 640, 480);
    ctx.drawImage(asset_manager.assets[this.level.background], -camera.x(), camera.y());
    
    ctx = layers.player.ctx;
    ctx.clearRect(0,0,640,480);
    
    var back2front = this.characters.slice(0,this.characters.length);
    back2front.sort(function(a,b) { return a.pos.y - b.pos.y; });
    
    for (var i = 0; i < back2front.length; i++) {
        back2front[i].draw(layers, run, camera);
    }
};

ScreenGame.prototype.parseLevel = function(levelStr) {
    var player = this.characters[0];
    var lines = levelStr.split("\n");
    var n = 0;
    for(var j = 0; j < lines.length; j++) {
        var line = lines[j];
        for(var i = 0; i < line.length; i++) {
            var chr = line[i];
            if(chr != ' ') {
                var pos = new V2(i * 40, j * 40 + 160 - 40);
                if(chr === 'X') {
                    this.exitpos = pos;
                    continue;
                }
                var npc = new Student();
                do {                
                    n += 1;
                    npc.asset_name = 'char01' + this.asset_suffixes[n % this.asset_suffixes.length];
                } while(npc.asset_name == player.asset_name);
                npc.pos = pos;
                npc.seed = n;
                if(chr === 'A')
                    npc.ai = pace_horiz;
                if(chr === 'B')
                    npc.ai = pace_vert;
                if(chr === 'C')
                    npc.speed = 0;
                this.characters.push(npc);
            }
        }
    }
};
