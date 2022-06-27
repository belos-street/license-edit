## 规则
- 组 简称  **()**
- 许可证 简称 **licence**
- 组内至少两个元素
- 元素可以是
   - **licence and ()**
   - **licence and licence**
   - **() and ()**
## 添加许可证

1. 选中添加 选中的区间数组倒数第二位添加的逻辑和许可证
1. 不选中添加
   1. licenseData.value.length > 0 出一对括号包住 licenseData.value数组头部添加开括号 尾部闭括号 倒数第二位添加逻辑元素符号和许可证
   1. licenseData.value.length === 0 数组长度是0的时候 添加一个许可证
## 删除许可证
1.该许可证是不是level === 0  , licenseData = []
2.该许可证的兄弟(开括号和许可证类型)是否只有一个

   1. 只有一个兄弟 删除 父级开闭括号 逻辑、和自己。  同时兄弟level - 1
   1. 2个及以上兄弟

## 添加组

1. 选中组添加 选中的区间数组倒数第二位添加的逻辑和组(licence and licence)
1. 不选中添加
   1. licenseData.value.length > 1 出一对括号包住 licenseData.value数组头部添加开括号 尾部闭括号 倒数第二位添加逻辑元素符号和组(licence and licence)
   1. licenseData.value.length <= 1 数组长度是0的时候 不显示

## 删除选定组

1. 该组是不是level === 0 的组
1. 该组的兄弟(开括号和许可证类型)是否只有1个
   1. 兄弟只有1个 删除 组的括号和逻辑符和父级括号  同时兄弟元素level - 1
      1. 兄弟是许可证
      1. 兄弟是组
   2. 兄弟大于1个 (根据选中组的最后一个item的nextItem是否为logical类型)
      1. 选中的组不是父组中最后的组 删下面的逻辑item
      1. 选中的组是父组中最后的组 删上面的逻辑item
## 保存校验数据算法
