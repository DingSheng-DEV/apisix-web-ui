import Http from "@/utils/request.js";

/**
 * 获取SSL证书列表
 * @returns {Promise<ApiResponse<Array<SSL>>>} 包含SSL证书列表的Promise
 */
export function getSsls() {
  return Http.get("/apisix/admin/ssls");
}

/**
 * 获取指定ID的SSL证书详情
 * @param {string} id - SSL证书ID
 * @returns {Promise<ApiResponse<SSL>>} 包含SSL证书详情的Promise
 */
export function getSslsById(id) {
  return Http.get(`/apisix/admin/ssls/${id}`);
}

/**
 * 创建SSL证书
 * @param {Object} parms - SSL证书配置参数
 * @param {string} parms.cert - PEM格式的证书内容
 * @param {string} parms.key - PEM格式的私钥内容
 * @param {string[]} [parms.snis] - 关联的SNI列表
 * @param {number} [parms.validity_end] - 证书过期时间戳
 * @returns {Promise<ApiResponse<any>>} 包含创建结果的Promise
 */
export function createSsls(parms, id) {
  return Http.put(`/apisix/admin/ssls/${id}`, parms);
}

/**
 * 修改指定SSL证书的部分属性
 * @param {Object} parms - 需要更新的SSL证书字段
 * @param {string} id - 要修改的SSL证书ID
 * @returns {Promise<ApiResponse<any>>} 包含更新结果的Promise
 */
export function PatchSsls(parms, id) {
  return Http.patch(`/apisix/admin/ssls/${id}`, parms);
}

/**
 * 删除指定SSL证书
 * @param {string} id - 要删除的SSL证书ID
 * @returns {Promise<ApiResponse<any>>} 包含删除结果的Promise
 */
export function DeleteSsls(id) {
  return Http.delete(`/apisix/admin/ssls/${id}`);
}
