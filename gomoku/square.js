class Square{
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.val = 0;

        // create an element typed div & add class 'square' to it
        this.domObj = document.createElement('div');   // DOM object corresponding to a square
        this.domObj.classList.add('square');

        this.domObj.id = '(' + row + ',' + col + ')';

        this.domObj.title = this.domObj.id;
    }
    isOccupied() {
        return this.val != 0;
    }

    setOnClick(onClickFn){
        this.domObj.onclick = onClickFn;
    }
    getVal() {
        return this.val;
    }
    setVal(val) {
        this.val = val;
    }
    humanSelect() {
        this.val = 1;
        this.getDomObj().classList.add('human');
    }

    cpuSelect() {
        this.val = -1;
        this.getDomObj().classList.add('cpu');
    }

    getDomObj() {
        return this.domObj;
    }
    isValid() {
        return max(this.row, this.col) < SIZE && min(this.row, this.col) > -1;
    }

    twinkle() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.getDomObj().classList.add('white');
                resolve();
            }, 20);
        })
    }

    untwinkle() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.getDomObj().classList.remove('white');
                resolve();
            }, 20);
        })
    }

}

