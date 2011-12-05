// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

// Globals.
var gameWidth = 2560;
var viewWidth = 640;
var viewHeight = 480;

(function(window) { // begin anonymous namespace

window.start_karmahigh = function() {
    window.asset_manager = new AssetManager();
    
    // the root element gets the canvas inserted into it
    var $root = $('#karmahigh').first();
    $root.css({overflow: 'hidden', width: viewWidth + 'px', height: viewHeight + 'px', position:'relative'});
    
    console.log("starting", $root);
    
    var camera = new Camera(viewWidth, viewHeight);
    var layers = {bg: new Layer($root, 0, viewWidth, viewHeight),
                  player: new Layer($root, 1, viewWidth, viewHeight),
                  hud: new Layer($root, 2, viewWidth, viewHeight)};
    
    var keyboard = new KeyHandler();
    $(window).on('keydown', keyboard.keyDown);
    $(window).on('keyup', keyboard.keyUp);
    var screenManager = new ScreenManager(new ScreenMain());
    
    var gameState = {levels: []};
    for(var i = 0; i < 3; i++) {
        gameState.levels.push({asset_name: null, attacked: false});
    }
    
    var runner = new Runner(32);
    var splash_done = false;
    runner.frame = function() {
        // within this function, 'this' refers to the runner object
        keyboard.update();
        
        if (!splash_done && asset_manager.is_done())
        {
            asset_manager.shift_palettes();
            fade_splash();
            splash_done = true;
        }
        
        if (splash_done)
        {
            screenManager.get_current().update(screenManager, keyboard, this, camera, gameState);
            screenManager.get_current().draw(layers, this, camera);
            screenManager.update(this);
        }
    };
    runner.start();
}

fade_splash = function() {
    $("#splash").animate({opacity:0}, 500);
}

})(window);  // end anonymous namespace
