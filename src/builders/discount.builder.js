class DiscountBuilder {

    constructor() {
        this.start_date = null;
        this.end_date = null;
        this.now = new Date();
        this.error = null;
    }

    setStartDate(start_date) {
        this.start_date = new Date(start_date);
        return this;
    }

    setEndDate(end_date) {
        this.end_date = new Date(end_date);
        return this;
    }

    build() {

        if (this.now < this.start_date || this.now > this.end_date) {
            this.error = "Discount code has expried!";
        }

        if (this.start_date >= this.end_date) {
            this.error = "Start date must be before end date!";
        }

        return {
            error: this.error,
            valueBuilder: this.error ? null : {
                start_date: this.start_date,
                end_date: this.end_date
            }
        };
    }
}

module.exports = DiscountBuilder;