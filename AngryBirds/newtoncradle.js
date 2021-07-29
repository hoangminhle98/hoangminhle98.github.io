Example.newtonsCradle = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        World = Matter.World,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Events = Matter.Events,
        Composite = Matter.Composite;
        Constraint = Matter.Constraint;

    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1000,
            height: 600,
            wireframes: false,
            showSleeping: false
        }
    });

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);

    var rockX = 350, rockY = 380, displacement = 20;

    var cradleA = Composites.newtonsCradle(600, 80, 5, 20, 130);
    Body.translate(cradleA.bodies[0], { x: -100, y: -100 });

    var cradleB = Composites.newtonsCradle(600, 270, 5, 20, 130);
    Body.translate(cradleB.bodies[0], { x: -80, y: -40 });

    var cradleC = Composites.newtonsCradle(600, 440, 5, 20, 135);
    Body.translate(cradleC.bodies[0], { x: -50, y: -40 });

    var rock = Bodies.polygon(rockX, rockY, 8, 20, rockOptions),
        anchor = { x: rockX, y: rockY },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        });

    World.add(world, [
        cradleA,
        cradleB,
        cradleC,
        rock,
        elastic
    ]);
    var size = 40;
    for (i = 0; i < 3; i += 1)
        for (j = 0; j < 12; j += 1) {
            square = Bodies.rectangle(800 + (size + 4) * i, 100 + (size + 4)* j, size, size, diamondOptions);
            World.add(engine.world, square);
            square.isStatic = true;
        };



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

    render.mouse = mouse;
    mouseConstraint.collisionFilter.mask = rockCategory;

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
    var threshold = 1;
    Events.on(engine, 'collisionEnd', function(event) {
        var pairs = event.pairs;
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];
            let bodyA = undefined,
                bodyB = undefined;
            if (pair.bodyB.label.startsWith("diamond") && !pair.bodyA.label.startsWith("rock"))   {
                bodyA = pair.bodyB;
                bodyB = pair.bodyA;
            } else if (pair.bodyA.label.startsWith("diamond") && !pair.bodyB.label.startsWith("rock")) {
                console.log(pair.bodyB.label, pair.bodyA.label);
                bodyA = pair.bodyA;
                bodyB = pair.bodyB;
            }
            if (bodyA) {
                let velocity = bodyB.velocity;
                if (Math.sqrt(velocity.x*velocity.x + velocity.y*velocity.y) * bodyB.mass > threshold) {
                    pos = bodyA.position;
                    Composite.remove(world, bodyA);
                    World.add(engine.world, Composites.stack(pos.x, pos.y, 2, 2, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 8, particleOptions)}));
                }
            }
        }
    });

    Render.lookAt(render, {
        min: { x: 0, y: 50 },
        max: { x: 1000, y: 600 }
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

