/**
 * Edge (middleware) ile Node (route handler) arasında paylaşılan sabitler.
 * Bilinçli olarak hiçbir Node API'si import etmez.
 */
export const ADMIN_COOKIE = "isik_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const ADMIN_LOGIN_PATH = "/admin/giris";
