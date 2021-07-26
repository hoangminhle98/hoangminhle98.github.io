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
            name: 'Slingshot',
            id: 'slingshot',
            init: Example.slingshot
        }
    ]
});