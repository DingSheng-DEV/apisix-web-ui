/**
 * 批量更新i18n脚本 - 用于快速修复所有视图文件的硬编码文本
 */

// 需要更新的文件列表和对应的替换规则
const updateRules = [
  // SSL.vue
  {
    file: 'src/views/SSL.vue',
    imports: "import { useI18nUtils } from '@/utils/i18n.js';",
    hookSetup: "const { t } = useI18nUtils();",
    replacements: [
      { search: 'placeholder="根据id获取资源"', replace: ':placeholder="t(\'messages.searchById\')"' },
      { search: '>创建资源<', replace: '>{{ t(\'messages.createResource\') }}<' },
      { search: 'description="数据暂无"', replace: ':description="t(\'messages.noData\')"' },
      { search: 'label="证书"', replace: ':label="t(\'table.cert\')"' },
      { search: 'label="私钥"', replace: ':label="t(\'table.privateKey\')"' },
      { search: 'label="类型"', replace: ':label="t(\'table.type\')"' },
      { search: 'label="域名"', replace: ':label="t(\'table.domain\')"' },
      { search: 'label="操作"', replace: ':label="t(\'table.actions\')"' },
      { search: '>删除<', replace: '>{{ t(\'common.delete\') }}<' },
      { search: '>编辑<', replace: '>{{ t(\'common.edit\') }}<' },
      { search: 'title="参数配置"', replace: ':title="t(\'messages.configParams\')"' }
    ]
  },
  // Upstream.vue
  {
    file: 'src/views/Upstream.vue',
    imports: "import { useI18nUtils } from '@/utils/i18n.js';",
    hookSetup: "const { t } = useI18nUtils();",
    replacements: [
      { search: 'placeholder="根据id获取资源"', replace: ':placeholder="t(\'messages.searchById\')"' },
      { search: '>创建资源<', replace: '>{{ t(\'messages.createResource\') }}<' },
      { search: 'description="数据暂无"', replace: ':description="t(\'messages.noData\')"' },
      { search: 'label="主机传递"', replace: ':label="t(\'table.passHost\')"' },
      { search: 'label="协议"', replace: ':label="t(\'table.scheme\')"' },
      { search: 'label="哈希类型"', replace: ':label="t(\'table.hashType\')"' },
      { search: 'label="负载均衡"', replace: ':label="t(\'table.loadBalance\')"' },
      { search: 'label="操作"', replace: ':label="t(\'table.actions\')"' },
      { search: '>删除<', replace: '>{{ t(\'common.delete\') }}<' },
      { search: '>编辑<', replace: '>{{ t(\'common.edit\') }}<' },
      { search: 'title="参数配置"', replace: ':title="t(\'messages.configParams\')"' }
    ]
  },
  // global_rules.vue
  {
    file: 'src/views/global_rules.vue',
    imports: "import { useI18nUtils } from '@/utils/i18n.js';",
    hookSetup: "const { t } = useI18nUtils();",
    replacements: [
      { search: 'placeholder="根据id获取资源"', replace: ':placeholder="t(\'messages.searchById\')"' },
      { search: '>创建资源<', replace: '>{{ t(\'messages.createResource\') }}<' },
      { search: 'description="数据暂无"', replace: ':description="t(\'messages.noData\')"' },
      { search: 'label="策略"', replace: ':label="t(\'table.policy\')"' },
      { search: 'label="键"', replace: ':label="t(\'table.key\')"' },
      { search: 'label="拒绝状态码"', replace: ':label="t(\'table.rejectedCode\')"' },
      { search: 'label="时间窗口"', replace: ':label="t(\'table.timeWindow\')"' },
      { search: 'label="操作"', replace: ':label="t(\'table.actions\')"' },
      { search: '>删除<', replace: '>{{ t(\'common.delete\') }}<' },
      { search: '>编辑<', replace: '>{{ t(\'common.edit\') }}<' },
      { search: 'title="参数配置"', replace: ':title="t(\'messages.configParams\')"' }
    ]
  }
];

console.log('批量i18n更新规则已定义，总计', updateRules.length, '个文件需要更新');
export default updateRules;
