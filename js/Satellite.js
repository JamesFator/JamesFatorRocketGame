(function(window) {
    
    function Satellite(canvas, world) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.img = img_res("Blog.png");
        this.overlay = img_res("Blog_Overlay.png");
        this.crashed = false;
            
        // Create the main body
        this.width = canvas.width / 6 / SCALE;
        this.height = canvas.height / 4 / SCALE;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = 11.2 * draw_scale / 2;
        bodyDef.position.y = (5.5 * draw_scale / 2);
        var body = world.CreateBody(bodyDef);
        this.body = body;

        // Satellite
        var satellite = new b2FixtureDef();
        satellite.density = 0.1;
        satellite.friction = 0.5;
        satellite.restitution = 0.0;
        satellite.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(4.4*draw_scale,-2.75*draw_scale);
        polyDef[1] = new b2Vec2(4.7*draw_scale,-1.45*draw_scale);
        polyDef[2] = new b2Vec2(-4.6*draw_scale,1.0*draw_scale);
        polyDef[3] = new b2Vec2(-5.0*draw_scale,-0.7*draw_scale);
        satellite.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(satellite);

        var relative = this.body.GetPosition();
        this.sx = relative.x * SCALE;
        this.sy = relative.y * SCALE;
        this.drawWidth = 10 * SCALE * draw_scale;
        this.drawHeight = 5.6 * SCALE * draw_scale;
        this.drawStartX = -(this.drawWidth / 2) + 3;
        this.absX = this.sx + this.drawStartX;
        this.drawStartY = -(this.drawHeight / 2);
        this.absY = this.sy + this.drawStartY;
    }

    Satellite.prototype.tick = function() { }

    Satellite.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.drawImage(this.img, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Satellite.prototype.hasOverlay = function() {
        return this.crashed;
    }

    Satellite.prototype.drawOverlay = function(ctx) {
        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.drawImage(this.overlay, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Satellite.prototype.checkBounds = function(x, y) {
        if ( x > this.absX && x < this.absX + this.drawWidth ) {
            if ( y > this.absY && y < (this.absY + this.drawHeight) * 4/5 ) {
                this.crashed = true;
                return true;
            }
        }
        return false;
    }
    
    window.Satellite = Satellite;
    
})(window);
