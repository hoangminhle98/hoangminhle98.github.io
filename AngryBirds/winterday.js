var Example = Example || {};

Example.winterday = function() {
    currentScore = 0;
    document.getElementById("score").innerHTML = currentScore;

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Events = Matter.Events,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;
        Body = Matter.Body;
        Composite = Matter.Composite;
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

    var runner = Runner.create();
    Runner.run(runner, engine);

    const rockX = 240,
        rockY = 370,
        rockCategory = 0x0002,
        displacement = 30,
        barCoords = [[750, 100], [750, 200], [750, 300], [750, 400], [750, 500], [750, 600]];

    var rockOptions = { density: 0.004, collisionFilter: { category: rockCategory} },
        diamondOptions = { density: 0.004, label: 'diamond'},
        particleOptions = {density: 0.00001};

    barCoords.forEach((item, index) => {
        World.add(engine.world, [Bodies.rectangle(item[0], item[1], 30, 3, { isStatic: true, render : {fillStyle: 'white'} }),
                                Bodies.rectangle(item[0], item[1]-20, 30, 30, diamondOptions)]);
    });

    var rock = Bodies.polygon(rockX, rockY, 8, 20, rockOptions),
        anchor = { x: rockX, y: rockY },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        });
    rock.label = 'rock';

    for (i = 0; i < 2; i += 1)
        for (j = 0; j < 3; j += 1) {
            World.add(engine.world, Bodies.rectangle(520 + 30* j,90 + 30* i, 30, 30, diamondOptions));
        };
    World.add(engine.world, Bodies.polygon(537, 10, 6, 20, diamondOptions));

    // add bodies
    var size = 80,
        x = 900,
        y = 300,
        head = Bodies.circle(x, y- size, size/2, { render: {fillStyle: 'white'} }),
        body = Bodies.circle(x, y,         size, { render: {fillStyle: 'white'} }),
        leftEye     = Bodies.circle(x - 15, y - size - 5, 5, { render: {fillStyle: 'black'} }),
        rightEye    = Bodies.circle(x + 15, y - size - 5, 5, { render: {fillStyle: 'black'} }),
        bodyParts   = [head, body, leftEye, rightEye];

    for (i = 0; i < 4; i += 1) {
        bodyParts.push(Bodies.circle(x, y - 50 + 32 * i, 10));
    }

    var robot = Body.create({
        parts: bodyParts
    });

    Composite.add(world, [
        robot,
        Bodies.rectangle(900, 400, 200, 3, { isStatic: true, render : {fillStyle : 'white'} }),
        Bodies.rectangle(550, 500, 200, 3, { isStatic: true, render : {fillStyle : 'white'} }),
        Bodies.rectangle(550, 200, 200, 3, { isStatic: true, render : {fillStyle : 'white'} })
    ]);

    for (i = 0; i < 4; i += 1)
        for (j = 0; j < 3; j += 1) {
            World.add(engine.world, Bodies.rectangle(520 + 30* j,390 + 30* i, 30, 30, diamondOptions));
    };

    World.add(engine.world, [rock, elastic]);

    var threshold = 20;
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

                    World.add(engine.world, Composites.stack(pos.x, pos.y, 5, 5, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 4, particleOptions)}));
                    currentScore += world.bodies.length * 10
                    document.getElementById("score").innerHTML = currentScore;
                }
            }
        }
    });

    Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1) {
            let dX = rock.position.x - rockX,
                dY = rock.position.y - rockY;
            if (Math.sqrt(dX*dX + dY*dY) > displacement) {
                rock = Bodies.polygon(rockX, rockY, 7, 20, rockOptions);
                World.add(engine.world, rock);
                elastic.bodyB = rock;

            }
        }
    });

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
    mouseConstraint.collisionFilter.mask = rockCategory;
    World.add(world, mouseConstraint);

    render.mouse = mouse;

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 1000, y: 600 }
    });
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

