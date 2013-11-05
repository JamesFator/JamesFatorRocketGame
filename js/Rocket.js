(function(window) {
    
    function Rocket(canvas, world, x, y) {
        // Initialize the variables
        this.canvas = canvas;
        this.world = world;
        this.thrustersActive = false;
        this.nextRotation = 0.0;
        this.img = img_res("Rocket_Default.png");
        this.img_alt = img_res("Rocket_Thrusters.png");
        this.sx;
        this.sy;

        // Create the main body
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = y / SCALE;
        var body = world.CreateBody(bodyDef);
        this.body = body;

        // Create each of the fixtures
        // Nose cone
        var nose_cone = new b2FixtureDef();
        nose_cone.density = 0.1;;
        nose_cone.friction = 1.0;
        nose_cone.restitution = 0.0;
        nose_cone.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(0.5*draw_scale,-0.75*draw_scale);
        polyDef[1] = new b2Vec2(-0.5*draw_scale,-0.75*draw_scale);
        polyDef[2] = new b2Vec2(0.0*draw_scale,-1.25*draw_scale);
        nose_cone.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(nose_cone);

        // Main rocketship body
        var rocket_main = new b2FixtureDef();
        rocket_main.density = 0.1;
        rocket_main.friction = 1.0;
        rocket_main.restitution = 0.0;
        rocket_main.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(0.5*draw_scale,-0.75*draw_scale);
        polyDef[1] = new b2Vec2(0.5*draw_scale,0.75*draw_scale);
        polyDef[2] = new b2Vec2(-0.5*draw_scale,0.75*draw_scale);
        polyDef[3] = new b2Vec2(-0.5*draw_scale,-0.75*draw_scale);
        rocket_main.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(rocket_main);

        // Left wing
        var left_wing = new b2FixtureDef();
        left_wing.density = 0.1;
        left_wing.friction = 1.0;
        left_wing.restitution = 0.0;
        left_wing.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(-0.5*draw_scale,0.75*draw_scale);
        polyDef[1] = new b2Vec2(-1.0*draw_scale,1.25*draw_scale);
        polyDef[2] = new b2Vec2(-1.0*draw_scale,0.75*draw_scale);
        polyDef[3] = new b2Vec2(-0.5*draw_scale,0.25*draw_scale);
        left_wing.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(left_wing);

        // Right wing
        var right_wing = new b2FixtureDef();
        right_wing.density = 0.1;
        right_wing.friction = 1.0;
        right_wing.restitution = 0.0;
        right_wing.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(1.0*draw_scale,0.75*draw_scale);
        polyDef[1] = new b2Vec2(1.0*draw_scale,1.25*draw_scale);
        polyDef[2] = new b2Vec2(0.5*draw_scale,0.75*draw_scale);
        polyDef[3] = new b2Vec2(0.5*draw_scale,0.25*draw_scale);
        right_wing.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(right_wing);

        // Center wing
        var center_wing = new b2FixtureDef();
        center_wing.density = 1.0;
        center_wing.friction = 1.0;
        center_wing.restitution = 0.0;
        center_wing.shape = new b2PolygonShape();
        var polyDef = [];
        polyDef[0] = new b2Vec2(0.125*draw_scale,0.25*draw_scale);
        polyDef[1] = new b2Vec2(0.125*draw_scale,1.25*draw_scale);
        polyDef[2] = new b2Vec2(-0.125*draw_scale,1.25*draw_scale);
        polyDef[3] = new b2Vec2(-0.125*draw_scale,0.25*draw_scale);
        center_wing.shape.SetAsArray(polyDef, polyDef.length);
        body.CreateFixture(center_wing);
        var relative = this.body.GetPosition();
    }

    Rocket.prototype.GetX = function() {
        return this.sx;
    }

    Rocket.prototype.GetY = function() {
        return this.sy;
    }

    Rocket.prototype.tick = function() {
        if ( this.thrustersActive ) {
            // Determine the velocity considering the rotation
            var mod = this.body.GetAngle() % (Math.PI * 2);
            var push = -0.2 * draw_scale;
            var xBoost = 0;
            var yBoost = 0;
            if ( mod < 0 ) {
                mod = Math.PI * 2 + mod;
            }
            if ( mod < Math.PI / 2 ) {
                var fract = mod / (Math.PI / 2);
                xBoost = fract * -push;
                yBoost = (1-fract) * push;
            } else if ( mod < Math.PI ) {
                var fract = (mod - (Math.PI / 2)) / (Math.PI / 2);
                xBoost = (1-fract) * -push;
                yBoost = fract * -push;
            } else if ( mod < Math.PI * 3 / 2 ) {
                var fract = (mod - Math.PI) / (Math.PI / 2);
                xBoost = fract * push;
                yBoost = (1-fract) * -push;
            } else {
                var fract = (mod - (Math.PI * 3 / 2)) / (Math.PI / 2);
                xBoost = (1-fract) * push;
                yBoost = fract * push;
            }
            this.add_velocity( new b2Vec2(xBoost, yBoost) );
            this.body.SetAngularVelocity( 0 );
        }

        // Add the rotation
        this.add_rotation();
    }

    Rocket.prototype.upKey = function(downPress) {
        if (downPress) {
            // Key pressed
            this.thrustersActive = true;
        } else {
            // Key released
            this.thrustersActive = false;
        }
    }

    Rocket.prototype.leftKey = function(downPress) {
        if (downPress) {
            // Key pressed
            this.set_rotation(-8);
        } else {
            this.set_rotation(0);
        }
    }

    Rocket.prototype.rightKey = function(downPress) {
        if (downPress) {
            // Key pressed
            this.set_rotation(8);
        } else {
            this.set_rotation(0);
        }
    }

    Rocket.prototype.add_velocity = function(vel) {
        // Get the current velocity
        var v = this.body.GetLinearVelocity();
        // Add the new velocity
        v.Add(vel);
        // Set the new velocity
        this.body.SetLinearVelocity(v);
    }

    Rocket.prototype.set_rotation = function(rot) {
        if (rot == 0) {
            // We will not rotate
            this.nextRotation = 0;
        } else {
            // Determine the angle in radians
            var mod = 1;
            if (rot < 0)
                mod = -1;
            this.nextRotation = Math.PI / (100 - (Math.abs(rot) * 6.25)) * mod;
        }
    }

    Rocket.prototype.add_rotation = function(rot) {
        // Get the current angle
        var angle = this.body.GetAngle();

        // Determine if we can rotate
        var deg = Math.abs(angle * 180/Math.PI % 360);
        var vel = this.body.GetLinearVelocity();
        if ( Math.abs(vel.y) < 0.75 && (deg < 10 || deg > 350) ) {
            return;
        }

        // Add the new angle
        angle = angle + this.nextRotation;
        // Set the new angle
        this.body.SetAngle(angle);
    }

    Rocket.prototype.draw = function(ctx) {
        var relative = this.body.GetPosition();
        
        this.sx = relative.x * SCALE;
        this.sy = relative.y * SCALE;
        var width = 2.1 * SCALE * draw_scale;
        var height;
        var endHeight;
        var toDraw;

        if ( this.thrustersActive ) {
            height = 2.6 * SCALE * draw_scale;
            endHeight = height + ((5.6-2.6) * SCALE * draw_scale) / 2;
            toDraw = this.img_alt;
        } else {
            height = 2.6 * SCALE * draw_scale;
            endHeight = height;
            toDraw = this.img;
        }

        ctx.save();
        ctx.translate(this.sx, this.sy);
        ctx.rotate(this.body.GetAngle());
        ctx.drawImage(toDraw, -width / 2, -height / 2, width, endHeight);
        ctx.restore();
    }

    Rocket.prototype.hasOverlay = function() {
        return false;
    }
    
    window.Rocket = Rocket;
    
})(window);