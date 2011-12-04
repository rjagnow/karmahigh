// Copyright (c) 2010 Glug Glug LLC
// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios
  
DEV = null;
DEBUG = null;

 /**
 * @constructor
 */
function Runner(ms) {
    var self = this;
    self.ms = ms; // the desired framerate
    self.dt = ms; // time delta since the last frame    
    self.gameTime = 0; // milliseconds since the game started
    self.ninety = undefined;
    self.frameTimer = undefined;
    self.lastFrame = undefined;
    self.startTime = undefined;
    self.fpsNinety = undefined;
    self.count = 0;
    self.renderFrameGraph = DEV && DEBUG;
    self.frameRecordCount = 30;
    self.frameTimes = [];
    self.executeTimes = [];
    self.renderAccum = 0;
    self.run = function () {
        var now = (new Date()).getTime();
        if (self.startTime !== undefined) {
            var dt = (now - self.startTime);
            if(dt === 0) {
                return;  // a 0 dt is going to fuck everything up
            }
            var fps = 1000/dt;
            if(fps > 0 && fps !== Infinity && !isNaN(fps)) {
                if(self.fpsNinety === undefined) {
                    self.fpsNinety = fps;
                } else {
                    self.fpsNinety = self.fpsNinety * 0.9 + fps * 0.1;
                }
            }
            // absorb large deviations from the average
            var avg_dt = 1000/self.fpsNinety;
            if(dt > avg_dt*4) {
                dt = avg_dt*4;
            } else if(self.dt < avg_dt/4) {
                dt = avg_dt/4;
            }
            self.dt = dt;
            self.gameTime += dt; // accumulate the game's idea of time
        }
        self.count += 1;
        if(DEV && self.renderFrameGraph) {
            self.frameTimes.push(self.dt);
            if(self.frameTimes.length > self.frameRecordCount) { self.frameTimes.shift(); }
        }
        self.startTime = now;
        //try {
            self.frame();
        //} catch (err) {
        //    self.stop();
        //    console.error(err);
        //}
        self.lastFrame = (new Date()).getTime() - self.startTime;
        if(DEV && self.renderFrameGraph) {
            self.executeTimes.push(self.lastFrame);
            if(self.executeTimes.length > self.frameRecordCount) { self.executeTimes.shift(); }
        }
        if (self.ninety === undefined) {
            self.ninety = self.lastFrame;
        } else {
            self.ninety = self.ninety * 0.9 + self.lastFrame * 0.1;
        }
    };
    self.start = function () {
        if (self.frameTimer) { clearTimeout(self.frameTimer); }
        self.frameTimer = setInterval(self.run, self.ms);
        self.startTime = (new Date()).getTime();        
    };
    self.stop = function () {
        if (self.frameTimer) { clearTimeout(self.frameTimer); }
    };
    self.render = function (ctx) {
        if(!(DEV && DEBUG)) { return;}
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(8 + (self.count % 100), 8, 1, 1);
    
        self.renderAccum += self.dt;
        if(self.renderAccum <= 100)  { return; }
        self.renderAccum = 0;

        var text = Math.round(self.ninety) + " ms " + Math.round(self.fpsNinety) + " fps";
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(8,8, 100, 12);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(text, 10, 10, 100);
        
        if(self.renderFrameGraph) {
            // render frame history
            var stdWidth = 20,
                chartHeight = 2 * self.frameRecordCount,
                i, ft;
            ctx.clearRect(8, 20, 122, chartHeight);
            // ticks for between-frame times
            ctx.fillStyle = "rgb(200,0,200)";
            for(i in self.frameTimes) {
                ft = self.frameTimes[i]/self.ms;
                if(ft > 6) {
                    ctx.fillStyle = "rgb(255,0,0)";
                    ft = 6;
                }
                ctx.fillRect(8 + ft*stdWidth, 20 + 2*i, 2, 2);
                if(ft == 6) {
                    ctx.fillStyle = "rgb(200,0,200)";
                }
            }
            // bars for frame execute times
            ctx.fillStyle = "rgb(0,255,0)";
            for(i in self.executeTimes) {
                ft = self.executeTimes[i]/self.ms;
                if(ft > 6) {
                    ctx.fillStyle = "rgb(255,0,0)";
                    ft = 6;
                }
                ctx.fillRect(8, 20 + 2*i, ft*stdWidth, 2);
                if(ft === 6) {
                    ctx.fillStyle = "rgb(0,255,0)";
                }
            }        
            
            // vertical line at actual framerate
            if(self.fpsNinety) {
                ctx.fillStyle = "rgb(100,100,200)";
                var fpsFraction = (1000/self.fpsNinety/self.ms);
                if(fpsFraction > 6) { fpsFraction = 6; }
                ctx.fillRect(8 + stdWidth*fpsFraction, 20, 1, chartHeight);
            }
            // vertical line at intended framerate
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(8 + stdWidth, 20, 1, chartHeight);
        }
    };
    self.sinceFrameStart = function () {
        return (new Date()).getTime() - self.startTime;
    };
}

