var Example = Example || {};

Example.slingshot = function() {
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
    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
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

    var ground = Bodies.rectangle(395, 600, 1010, 50, { isStatic: true }),
        rockOptions = { density: 0.004 },
        rock = Bodies.polygon(170, 370, 8, 20, rockOptions),
        anchor = { x: 170, y: 370 },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        });
    rock.label = 'rock';

    var pyramid = Composites.pyramid(500, 380, 9, 10, 0, 0, function(x, y)
    {return Bodies.rectangle(x, y, 30, 30, { density: 0.004})});

    var ground2 = Bodies.rectangle(680, 200, 30, 20, { isStatic: true });

    var diamondOptions = {
            density: 0.004,
            label: 'diamond',
            render: {
                strokeStyle: 'white',
                fillStyle: 'white'
            },
        },
        diamond = Bodies.rectangle(635,380, 30, 30, diamondOptions),
        particleOptions = {
            density: 0.00001,
            render: {fillStyle: 'white'}
        };

    var diamond2 = Bodies.polygon(680,180, 8, 20, diamondOptions);

    World.add(engine.world, [ground, ground2, diamond2, pyramid, rock, elastic, diamond]);

    var threshold = 30;
    Events.on(engine, 'collisionStart', function(event) {
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
                    World.remove(world, bodyA);
                    World.add(engine.world, Composites.stack(pos.x, pos.y, 6, 6, 0, 0, function(x, y)
                    {return Bodies.circle(x,y, 3, particleOptions)}));
                }
            }
        }
    });

    Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 350)) {
            rock = Bodies.polygon(170, 370, 7, 20, rockOptions);
            rock.label = 'rock';
            World.add(engine.world, rock);
            elastic.bodyB = rock;
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

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
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

