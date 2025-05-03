import { users } from "./users";

export interface Order {
    id: string;
    user_id: string;
  createdAt: string;
    status: string;
  totalPrice: string;

}
