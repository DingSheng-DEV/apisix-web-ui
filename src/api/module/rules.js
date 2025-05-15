import Http from "@/utils/request.js";

/**
 * 获取全局规则列表
 * @returns {Promise<ApiResponse<Array<GlobalRule>>>} 包含全局规则列表的Promise
 */
export function getGlobal_rules() {
  return Http.get("/apisix/admin/global_rules");
}

/**
 * 获取指定ID的全局规则详情
 * @param {string} id - 全局规则ID
 * @returns {Promise<ApiResponse<GlobalRule>>} 包含全局规则详情的Promise
 */
export function getGlobal_rulesById(id) {
  return Http.get(`/apisix/admin/global_rules/${id}`);
}

/**
 * 创建全局规则
 * @param {Object} parms - 全局规则配置参数
 * @param {Object} parms.plugins - 插件配置对象
 * @param {number} [parms.priority] - 规则优先级
 * @param {string} [parms.desc] - 规则描述
 * @param {Object} [parms.metadata] - 元数据信息
 * @returns {Promise<ApiResponse<any>>} 包含创建结果的Promise
 */
export function createGlobal_rules(parms, id) {
  return Http.put(`/apisix/admin/global_rules/${id}`, parms);
}

/**
 * 修改指定全局规则的部分属性
 * @param {Object} parms - 需要更新的全局规则字段
 * @param {string} id - 要修改的全局规则ID
 * @returns {Promise<ApiResponse<any>>} 包含更新结果的Promise
 */
export function PatchGlobal_rules(parms, id) {
  return Http.patch(`/apisix/admin/global_rules/${id}`, parms);
}

/**
 * 删除指定全局规则
 * @param {string} id - 要删除的全局规则ID
 * @returns {Promise<ApiResponse<any>>} 包含删除结果的Promise
 */
export function DeleteGlobal_rules(id) {
  return Http.delete(`/apisix/admin/global_rules/${id}`);
}
