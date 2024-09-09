export class Histogram {
    constructor(parent) {
        this.bucketCount = 31;

        this.data = Array.from({length: this.bucketCount}, () => 0);

        this.chart = new Chart(
            parent,
            {
                type: 'bar',
                data: {
                    labels: this.data.map((value, index, array) => index / (this.bucketCount - 1)),
                    datasets: [
                        {
                            label: "Note On Velocity",
                            data: this.data
                        }
                    ]
                }
            }
        );
    }

    addVelocity(v) {
        this.data[Math.floor(v * (this.bucketCount - 1))] += 1;
        this.chart.update();
    }
}
