// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

var levels = [
// 1
{layout:"" +
"A                A       A  A      B   A      A    B        X B \n" +
"B       A        B      A    A  A          A       A           \n" +
"            A     A      A    B       A    A   B                \n" +
"          A             A    A     A     B          B      A    \n" +
"    A         B     B    A            A         A              B \n" +
"       A      A         A    A                     B       A   \n" +
"             B        A      A            B         B           \n" +
" A     B           A    B      BA     A           A         A   \n",
 background:'background01' },
 // 2
 {layout:"" +
" B          B    A      A        A      A  B   A    B    A X   A\n" +
"        A         A      BA      A               A         A    \n" +
"A        A   B   A B   A       A B    A      A     A         A  \n" +
" A   A                 A     A      A    B   A       A     A   A\n" +
"   A B       B  A   A           A                 A      A   A  \n" +
"       A          B     A        A         A    B     AB BB     \n" +
"    A      A B    A    A      B  A        B    A            A   \n" +
"      A  B     A   A           A    B        A        A      A  \n",
 background:'background01' },
 // 3
 {layout:"" +
"   B         A     C     B     A       A         B  B       X   \n" +
"       A  A           B         A            B     A         C  \n" +
"   B      B   B   A       A   B      C    A  A       A    C     \n" +
" A      B    A   A     A A    A            B  A    A    A    B  \n" +
"     A  A      A            B        A  A       C       B        \n" +
"            A         A       A                    A   B     A  \n" +
"   A       A       A                 B       A      B           \n" +
"      A        B        A  C    B        B     A          A     \n",
 background:'background01' }
 ]


function ScreenGame(levelidx, gameState) {
    this.next_screen = null;
    this.exitpos = null;
    this.remaining_time = 30000; // 30 seconds to level end
    
    this.characters = [];
    var player = new Student(0);
    player.asset_name = 'char0' + (levelidx + 1) + 'c';
    if(levelidx == 2)  player.can_punch = false;
    gameState.levels[levelidx].asset_name = player.asset_name;
    this.characters.push(player);
        
    this.levelidx = levelidx;
    this.level = levels[levelidx];
    this.asset_prefixes = ['char01', 'char02', 'char03'];
    this.asset_suffixes = ['a', 'b', 'c'];
    this.parseLevel(this.level.layout, gameState);
    this.collider = new Collider();
    
    // start fade from black to game on construction
    this.fade(0.0, 1000, null);
}

ScreenGame.prototype.positionCamera = function(player, camera) {
    // the camera should be a bit back of the player generally, but clamped to the background
    var cameraPos = new Vector2D(player.pos.x - 160, 0);
    if (cameraPos.x < 0)
        cameraPos.x = 0;
    if (cameraPos.x > gameWidth-640)
        cameraPos.x = gameWidth-640;
    camera.set_pos(cameraPos);
}

ScreenGame.prototype.update = function(screenManager, keyboard, run, camera, gameState) {
    if(this.fade_progress > 0) {
        this.positionCamera(this.characters[0], camera);
        return;
    }
    
    // check time limit
    this.remaining_time -= run.dt;
    if(this.remaining_time < 0) {
        this.fade(1.0, 1000, function() {
            this.next_screen = new ScreenGame(this.levelidx, gameState); // another failure case
        });
    }

    // Update the NPCs.
    this.collider.set_colliders(this.characters);
    for (var i=1; i<this.characters.length; i++) {
        this.characters[i].update(run, camera, this.collider);
    }
    // Update the player.
    var player = this.characters[0];
    player.updatePlayer(keyboard, run, camera, this.collider);
    if(player.punched_a_guy) {
        gameState.levels[this.levelidx].attacked = true;
    }
    this.positionCamera(player, camera);
    
    // detect whether the player is at the exit
    if(this.exitpos && 
       player.pos.x >= this.exitpos.x - 20 && player.pos.x <= this.exitpos.x + 20 &&
       player.pos.y >= this.exitpos.y - 20 && player.pos.y <= this.exitpos.y + 20) {
        this.fade(1.0, 1000, function() {
            this.next_screen = new ScreenSelect(this.levelidx+1);
        });
    } else {
        // detect player beat down
        if(player.dead_time > 300) {
            this.fade(1.0, 1000, function() {
                this.next_screen = new ScreenGame(this.levelidx, gameState); // failure == restarting level for now
            });
        }
    }
};

