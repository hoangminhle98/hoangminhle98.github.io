var Example = Example || {};

Example.manipulation = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        World = Matter.World,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Composites = Matter.Composites;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1400,
            height: 600,
            wireframes: false
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    const rockX = 700,
        rockY = 330,
        displacement = 30;
    var rockOptions = { density: 1, restitution: 0.99, friction: 0.001, collisionFilter: { category: rockCategory} },
        rock = Bodies.polygon(rockX, rockY, 8, 20, rockOptions),
        anchor = { x: rockX, y: rockY },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        })

    World.add(engine.world, [rock, elastic]);

    diamondOptions = { density: 0.004, label: 'diamond'},
        particleOptions = {density: 0.0001, friction: 0.00001, restitution : 0.9};


    // add bodies
    var bodyA = Bodies.rectangle(100, 200, 40, 50, diamondOptions),
        bodyB = Bodies.rectangle(200, 200, 80, 50, diamondOptions),
        bodyC = Bodies.rectangle(300, 200, 30, 40, diamondOptions),
        bodyD = Bodies.rectangle(400, 200, 50, 40, diamondOptions),
        bodyE = Bodies.rectangle(550, 200, 50, 60, diamondOptions),
        bodyF = Bodies.rectangle(650, 200, 50, 90, diamondOptions),
        bodyG = Bodies.circle(0, 100, 25, diamondOptions);
    var objects = [bodyA, bodyB, bodyC, bodyD, bodyE, bodyF, bodyG];
    var velocities = [100, 200, 150, 120, 400, 200, 100, 300]
    objects.forEach( function (x){ x.isStatic = true});
    Composite.add(world, objects);

    Events.on(engine, 'beforeUpdate', function(event) {

        for( i = 0; i < objects.length; i++) {
            body = objects[i];
            var px = 300 + velocities[i] * 0.4 * Math.sin(engine.timing.timestamp * 0.002);
            Body.setVelocity(body, {x: px - body.position.x, y: 0 });
            Body.setPosition(body, {x: px, y: body.position.y});
        }

    });

    Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1) {
            let dX = rock.position.x - rockX,
                dY = rock.position.y - rockY;
            if (Math.sqrt(dX*dX + dY*dY) > displacement) {
                oldRock = rock;
                rock = Bodies.polygon(rockX, rockY, 7, 20, rockOptions);
                World.add(engine.world, rock);
                elastic.bodyB = rock;
            }
        }
    });
    var threshold = 9;
    Events.on(engine, 'collisionEnd', function(event) {
        var pairs = event.pairs;
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];
            let bodyA = undefined,
                bodyB = undefined;
            if (pair.bodyB.label.startsWith("diamond"))   {
                bodyA = pair.bodyB;
                bodyB = pair.bodyA;
            } else if (pair.bodyA.label.startsWith("diamond")) {
                bodyA = pair.bodyA;
                bodyB = pair.bodyB;
            }
            if (bodyA) {
                let velocity = bodyB.velocity;
                if (Math.sqrt(velocity.x*velocity.x + velocity.y*velocity.y) * bodyB.mass > threshold) {
                    pos = bodyA.position;
                    Composite.remove(world, bodyA);
                    console.log(bodyA);
                    World.add(engine.world, Composites.stack(pos.x, pos.y, 3, 3, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 7, particleOptions)}));
                    currentScore += world.bodies.length * 10
                    document.getElementById("score").innerHTML = currentScore;
                }
            }
        }
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};
