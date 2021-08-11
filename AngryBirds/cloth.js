var Example = Example || {};
var defaultCategory = 0x0001,
    rockCategory = 0x0002;
var rockOptions = { density: 1, restitution: 0.99, friction: 0.001, collisionFilter: { category: rockCategory}, label: 'rock' },
    diamondOptions = { density: 0.004, label: 'diamond'},
    particleOptions = {density: 0.00001, friction: 0.00001, restitution : 0.9};
Example.cloth = function() {
    currentScore = 0;
    document.getElementById("score").innerHTML = 0;
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
    diamondOptions = { density: 0.004, label: 'diamond'},
        particleOptions = {density: 0.00001, friction: 0.00001, restitution : 0.9};

    rock.label = 'rock';

    var cloth = Example.cloth.cloth(200, 200, 20, 12, 5, 5, false, 8, diamondOptions);

    for (var i = 0; i < 20; i++) {
        cloth.bodies[i].isStatic = true;
    }

    Composite.add(world, [
        cloth,
        Bodies.rectangle(450, 609, 500, 50, { isStatic: true })
    ]);

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
                    Composite.remove(world, bodyA);
                    setTimeout(() => {
                        World.remove(rock);
                    }, 2000);

                    World.add(engine.world, Composites.stack(pos.x, pos.y, 1, 2, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 7, particleOptions)}));
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
Example.cloth.cloth = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composites = Matter.Composites;

    var group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }}, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } }, constraintOptions);

    var cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
};