ScreenGame.prototype.fade = function(goal, time, cb) {
    // set up state to fade to/from black, with optional callback after it's done
    this.fade_goal = goal;
    this.fade_progress = this.fade_total = time;
    this.fade_callback = cb
};

ScreenGame.prototype.draw = function(layers, run, camera) {
    var ctx = layers.bg.ctx;
    ctx.clearRect(0, 0, 640, 480);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fillRect(0, 0, 640, 480);
    ctx.drawImage(asset_manager.assets[this.level.background], -camera.x(), camera.y());
    
    ctx = layers.player.ctx;
    ctx.clearRect(0,0,viewWidth,viewHeight);
    
    var back2front = this.characters.slice(0,this.characters.length);
    back2front.sort(function(a,b) { return a.pos.y - b.pos.y; });
    
    for (var i = 0; i < back2front.length; i++) {
        back2front[i].draw(layers, run, camera);
    }
    
    ctx = layers.hud.ctx;
    if(this.fade_progress > 0) {
        var opacity = 0;
        if(this.fade_goal === 0.0) {
            opacity = (1.01 * this.fade_progress)/this.fade_total;
        }
        if(this.fade_goal === 1.0) {
            opacity = 1 - (1.01 * this.fade_progress)/this.fade_total;
        }
        ctx.clearRect(0,0,viewWidth, viewHeight);
        ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
        ctx.fillRect(0,0,viewWidth,viewHeight);
        
        this.fade_progress -= run.dt;
        if(this.fade_progress < 0) 
        {
            this.fade_progress = 0;
            if(this.fade_callback) {
                this.fade_callback();
                this.fade_callback = null;
            }
        }
    } else {
        // draw HUD
        var txt = "" + Math.round(this.remaining_time/1000);
        ctx.clearRect(0,0, viewWidth, viewHeight);
        ctx.font = 'bold 30px monospace';
        var txtwidth = ctx.measureText(txt).width;
        var timepos = new V2((viewWidth - txtwidth)/2, 40);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillText(txt, timepos.x + 2, timepos.y + 2);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillText(txt, timepos.x, timepos.y);
    }
};

function asset_is_player_asset(asset_name, gameState) {
    for(var i = 0; i < gameState.levels.length; i++) {
        if(gameState.levels[i].asset_name === asset_name)
            return true;
    }
    return false;
}

ScreenGame.prototype.parseLevel = function(levelStr, gameState) {
    var player = this.characters[0];
    var lines = levelStr.split("\n");
    var have_attackers = false;
    for(var i = 0; i < gameState.levels.length; i++) {
        if(gameState.levels[i].attacked)
            have_attackers = true;
    }
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
                
                do {
                    var x = parseInt(Math.random() * this.asset_prefixes.length);
                    var y = parseInt(Math.random() * this.asset_suffixes.length);
                    var asset_name = this.asset_prefixes[x] + this.asset_suffixes[y];
                } while(asset_is_player_asset(asset_name, gameState));
                var npc = new Student(n);
                npc.asset_name = asset_name;
                npc.pos = pos;
                if(chr === 'A')
                    npc.ai = pace_horiz;
                if(chr === 'B')
                    npc.ai = pace_vert;
                if(chr === 'C') {
                    // attackers use previous player char avatars
                    do {
                        var pidx = parseInt(Math.random() * (gameState.levels.length));
                    } while(pidx == this.levelidx);
                    npc.asset_name = gameState.levels[pidx].asset_name;
                    if(have_attackers) {
                        npc.ai = attack_player;
                    } else {
                        npc.ai = pace_horiz;
                    }
                }
                this.characters.push(npc);
            }
        }
    }
};
