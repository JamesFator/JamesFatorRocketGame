(function(window) {
    
    function Instructions(canvas, world) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.img = img_res("Instructions.png");
            
        // Create the main body
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = canvas.width / SCALE - 10.0 * draw_scale / 2;
        bodyDef.position.y = canvas.height / SCALE - 10.0 * draw_scale / 2;
        var body = world.CreateBody(bodyDef);
        this.body = body;

        var relative = this.body.GetPosition();
        this.sx = relative.x * SCALE;
        this.sy = relative.y * SCALE;
        this.drawWidth = 9.33 * SCALE * draw_scale;
        this.drawHeight = 7.0 * SCALE * draw_scale;
        this.drawStartX = -(this.drawWidth / 2) + 3;
        this.absX = this.sx + this.drawStartX;
        this.drawStartY = -(this.drawHeight / 2);
        this.absY = this.sy + this.drawStartY;
    }

    Instructions.prototype.tick = function() { }

    Instructions.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.drawImage(this.img, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Instructions.prototype.hasOverlay = function() {
        return false;
    }
    
    window.Instructions = Instructions;
    
})(window);
