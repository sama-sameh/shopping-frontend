import { users } from "./users";

export class orders {
    id: number;
    user_id: number;
    order_date: Date;
    status: string;
    total: number;
    user_details: users;
    constructor(
        id: number,
        user_id: number,
        order_date: Date,
        status: string,
        total: number,
        user_details: users,
    ) {
        this.id = id;
        this.user_id = user_id;
        this.order_date = order_date;
        this.status = status;
        this.total = total;
        this.user_details = user_details;
    }
}