// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function AssetManager() {
    var self = this;
    this.ready = false;
    this.assets = {};

    self.load_asset = function(name, filename) {
        self.assets[name] = new Image();
        self.assets[name].ready = false;
        self.assets[name].onload = function () {
            this.ready = true;
        };
        self.assets[name].src = filename;
    }

    self.is_done = function() {
        if (self.ready)
            return true;
        
        self.ready = true;
        for (asset in self.assets) {
            if (!self.assets[asset].ready)
                self.ready = false;
        }
        return self.ready;
    }

    // Once all the image assets are loaded, call this function to create
    // modified assets with modified palettes.
    self.shift_palettes = function() {
        // [skin, hair, shirt, shart_shadow, backpack, backpack_shadow]
        self.copy_with_palette_shift("char01", "char01a", [0xdea582, 0xaa795b, 0x784900, 0x1a1815, 0x528bff, 0x36af44, 0x3759a0 ,0x23802e]);
        self.copy_with_palette_shift("char01", "char01b", [0xdea582, 0xdea582, 0x784900, 0x784900, 0x528bff, 0xcb6a65, 0x3759a0 ,0xa34e4a, 0xc16b46, 0x75926e, 0x873a29, 0x5b7754]);
        self.copy_with_palette_shift("char01", "char01c", [0xdea582, 0xdea582, 0x784900, 0xf0d35e, 0x528bff, 0x3966c2, 0x3759a0 ,0x254b99]);
    }
    
    self.copy_with_palette_shift = function(name, new_name, swap_list) {
        var width = self.assets[name].width;
        var height = self.assets[name].height;
        var new_canvas = $('<canvas>').attr({width : width, height : height});
        var ctx = new_canvas.get(0).getContext('2d');
        ctx.clearRect(0,0,width, height);
        ctx.drawImage(self.assets['char01'], 0, 0);
        
        // Access the image data directly.
        var img_data = ctx.getImageData(0, 0, width, height);
        
        // Pairs of colors that we want to swap in the image.
        for (var i=0; i<width*height; i++)
        {
            // The swap_list should contain pairs of colors we want to swap in the image.
            var rgb = img_data.data[4*i+0] << 16 | img_data.data[4*i+1] << 8 | img_data.data[4*i+2];
            for (var s=0; s<swap_list.length; s+=2) {
                if (rgb == swap_list[s]) {
                    img_data.data[4*i+0] = (swap_list[s+1] & 0xff0000) >> 16;
                    img_data.data[4*i+1] = (swap_list[s+1] & 0xff00) >> 8;
                    img_data.data[4*i+2] =  swap_list[s+1] & 0xff;
                }
            }
        }
        ctx.putImageData(img_data, 0, 0);
        self.assets[new_name] = new_canvas.get(0);
    }
    
    self.load_asset("background01", "data/textures/background01.png");
    self.load_asset("char01", "data/textures/char01.png");
}

//------------------------------------------------------------------------------
