/* ------------------------------- */

export class RouteOrderDetails {
    product_id: string;
    description: string;
    quantity: number;

    constructor(
        product_id: string,
        description: string,
        quantity: number
    ) {
        this.product_id = product_id;
        this.description = description;
        this.quantity = quantity;
    }
}

/* ------------------------------- */
