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
        rock = Bodies.polygon(170, 450, 8, 20, rockOptions),
        anchor = { x: 170, y: 450 },
        elastic = Constraint.create({
            pointA: anchor,
            bodyB: rock,
            stiffness: 0.05
        });
    rock.label = 'rock';

    var pyramid = Composites.pyramid(500, 380, 9, 10, 0, 0, function(x, y)
    {return Bodies.rectangle(x, y, 35, 40)});

    var ground2 = Bodies.rectangle(620, 200, 140, 20, { isStatic: true });

    var diamondOptions = {
            density: 0.004,
            label: 'diamond',
            render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: './rock.png'
                }
            },
        },
        diamond = Bodies.polygon(656.5,365, 8, 20, diamondOptions),
        smallDiamondOptions = {
            density: 0.00001,
            render: {
                fillStyle: 'white'
            }
        };
    diamond.label = 'diamond';
    var getDiamond = function(x, y) {
        let temp = Bodies.polygon(x,y, 8, 20, diamondOptions);
        temp.label = 'diamond';
        return temp;
    };
    var pyramid2 = Composites.pyramid(557, 0, 5, 10, 0, 0, getDiamond);

    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];
            collided = undefined;
            if (pair.bodyA.label === "rock" && pair.bodyB.label === "diamond"){
                collided = pair.bodyB;
            } else if (pair.bodyA.label === "diamond" && pair.bodyB.label === "rock"){
                collided = pair.bodyA;
            }
            if (collided) {
                World.remove(world, collided);
                pos = collided.position;
                World.add(engine.world, Composites.stack(pos.x, pos.y, 6, 6, 0, 0, function(x, y)
                {return Bodies.circle(x,y, 3, smallDiamondOptions)}));
            }
        }
    });


    World.add(engine.world, [ground, pyramid, ground2, pyramid2, rock, elastic, diamond]);

    Events.on(engine, 'afterUpdate', function() {
        if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
            rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
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

