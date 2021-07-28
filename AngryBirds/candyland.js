var Example = Example || {};

Example.candyland = function() {
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
            width: 1000,
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
        displacement = 30;
    var rockOptions = { density: 0.004, collisionFilter: { category: rockCategory} },
        rock = Bodies.polygon(rockX, rockY, 8, 20, rockOptions),
        anchor = { x: rockX, y: rockY },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        })
        diamondOptions = { density: 0.004, label: 'diamond', isStatic: true, render : rock.render},
        particleOptions = {density: 0.00001};

    rock.label = 'rock';


    for (i = 0; i < 2; i += 1)
        for (j = 0; j < 3; j += 1) {
            World.add(engine.world, Bodies.rectangle(520 + 30* j,90 + 30* i, 30, 30, diamondOptions));
        };
    World.add(engine.world, Bodies.polygon(533, 10, 5, 20, diamondOptions));

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

                    World.add(engine.world, Composites.stack(pos.x, pos.y, 6, 6, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 3, particleOptions)}));
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
        max: { x: 800, y: 600 }
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

