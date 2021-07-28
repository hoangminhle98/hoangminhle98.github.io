var Example = Example || {};

MatterTools.Demo.create({
    toolbar: {
        title: 'Angry Birds Clone',
        reset: true,
        source: true,
        fullscreen: true,
        exampleSelect: true
    },
    preventZoom: true,
    resetOnOrientation: true,
    examples: [
        {
            name: 'Winter Day',
            id: 'winterday',
            init: Example.winterday
        },
        {
            name: 'Candy Land',
            id: 'candyland',
            init: Example.candyland
        }
    ]
});