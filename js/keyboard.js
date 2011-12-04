// Copyright (c) 2010 Glug Glug LLC
// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function KeyHandler() {
    var self = this,
        i;
    self.command_names = ['left', 'right', 'up', 'down', 'dbg', 'frame_graph', 
                          'action', 'crash_a', 'crash_b', 'pause', 'cheat', 'unlockwin', 'unlock'];
    self.commands = {};
    for(i = 0; i < self.command_names.length; i++) {
        self.commands[self.command_names[i]] = i;
    }
    self.keymapping = [];
    self.keymapping[87] = self.commands.up;    // w
    self.keymapping[65] = self.commands.left;  // a
    self.keymapping[83] = self.commands.down;  // s
    self.keymapping[68] = self.commands.right; // d
    
    self.keymapping[73] = self.commands.up;    // i
    self.keymapping[74] = self.commands.left;  // j
    self.keymapping[75] = self.commands.down;  // k
    self.keymapping[76] = self.commands.right; // l
    
    self.keymapping[38] = self.commands.up;    // up
    self.keymapping[37] = self.commands.left;  // left
    self.keymapping[40] = self.commands.down;  // down
    self.keymapping[39] = self.commands.right; // right
    
    self.keymapping[104] = self.commands.up;    // kp up
    self.keymapping[100] = self.commands.left;  // kp left
    self.keymapping[98] = self.commands.down;   // kp down
    self.keymapping[102] = self.commands.right; // kp right
    
    self.keymapping[32] = self.commands.action; // SPACE
    self.keymapping[80] = self.commands.pause;  // p
    
    self.keymapping[27] = self.commands.dbg;    // ESCAPE
    self.keymapping[71] = self.commands.frame_graph;   // g
    self.keymapping[192] = self.commands.crash_a;   // `
    self.keymapping[191] = self.commands.crash_b;   // /
    self.keymapping[79] = self.commands.cheat;   // o
    self.keymapping[85] = self.commands.unlockwin; // u
    self.keymapping[89] = self.commands.unlock; // y
    
    self._batched = [];
    self.state = [];
    self.any_key = {downThisFrame: false, upThisFrame: false};
    self.prevBatchTime = self.batchTime = new Date().getTime();
    for(i = 0; i < self.command_names.length; i++) {
        self.state[i] = {
            command: self.command_names[i],
            dir: 'up',
            changedThisFrame: false,
            changedAt: null,
            presses: [],
            doubleTapMs: 99999,
            lastDownTime: 0
        };
    }
    self.keyDown = function(evt) {
        if(evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) { return; }
        evt.dir = "down";
        self._batched.push(evt);
        return false;
    };
    self.keyUp = function(evt) {
        if(evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) { return; }
        evt.dir = "up";
        self._batched.push(evt);
        return false;
    };
    self.onBlur = function() {
        for(var i = 0; i < self.state.length; i++) {
            self.state[i].dir = "up";
        }
    };
    self.update = function() {
        var batched = self._batched,
            i;
        self._batched = [];
        self.prevBatchTime = self.batchTime;
        self.batchTime = new Date().getTime();
        for(i = 0; i < self.state.length; i++) {
            self.state[i].presses = [];
            self.state[i].changedThisFrame = false;
        }
        self.any_key.downThisFrame = false;
        self.any_key.upThisFrame = false;
        for(i = 0; i < batched.length; i++) {
            var evt = batched[i];
            assert((evt.dir === 'down' || evt.dir === 'up'), "bad dir:", evt.dir, "on", evt);
            if(evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) { continue; }
            if(evt.dir == 'up') {
                self.any_key.upThisFrame = true;
            } else if(evt.dir == 'down') {
                self.any_key.downThisFrame = true;
            }
            var command = self.keymapping[evt.keyCode];
            if(command === undefined) {
                debug('unknown key code', evt.keyCode);
                continue;
            }
            var st = self.state[command];
            if (st.dir == evt.dir) { continue; }  // ignore repeated keydowns
            st.dir = evt.dir;
            if(evt.dir == 'up') {
                st.presses.push([st.changedAt, evt.timeStamp]);
                st.doubleTapMs = 350;
            }
            if (evt.dir == 'down')
            {
               // round to to the nearest 50 ms
               st.doubleTapMs = Math.ceil((evt.timeStamp - st.lastDownTime) / 50) * 50;
               st.lastDownTime = evt.timeStamp;
            }
            st.changedThisFrame = true;
            st.changedAt = evt.timeStamp;
        }
    };
    // boolean function that returns whether a key is down
    self.down = function(command) {
        var st = self.state[command];
        if(st === undefined) { return false; }
        return st.dir == 'down'; 
    };
    // returns number of milliseconds that a key was pressed in the last frame, including bouncing
    self.ms_pressed = function(command, max_pressed) {
        var st = self.state[command];
        if(st === undefined) { return 0; }
        var pressed = 0;
        if(st.presses.length > 0) {
            for(var i = 0; i < st.presses.length; i++) {
                var p = st.presses[i];
                if(p[1] > self.batchTime) {
                    if(p[0] > self.batchTime) {
                        pressed += p[1] - p[0];                
                    } else {
                        pressed += p[1] - self.batchTime;
                    }
                }
            }
        }
        if(st.dir == "down") {
            pressed += self.batchTime - self.prevBatchTime;
        }
        if(max_pressed !== undefined && pressed > max_pressed) {
            return max_pressed;
        }
        return pressed;
    };
    // returns a value between 1 and 2 -- with 2 being zero time between taps, 
    // and 1 being > 300 ms between taps (I seem to get at best 1.4)
    self.doubleTapped = function(command) {
        var st = self.state[command];
        if(st === undefined) { return 1; }
        if (st.doubleTapMs <= 300) {
            return 533 / (st.doubleTapMs + 233);
        }
        return 1;
    };
    // returns true if the key was released this frame (edge trigger)
    self.released = function(command) {
        var st = self.state[command];
        if(st === undefined) { return false; }
        return st.changedThisFrame && st.dir == 'up';
    };
    // returns true if the key was pressed this frame (edge trigger)
    self.pressed = function(command) {
        var st = self.state[command];
        if(st === undefined) { return false; }
        return st.changedThisFrame && st.dir == 'down';    
    };
}

