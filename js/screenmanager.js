// Copyright (c) 2011 Ryan D. Williams
// Copyright (c) 2011 Lazy 8 Studios

function ScreenManager(first_screen) {
    var self = this;
    var current = first_screen;
    self.get_current = function() {
        return current;
    };
    self.update = function(run) {
        if(current.next_screen) {
            current = current.next_screen;
        }
    };
}
