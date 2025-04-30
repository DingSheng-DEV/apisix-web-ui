import Http from "../utils/request.js";
export function getRouters() {
  return Http.get("/apisix/admin/routes");
}
export function getRouterById(id) {
  return Http.get(`/apisix/admin/routes/${id}`);
}

export function createRouters(parms, id) {
  return Http.post(`/apisix/admin/routes`, parms);
}
export function PatchRouters(parms) {
  return Http.put("/apisix/admin/routes/1", parms);
}
export function DeleteRouterByID(id) {
  return Http.delete(`/apisix/admin/routes/${id}`);
}
