(function(window) {
    
    function Moon(canvas, world) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.img = img_res("Moon.png");
            
        // Create the main body
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = canvas.width / SCALE - 17.0 * draw_scale / 2;
        bodyDef.position.y = 17.0 * draw_scale / 2;
        var body = world.CreateBody(bodyDef);
        this.body = body;

        var relative = this.body.GetPosition();
        this.sx = relative.x * SCALE;
        this.sy = relative.y * SCALE;
        this.drawWidth = 5.6 * SCALE * draw_scale;
        this.drawHeight = 5.6 * SCALE * draw_scale;
        this.drawStartX = -(this.drawWidth / 2) + 3;
        this.absX = this.sx + this.drawStartX;
        this.drawStartY = -(this.drawHeight / 2);
        this.absY = this.sy + this.drawStartY;
    }

    Moon.prototype.tick = function() { }

    Moon.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.drawImage(this.img, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Moon.prototype.hasOverlay = function() {
        return false;
    }
    
    window.Moon = Moon;
    
})(window);
