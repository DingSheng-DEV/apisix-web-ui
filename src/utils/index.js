/**
 * 深度遍历对象，过滤掉空值
 * @param {Object} obj - 要处理的对象
 * @returns {Object} 过滤后的新对象
 */
function filterEmptyValues(obj) {
  // 处理null或undefined
  if (obj === null || obj === undefined) {
    return undefined;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const filteredArray = obj
      .map((item) => filterEmptyValues(item))
      .filter((item) => item !== undefined);
    return filteredArray.length > 0 ? filteredArray : undefined;
  }

  // 处理对象
  if (typeof obj === "object") {
    const result = {};
    let hasValue = false;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        let filteredValue;

        // 特殊处理空字符串、空对象和空数组
        if (
          value === "" ||
          (typeof value === "object" && Object.keys(value).length === 0)
        ) {
          filteredValue = undefined;
        } else {
          filteredValue = filterEmptyValues(value);
        }

        if (filteredValue !== undefined) {
          result[key] = filteredValue;
          hasValue = true;
        }
      }
    }

    return hasValue ? result : undefined;
  }

  // 其他非空值直接返回
  return obj;
}

export function getNonEmptyValues(data) {
  const filtered = filterEmptyValues(data);
  return filtered || {};
}
//00000000000000001407写一个函数处理这种字符串去掉前面的0将剩下的数字+1后返回字符串
export function processString(str) {
  // 去掉前面的零
  let result = str.replace(/^0+/, "");

  // 如果去掉零后为空字符串，说明原字符串全是零，返回 '1'
  if (result === "") {
    return "1";
  }

  // 将剩下的数字加 1
  result = BigInt(result) + BigInt(1);

  // 返回结果字符串
  return result.toString();
}
