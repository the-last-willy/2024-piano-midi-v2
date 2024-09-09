class Chronometer {
    constructor(timesource) {
        this.timesource = timesource;

        this.ispaused = true;

        this.timestarted = 0;
        this.timeelapsed = 0;
    }

    time() {
        if (this.ispaused)
            return this.timeelapsed;
        else
            return (this.timesource() - this.timestarted) + this.timeelapsed;
    }

    start() {
        if(!this.ispaused)
            return;
        this.ispaused = false;

        this.timestarted = this.timesource();
    }

    stop() {
        if(this.ispaused)
            return;
        this.ispaused = true;

        this.timeelapsed += this.timesource() - this.timestarted;
    }
}
