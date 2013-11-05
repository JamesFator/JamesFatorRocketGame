(function(window) {
    
    function Garage(canvas, world) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.img = img_res("PersonalProjects_BG.png");
        this.overlay = img_res("PersonalProjects_Overlay.png");
            
        // Create the main body
        this.width = canvas.width / 6 / SCALE;
        this.height = canvas.height / 4 / SCALE;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = 6.75 * draw_scale / 2;
        bodyDef.position.y = canvas.height / SCALE - (5.5 * draw_scale / 2);
        var body = world.CreateBody(bodyDef);
        this.body = body;

        // Garage roof
        var garage_roof = new b2FixtureDef();
        garage_roof.density = 0.1;
        garage_roof.friction = 0.5;
        garage_roof.restitution = 0.0;
        garage_roof.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(2.9*draw_scale,-2.75*draw_scale);
        polyDef[1] = new b2Vec2(3.5*draw_scale,-1.45*draw_scale);
        polyDef[2] = new b2Vec2(2.1*draw_scale,-1.3*draw_scale);
        polyDef[3] = new b2Vec2(-3.4*draw_scale,-1.3*draw_scale);
        polyDef[4] = new b2Vec2(-2.6*draw_scale,-2.75*draw_scale);
        garage_roof.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(garage_roof);

        // Garage back
        var garage_back = new b2FixtureDef();
        garage_back.density = 0.1;
        garage_back.friction = 0.5;
        garage_back.restitution = 0.0;
        garage_back.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(-3.37*draw_scale,-1.1*draw_scale);
        polyDef[1] = new b2Vec2(-3.37*draw_scale,2.65*draw_scale);
        polyDef[2] = new b2Vec2(-6.57*draw_scale,2.65*draw_scale);
        polyDef[3] = new b2Vec2(-6.57*draw_scale,-1.3*draw_scale);
        garage_back.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(garage_back);

        var relative = this.body.GetPosition();
        this.sx = relative.x * SCALE;
        this.sy = relative.y * SCALE;
        this.drawWidth = 7 * SCALE * draw_scale;
        this.drawHeight = 5.6 * SCALE * draw_scale;
        this.drawStartX = -(this.drawWidth / 2) + 3;
        this.absX = this.sx + this.drawStartX;
        this.drawStartY = -(this.drawHeight / 2);
        this.absY = this.sy + this.drawStartY;
        this.absWidth = 5.6 * SCALE * draw_scale;
    }

    Garage.prototype.tick = function() { }

    Garage.prototype.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.drawImage(this.img, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Garage.prototype.hasOverlay = function() {
        return true;
    }

    Garage.prototype.drawOverlay = function(ctx) {
        var relative = this.body.GetPosition();
        var sx = relative.x * SCALE;
        var sy = relative.y * SCALE;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.drawImage(this.overlay, this.drawStartX, this.drawStartY, this.drawWidth, this.drawHeight);
        ctx.restore();
    }

    Garage.prototype.checkBounds = function(x, y) {
        if ( x > this.absX && x < this.absX + this.absWidth ) {
            if ( y > this.absY && y < this.absY + this.drawHeight ) {
                return true;
            }
        }
        return false;
    }
    
    window.Garage = Garage;
    
})(window);
