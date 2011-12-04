// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function Layer($parent, zidx, width, height) {
    var $canv = $('<canvas>').attr({width : width, height : height, id: "layer_" + zidx});
    $canv.css({'z-index': zidx, position: 'absolute', top: '0', left: '0'});
    $parent.append($canv);
    this.$canv = $canv;
    this.ctx = $canv.get(0).getContext('2d');
    this.ctx.clearRect(0,0,width, height);
    this.ctx.drawPt = function(img, pos) {
        this.drawImage(img, pos.x, pos.y);
    }
}
