var Example = Example || {};
Example.outtaspace = function() {
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
    world.gravity.scale = 0;
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

    const rockX = 720,
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
    diamondOptions = { density: 0.004, label: 'diamond'},
        particleOptions = {density: 0.0001, friction: 0.00001, restitution : 0.9};

    rock.label = 'rock';

    var size = 30, max = 21;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    for (i = 0; i < 2*max; i += 1)
        for (j = 0; j < getRandomInt(max); j += 1) {
            square = Bodies.rectangle((size + 2) * i + 50, (size + 2)* j + 70, size, size, diamondOptions);
            World.add(engine.world, square);
            square.isStatic = true;
        };


    World.add(engine.world, [rock, elastic]);

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
                    World.add(engine.world, Composites.stack(pos.x, pos.y, 3, 3, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 7, particleOptions)}));
                }
            }
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

                setTimeout(() => {
                    oldRock.collisionFilter.category = defaultCategory;
                }, 2000)

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
        max: { x: 1400, y: 600 }
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

