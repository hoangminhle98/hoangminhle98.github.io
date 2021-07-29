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
            name: 'Outta space',
            id : 'outtaspace',
            init: Example.outtaspace
        },
        {
            name: 'Newton\'s Cradle',
            id : 'newtoncradle',
            init: Example.newtonsCradle
        },
        {
            name: 'Candy Land',
            id: 'candyland',
            init: Example.candyland
        },
        {
            name: 'Winter Day',
            id: 'winterday',
            init: Example.winterday
        },

    ]
});