var Example = Example || {};
Example.chains = function() {
    currentScore = 0;
    document.getElementById("score").innerHTML = 0;
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Events = Matter.Events,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Common = Matter.Common,
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
    var group = Body.nextGroup(true);
    diamondOptions = { density: 0.004, label: 'diamond', collisionFilter: { group: group }},
        particleOptions = {density: 0.00001, friction: 0.00001, restitution : 0.9};



    var ropeA = Composites.pyramid(100, 50, 7, 3, 10, 10, function(x, y) {
        return Bodies.circle(x, y, 20, diamondOptions);
    });

    Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
    Composite.add(ropeA, Constraint.create({
        bodyB: ropeA.bodies[0],
        pointB: { x: -25, y: 0 },
        pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
        stiffness: 0.5
    }));

    group = Body.nextGroup(true);

    var ropeB = Composites.stack(350, 50, 5, 2, 10, 10, function(x, y) {
        return Bodies.rectangle(x, y, 40, 20, diamondOptions);
    });

    Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
    Composite.add(ropeB, Constraint.create({
        bodyB: ropeB.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
        stiffness: 0.5
    }));

    group = Body.nextGroup(true);
    // diamondOptions.chamfer = 10;
    var ropeC = Composites.stack(630, 50, 10, 1, 10, 10, function(x, y) {
        return Bodies.rectangle(x - 20, y, 50, 20, Common.extend(diamondOptions, {chamfer:10}));
    });

    Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
    Composite.add(ropeC, Constraint.create({
        bodyB: ropeC.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
        stiffness: 0.5
    }));
    // var star = Vertices.fromPath('50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38');

    var ropeD = Composites.stack(500, 50, 10, 1, 10, 10, function(x, y) {
        return Bodies.rectangle(x, y, 40, 20, diamondOptions);
    });

    Composites.chain(ropeD, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
    Composite.add(ropeD, Constraint.create({
        bodyB: ropeD.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: ropeD.bodies[0].position.x, y: ropeD.bodies[0].position.y },
        stiffness: 0.1
    }));

    Composite.add(world, [
        ropeA,
        ropeB,
        ropeC,
        ropeD,
        Bodies.rectangle(400, 600, 500, 20, { isStatic: true })
    ]);

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);

    const rockX = 1000,
        rockY = 370,
        displacement = 30;
    var rockOptions = { density: 1, restitution: 0.99, friction: 0.001, collisionFilter: { category: rockCategory} },
        rock = Bodies.polygon(rockX, rockY, 8, 20, rockOptions),
        anchor = { x: rockX, y: rockY },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        })


    rock.label = 'rock';


    World.add(engine.world, [rock, elastic]);

    var threshold = 900;
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
                    bodyA.render.visible = false;
                    bodyA.label = "none";
                    World.add(engine.world, Composites.stack(pos.x, pos.y, 1, 4, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 7, particleOptions)}));
                    currentScore += world.bodies.length * 100
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
