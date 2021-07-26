window.onload = () => {
    var size = 4;
    // Change cube size!

    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    function Cube(x, y, z, parent) {
        var cube = this.element = document.createElement("div");
        cube.className = "cube red";
        cube.style.left = x + "px";
        cube.style.top = y + "px";
        cube.style.transform = "translateZ(" + z + "px)";
        parent.appendChild(cube);
        this.sides = [];
        this.sideNames = ["front", "back", "left", "right", "top", "bottom"];
        for (var i = 0; i < this.sideNames.length; i++) {
            var name = this.sideNames[i];
            var side = document.createElement("div");
            side.className = name;
            cube.appendChild(side);
            this.sides.push(side);
        }
    }

    var cubeSize = 64;

    function RubiksCube() {
        var element = this.element = document.createElement("div");
        element.className = "rubikscube";
        container.appendChild(element);
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                for (var z = size; z > 0; z--) {
                    new Cube(x * cubeSize, y * cubeSize, -z * cubeSize, element);
                }
            }
        }
    }

    new RubiksCube();
}