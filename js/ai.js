
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
