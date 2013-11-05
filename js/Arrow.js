(function(window) {
    
    function Arrow(canvas, world) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.img = img_res("Projects.png");
            
        // Create the main body
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = canvas.width / SCALE - 6.0;
        bodyDef.position.y = 5.2 * draw_scale / 2;
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

    Arrow.prototype.tick = function() { }

    Arrow.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.drawImage(this.img, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Arrow.prototype.hasOverlay = function() {
        return false;
    }

    Arrow.prototype.checkBounds = function(x, y) {
        if ( y < 0 ) {
            return true;
        }
        return false;
    }

    Arrow.prototype.checkAltBounds = function(x, y) {
        if ( x > this.absX && x < this.absX + this.drawWidth ) {
            if ( y > this.absY && y < this.absY + this.drawHeight ) {
                return true;
            }
        }
        return false;
    }
    
    window.Arrow = Arrow;
    
})(window);
