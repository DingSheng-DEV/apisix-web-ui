import Http from "../utils/request.js";
/**
 * 获取资源列表
 * @returns Promise<ApiResponse<any>>
 */
export function getRouters() {
  return Http.get("/apisix/admin/routes");
}
/**
 * 	根据 id 获取资源。
 * @param id string
 * @returns Promise<ApiResponse<any>>
 */
export function getRouterById(id) {
  return Http.get(`/apisix/admin/routes/${id}`);
}
/**
 * 创建路由资源，id 将会自动生成。
 * @param {Object} parms - 路由配置参数
 * @param {string} [parms.name] - 路由名称
 * @param {string} [parms.desc] - 路由描述
 * @param {Array} [parms.uris] - 匹配URI列表
 * @param {Array} [parms.methods] - 允许的HTTP方法
 * @param {Object} [parms.upstream] - 上游配置
 * @returns {Promise<ApiResponse<any>>} 包含创建结果的Promise
 */
export function createRouters(parms) {
  return Http.post(`/apisix/admin/routes`, parms);
}

/**
 * 标准 PATCH，修改指定路由的部分属性
 * @param {Object} parms - 需要更新的路由字段（部分更新）
 * @param {string} id - 要修改的路由ID
 * @returns {Promise<ApiResponse<any>>} 包含更新结果的Promise
 */
export function PatchRouters(parms, id) {
  return Http.patch(`/apisix/admin/routes/${id}`, parms);
}

/**
 * 删除指定路由资源
 * @param {string} id - 要删除的路由ID
 * @returns {Promise<ApiResponse<any>>} 包含删除结果的Promise
 */
export function DeleteRouterByID(id) {
  return Http.delete(`/apisix/admin/routes/${id}`);
}

/**
 * 获取服务资源列表
 * @returns {Promise<ApiResponse<Array<Service>>>} 包含服务列表的Promise
 */
export function getServices() {
  return Http.get("/apisix/admin/services");
}

/**
 * 获取指定ID的服务资源详情
 * @param {string} id - 服务ID
 * @returns {Promise<ApiResponse<Service>>} 包含服务详情的Promise
 */
export function getServicesId(id) {
  return Http.get(`/apisix/admin/services/${id}`);
}

/**
 * 创建服务资源
 * @param {Object} parms - 服务配置参数
 * @param {string} [parms.name] - 服务名称
 * @param {string} [parms.desc] - 服务描述
 * @param {Object} [parms.upstream] - 上游配置
 * @returns {Promise<ApiResponse<any>>} 包含创建结果的Promise
 */
export function createServices(parms, id) {
  return Http.put(`/apisix/admin/services/${id}`, parms);
}

/**
 * 修改指定服务的部分属性
 * @param {Object} parms - 需要更新的服务字段（部分更新）
 * @param {string} id - 要修改的服务ID
 * @returns {Promise<ApiResponse<any>>} 包含更新结果的Promise
 */
export function PatchServices(parms, id) {
  return Http.patch(`/apisix/admin/services/${id}`, parms);
}

/**
 * 删除指定服务资源
 * @param {string} id - 要删除的服务ID
 * @returns {Promise<ApiResponse<any>>} 包含删除结果的Promise
 */
export function DeleteServicesID(id) {
  return Http.delete(`/apisix/admin/services/${id}`);
}

/**
 * 获取上游资源列表
 * @returns {Promise<ApiResponse<Array<Upstream>>>} 包含上游列表的Promise
 */
export function getUpstreams() {
  return Http.get("/apisix/admin/upstreams");
}

/**
 * 获取指定ID的上游资源详情
 * @param {string} id - 上游ID
 * @returns {Promise<ApiResponse<Upstream>>} 包含上游详情的Promise
 */
export function getUpstreamsById(id) {
  return Http.get(`/apisix/admin/upstreams/${id}`);
}

/**
 * 创建上游资源
 * @param {Object} parms - 上游配置参数
 * @param {string} [parms.type] - 负载均衡类型（roundrobin/chash等）
 * @param {Object} parms.nodes - 上游节点列表 { "ip:port": weight }
 * @param {number} [parms.retries] - 请求重试次数
 * @param {Object} [parms.timeout] - 超时设置 {connect: ms, send: ms, read: ms}
 * @returns {Promise<ApiResponse<any>>} 包含创建结果的Promise
 */
export function createUpstreams(parms) {
  return Http.post(`/apisix/admin/upstreams`, parms);
}

/**
 * 修改指定上游的部分属性
 * @param {Object} parms - 需要更新的上游字段（部分更新）
 * @param {string} id - 要修改的上游ID
 * @returns {Promise<ApiResponse<any>>} 包含更新结果的Promise
 */
export function PatchUpstreams(parms, id) {
  return Http.patch(`/apisix/admin/upstreams/${id}`, parms);
}

/**
 * 删除指定上游资源
 * @param {string} id - 要删除的上游ID
 * @returns {Promise<ApiResponse<any>>} 包含删除结果的Promise
 */
export function DeleteUpstreamsID(id) {
  return Http.delete(`/apisix/admin/upstreams/${id}`);
}
