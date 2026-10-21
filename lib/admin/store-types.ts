import type {
  AdminMessage,
  AdminOrder,
  AdminSubscriber,
} from "@/lib/admin/types";

export interface AdminStoreLike {
  orders: AdminOrder[];
  messages: AdminMessage[];
  subscribers: AdminSubscriber[];
}
