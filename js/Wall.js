(function(window) {
    
    function Wall(canvas, world, x) {
        // Create ground
        var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.1;
        fixDef.restitution = 0.0;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = canvas.height / SCALE;
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox( 20 / SCALE, canvas.height );
        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);
    }
    
    window.Wall = Wall;
    
})(window);
