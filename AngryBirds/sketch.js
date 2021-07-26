// import {Engine, World, Bodies} from '../matter.js'
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
var engine;
var world;
var boxes = [];

function setup() {
    createCanvas(400, 400);
    engine = Engine.create();
    world = engine.world;
    box1 = Bodies.rectangle(400, 200, 80, 80);
    Matter.Runner.run(engine);
    var options = {
        isStatic: true
    }
    var ground = Bodies.rectangle(200, height, width, 10, options);
    World.add(world, ground);
    World.add(world, Bodies.rectangle(200, height, width, 10, options));
    World.add(world, Bodies.rectangle(200, height, width, 10, options));
    console.log(MatterTools.Demo);

}

function draw() {
    background(71);
    for (var i = 0; i < boxes.length; i ++) {
        boxes[i].show();
    }
    push();
    stroke(74);
    fill(255);
    strokeWeight(10);
    rectMode(CENTER);
    rect(200, height, width, 10);

    pop();
}

function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, 20, 20));
}
