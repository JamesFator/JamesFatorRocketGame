var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2AABB = Box2D.Collision.b2AABB,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();

var SCALE = 30;
var draw_scale;
var canvas, world, debug, ctx, background, running;
var game_objects;
var ground, rocket, garage, satellite, arrow;
var motionEnabled;
var mouseIsDown = false;

/**
 * init configures the entire game.
 */
function init() {
    // Set up the canvas and use the full screen
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    background = img_res("Background.jpg")
    // Set up the debug canvas
    debug = document.getElementById("debug");
    debug.width = window.innerWidth;
    debug.height = window.innerHeight;
    
    // Initialize the world
    setupPhysics();
    
    // Listen for key presses
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;

    // Listen for mouse clicks
    document.onmousedown = function(e) {
        mouseIsDown = true;
    }
    document.onmouseup = function(e) {
        if (mouseIsDown) mouseClick(e);
        mouseIsDown = false;
    }

    // Listen for touches
    debug.addEventListener('touchstart', touchDown);
    debug.addEventListener('touchend', touchUp);
    
    // Start the animating
    requestAnimFrame(update);
}

/**
 * setupPhysics creates the world and sets the boundries
 */
function setupPhysics() {
    // Create the world
    draw_scale = Math.min(canvas.height / 660, 1.5);
    world = new b2World(
            new b2Vec2(0, 5 * draw_scale), false );
    running = true;
            
    // Create ground
    ground = new Ground(canvas, world);
    
    // Setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(debug.getContext("2d"));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    // Create the walls
    new Wall(canvas, world, -21);
    new Wall(canvas, world, canvas.width + 21);

    // Create the Garage
    garage = new Garage(canvas, world);

    // Create the Satellite
    satellite = new Satellite(canvas, world);

    // Create the Arrow
    arrow = new Arrow(canvas, world);

    // Create the Rocket
    rocket = new Rocket(canvas, world, canvas.width / 2, canvas.height * 4 / 5);

    // Set up the objects array
    game_objects = [];
    game_objects[0] = garage;
    game_objects[1] = satellite;
    game_objects[2] = arrow;
    game_objects[3] = rocket;
    game_objects[4] = ground;

    // Determine if we're on a mobile device that supports DeviceMotion
    if (window.DeviceMotionEvent) {
        window.addEventListener('deviceorientation', deviceMotionHandler, false);
        motionEnabled = true;
    } else {
        motionEnabled = false;
    }
}

/**
 * update is the tick method that refreshes everything
 */
function update() {
    if ( !running ) {
        return;
    }
    // Update the objects
    update_objects();

    checkBounds();

    // Update the world
    // world.DrawDebugData();
    world.Step(1/60, 10, 10);
    world.ClearForces();
    requestAnimFrame(update);

    // Redraw the world
    draw_objects();
}

function update_objects() {
    for (var i in game_objects) {
        game_objects[i].tick();
    }
}

function draw_objects() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    for (var i in game_objects) {
        game_objects[i].draw(ctx);
    }

    for (var i in game_objects) {
        if (game_objects[i].hasOverlay()) {
            game_objects[i].drawOverlay(ctx);
        }
    }
}

/**
 * keyDown is called whenever a key is pressed
 */
function keyDown(event) {
    var code = event.keyCode;
        
    // Up Key
    if(code == 38)
    {
        rocket.upKey(true);
    }
    // Left
    else if(code == 37)
    {
        rocket.leftKey(true);
    }
    // Right
    else if(code == 39)
    {
        rocket.rightKey(true);
    }
}

/**
 * keyUp is called whenever a key is released
 */
function keyUp(event) {
    var code = event.keyCode;
        
    // Up Key
    if(code == 38)
    {
        rocket.upKey(false);
    }
    // Left
    else if(code == 37)
    {
        rocket.leftKey(false);
    }
    // Right
    else if(code == 39)
    {
        rocket.rightKey(false);
    }
}

/**
 * mouseClick is called when the mouse button makes a successful
 *   click on the page.
 */
 function mouseClick(e) {
    if ( garage.checkBounds(e.x, e.y) ) {
        window.open("http://jamesfator.com/blog/category/personal/", "_self");
        running = false;
    } else if ( satellite.checkBounds(e.x, e.y) ) {
        window.open("http://jamesfator.com/blog/", "_self");
        running = false;
    } else if ( arrow.checkAltBounds(e.x, e.y) ) {
        window.open("http://jamesfator.com/blog/category/projects/", "_self");
        running = false;
    }
 }

/**
 * touchDown is called whenever a DOM element is touched
 */
function touchDown(event) {
    rocket.upKey(true);
}

/**
 * touchUp is called whenever a finger is removed from a DOM element
 */
function touchUp(event) {
    rocket.upKey(false);
}

/**
 * deviceMotionHandler is called when there is new MotionEvent to process
 */
function deviceMotionHandler(eventData) {
    // Grab the rotation rate from the results
    var gamma = eventData.gamma
    var beta = eventData.beta;
    var rotRatio;
    var rot;
    if (Math.abs(beta) > 3) {
        rotRatio = beta / 50.0;
        rot = rotRatio / 10.0;
    } else {
        // Slower rotation when close to center
        rotRatio = beta / 50.0;
        rot = rotRatio / 100.0;
    }
    if ( gamma > 0 ) {
        // Reverse if orientation is upside down
        rot = rot * -1;
    }
    rocket.set_rotation(rot);
}

/**
 * img_res gets the image named fileName
 */
function img_res(fileName) {
    var i = new Image();
    i.src = "img/"+fileName;
    return i;
}

/**
 * checkBounds checks to see if the rocket is in a trigger field
 */
function checkBounds() {
    if ( garage.checkBounds(rocket.GetX(), rocket.GetY()) ) {
        window.open("http://jamesfator.com/blog/category/personal/", "_self");
        running = false;
    } else if ( satellite.checkBounds(rocket.GetX(), rocket.GetY()) ) {
        window.open("http://jamesfator.com/blog/", "_self");
        running = false;
    } else if ( arrow.checkBounds(rocket.GetX(), rocket.GetY()) ) {
        window.open("http://jamesfator.com/blog/category/projects/", "_self");
        running = false;
    }
}

