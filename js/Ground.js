(function(window) {
    
    function Ground(canvas, world) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.img = img_res("Ground.png");
            
        // Create ground
        var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.9;
        fixDef.restitution = 0.0;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        this.width = canvas.width / 2 / SCALE;
        this.height = canvas.height / 69.7 / SCALE;
        bodyDef.position.x = this.width;
        bodyDef.position.y = canvas.height / SCALE - this.height + canvas.height / 100 / SCALE;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox( this.width, this.height );
        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);

        // Create a hill
        var hill = new b2FixtureDef();
        hill.density = 1.0;
        hill.friction = 0.9;
        hill.restitution = 0.0;
        hill.shape = new b2PolygonShape();
        var polyDef = [];
        var botWidth = this.width / 2.367;
        var topWidth = botWidth / 3;
        polyDef[0] = new b2Vec2(topWidth/2,-this.height * 2.9);
        polyDef[1] = new b2Vec2(botWidth/2,-this.height);
        polyDef[2] = new b2Vec2(-botWidth/2,-this.height);
        polyDef[3] = new b2Vec2(-topWidth/2,-this.height * 2.9);
        hill.shape.SetAsArray(polyDef, polyDef.length);
        this.body.CreateFixture(hill);

        this.drawHeight = (this.height / 2 + this.height * 3) * SCALE;
        this.drawStartY = -(this.height + this.drawHeight) + this.drawHeight/10;
    }

    Ground.prototype.tick = function() { }

    Ground.prototype.draw = function(ctx) {
        var relative = this.body.GetPosition();
        
        var sx = relative.x * SCALE;
        var sy = relative.y * SCALE;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.drawImage(this.img, -this.canvas.width / 2, this.drawStartY, this.canvas.width, this.drawHeight);
        ctx.restore();
    }

    Ground.prototype.hasOverlay = function() {
        return false;
    }
    
    window.Ground = Ground;
    
})(window);
