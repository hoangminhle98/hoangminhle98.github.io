var Example = Example || {};
var currentScore = 0;
MatterTools.Demo.create({
    toolbar: {
        title: 'Angry Balls',
        reset: true,
        source: true,
        fullscreen: true,
        exampleSelect: true,
        score: true
    },
    preventZoom: true,
    resetOnOrientation: true,
    examples: [
        {
            name: 'Candy Land',
            id: 'candyland',
            init: Example.candyland
        },
        {
            name: 'Newton\'s Cradle',
            id : 'newtoncradle',
            init: Example.newtonsCradle
        },
        {
            name: 'Cloth',
            id: 'cloth',
            init: Example.cloth
        },
        {
            name: 'Outta space',
            id : 'outtaspace',
            init: Example.outtaspace
        },
        {
            name: 'Winter Day',
            id: 'winterday',
            init: Example.winterday
        },
        {
            name: 'Chains',
            id: 'chains',
            init: Example.chains
        },
        {
            name: 'Run devil run',
            id: 'run',
            init: Example.manipulation
        },

    ]
});

const elements = document.getElementsByClassName("matter-logo");
while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
}
var scoreBoard = document.createElement("div");
scoreBoard.setAttribute("id", "scoreBoard");
var score = document.createElement("div");
score.setAttribute("id", "score");
score.innerHTML = 0;
scoreBoard.appendChild(document.createTextNode("SCORE: "));
scoreBoard.appendChild(score);
document.getElementsByClassName("matter-link")[0].appendChild(scoreBoard);
