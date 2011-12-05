// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function basic_move(run, camera, collider) {
    var delta = new V2(run.dt*this.speed*0.5, 0);
    this.pos.assign(collider.move_me(this, delta));
    this.setFrame(run, delta);
}

function pace_horiz(run, camera, collider) {
    pace.call(this, new V2(1, 0), run, camera, collider);
}

function pace_vert(run, camera, collider) {
    pace.call(this, new V2(0, 1), run, camera, collider);
}


function pace(filter, run, camera, collider) {
    if(this.turn_time == null) { // initialization
        this.pace_delay = (this.seed % 8) * 500 + 1000;
        this.turn_time = run.gameTime + this.pace_delay;
        this.mult = 1;
    }
    if(run.gameTime > this.turn_time) {
        this.mult = -this.mult;
        this.turn_time = run.gameTime + this.pace_delay;
    }
    var mov = run.dt*this.speed*0.5*this.mult;
    var delta = new V2(mov * filter.x, mov * filter.y);
    var newpos = collider.move_me(this, delta);
    if(newpos.equals(this.pos)) {
        this.mult = -this.mult;
        this.turn_time = run.gameTime + this.pace_delay;
    }
    var moveDelta = newpos.dup().minusEq(this.pos);
    this.pos.assign(newpos);
    this.setFrame(run, moveDelta);
}

function attack_player(run, camera, collider) {
    if(this.can_see_player == null) {
        this.can_see_player = false;
        // face in a random direction on initialization
        if((this.seed % 2) > 0) {
            this.setFrame(run, new V2(-1, 0));
        }
        this.punch_interval = 1600 + (this.seed % 4) * 300;
        this.punch_delay = 2000;
    }
    var player = collider.colliders[0];   // hack: player is first element in collider.colliders
    if(Math.abs(this.pos.x - player.pos.x) < viewWidth - 300) { // only detect the player when it gets close enough
        this.can_see_player = true;
    }
    if(this.can_see_player) {
        var pdelta = player.pos.dup().minusEq(this.pos);
        var moveDelta = pdelta.normalizeEq().scaleEq(this.speed*0.5*run.dt);
        this.pos.assign(collider.move_me(this, moveDelta));
        this.setFrame(run, moveDelta);
        
        this.punch_delay -= run.dt;
        if(this.punch_delay < 0) {
            this.punching = 200; // slightly longer than player's 150
            this.punch_delay = 2000;
        }
    }
}
