// all the rendering is done with p5.js
function Box(x, y, w, h) {
    var options = {
        friction: 0,
        restitution: 1
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);

    this.show = () => {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        fill(127);
        stroke(255);
        strokeWeight(1);
        rotate(angle);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();

    }
}