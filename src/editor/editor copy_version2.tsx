import { defineComponent, ref, toRaw } from 'vue'
import './index.less'

/**
 * 开始括号 openBracket
 * 逻辑符号 logical
 * 许可证 license
 * 闭括号 closeBracket
 */
type TOpenBracket = {
  type: 'openBracket'
  value: '('
  level: number
  uid: string
}
type TCloseBracket = {
  type: 'closeBracket'
  value: ')'
  level: number
  uid: string
}
type TLogical = {
  type: 'logical'
  value: 'or' | 'and'
  level: number
  uid: string
}
type TLicense = {
  type: 'license'
  value: string
  level: number
  uid: string
}
type IEditItem = TOpenBracket | TCloseBracket | TLogical | TLicense
type IEditData = (
  | Omit<TOpenBracket, 'level' | 'uid'>
  | Omit<TCloseBracket, 'level' | 'uid'>
  | Omit<TLogical, 'level' | 'uid'>
  | Omit<TLicense, 'level' | 'uid'>
)[]
type TState = 'view' | 'edit'

function getUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default defineComponent({
  setup() {
    const pageState = ref<TState>('view')
    const licenseData = ref<IEditItem[]>([])
    const selectGroup = ref<string[]>([])

    const initData: IEditData = [
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'EPL' },
      { type: 'logical', value: 'or' },
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'EPL' },
      { type: 'logical', value: 'or' },
      { type: 'license', value: 'gpl' },
      { type: 'closeBracket', value: ')' },
      { type: 'closeBracket', value: ')' }
    ]

    licenseData.value = setEditDataAddAttr([
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'EPL' },
      { type: 'logical', value: 'or' },
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'MIT' },
      { type: 'logical', value: 'and' },
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'BSD' },
      { type: 'logical', value: 'or' },
      { type: 'license', value: 'gpl' },
      { type: 'logical', value: 'or' },
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'Apache-2.0' },
      { type: 'logical', value: 'or' },
      { type: 'license', value: 'GNU' },
      { type: 'closeBracket', value: ')' },
      { type: 'closeBracket', value: ')' },
      { type: 'closeBracket', value: ')' },
      { type: 'logical', value: 'or' },
      { type: 'openBracket', value: '(' },
      { type: 'license', value: 'Apache-2.0' },
      { type: 'logical', value: 'or' },
      { type: 'license', value: 'GNU' },
      { type: 'closeBracket', value: ')' },
      { type: 'closeBracket', value: ')' }
    ])

    // [
    //   { type: 'openBracket', value: '(' },
    //   { type: 'license', value: 'EPL' },
    //   { type: 'logical', value: 'or' },
    //   { type: 'openBracket', value: '(' },
    //   { type: 'license', value: 'MIT' },
    //   { type: 'logical', value: 'and' },
    //   { type: 'openBracket', value: '(' },
    //   { type: 'license', value: 'BSD' },
    //   { type: 'logical', value: 'or' },
    //   { type: 'license', value: 'gpl' },
    //   { type: 'logical', value: 'or' },
    //   { type: 'openBracket', value: '(' },
    //   { type: 'license', value: 'Apache-2.0' },
    //   { type: 'logical', value: 'or' },
    //   { type: 'license', value: 'GNU' },
    //   { type: 'closeBracket', value: ')' },
    //   { type: 'closeBracket', value: ')' },
    //   { type: 'closeBracket', value: ')' },
    //   { type: 'logical', value: 'or' },
    //   { type: 'openBracket', value: '(' },
    //   { type: 'license', value: 'Apache-2.0' },
    //   { type: 'logical', value: 'or' },
    //   { type: 'license', value: 'GNU' },
    //   { type: 'closeBracket', value: ')' },
    //   { type: 'closeBracket', value: ')' }
    // ]

    /**
     * 初始化原始数组的属性 添加level和uid
     * 闭括号 level - 1
     * 开括号后 level + 1
     */
    function setEditDataAddAttr(arr: IEditData) {
      let pointer: number = 0
      let licenseData: IEditItem[] = []
      for (const item of arr) {
        const { type } = item
        if (type === 'closeBracket') pointer--
        licenseData.push({ ...item, level: pointer, uid: getUid() })
        if (type === 'openBracket') pointer++
      }
      return licenseData
    }

    function hanldeClickSave() {
      pageState.value = 'view'
    }

    function hanldeClickEdit() {
      pageState.value = 'edit'
    }

    /**
     * 许可证下拉框
     */
    function LicenseSelect(item: IEditItem) {
      const { uid, level, value } = item
      const selectChange = (e: any) => {
        licenseData.value.filter((_item) => (_item.uid === uid ? (_item.value = e.target.value) : ''))
      }
      return (
        <section
          style={{ 'padding-left': `${level * 16}px` }}
          class={`item-ele ${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}>
          <select onChange={(e) => selectChange(e)} value={value} disabled={pageState.value !== 'edit'}>
            <option value="BSD">BSD</option>
            <option value="Apache-2.0">Apache-2.0</option>
            <option value="MIT">MIT</option>
            <option value="EPL">EPL</option>
            <option value="GNU">GNU</option>
            <option value="gpl">gpl</option>
          </select>
          {pageState.value === 'edit' ? <a-button type="link">删除</a-button> : ''}
        </section>
      )
    }

    /**
     * 逻辑下拉框
     */
    function LogicalSelect(item: IEditItem) {
      const { uid, level, value } = item
      const selectChange = (e: any) => {
        licenseData.value.filter((_item) => (_item.uid === uid ? (_item.value = e.target.value) : ''))
      }
      return (
        <section
          style={{ 'padding-left': `${level * 16}px` }}
          class={`item-ele ${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}>
          <select onChange={(e) => selectChange(e)} value={value} disabled={pageState.value !== 'edit'}>
            <option value="and">and</option>
            <option value="or">or</option>
          </select>
        </section>
      )
    }

    /**
     * 设置选中颜色
     * flag 收集数组的标志
     * 当收集到同级的闭括号后取消收集
     */
    function setSelectGroup(item: IEditItem) {
      const colorArr: string[] = []
      let flag = false
      for (const { uid, level, type } of licenseData.value) {
        if (uid === item.uid) {
          flag = true
          colorArr.push(uid)
        } else if (flag) {
          colorArr.push(uid)
          if (level === item.level && type === 'closeBracket') {
            flag = false
          }
        }
      }
      selectGroup.value.toString() === colorArr.toString() ? (selectGroup.value = []) : (selectGroup.value = colorArr)
    }

    /**
     * 添加许可证
     * 1.选中组添加 组内有元素时 在组内最后出现 加上逻辑和许可证
     * 2.选中组添加 组内无元素时 在组内添加许可证
     * 3.不选中组添加 且licenseData不只有level === 0的括号元素 直接在最外层加上 加上逻辑和许可证
     * 4.不选中组添加 且licenseData只有level === 0的括号元素
     */
    function hanldeClickAddLicense() {
      const arr = licenseData.value
      let sgArr = selectGroup.value
      if (sgArr.length !== 0) {
        //(1，2 )--- 判断选中组 组内是否有元素 根据选中组的第二个元素是否为闭括号判断
        let secondSgItem = arr.find((item) => item.uid === sgArr[1])
        if (secondSgItem && secondSgItem.type !== 'closeBracket') {
          /**1 */
          //1-1. 获取selectGroup的最后一个uid
          const lastSgUid = sgArr[sgArr.length - 1]

          //1-2. 根据lastUid找到它在licenseData的元素和索引位置
          let lastSgIndex = arr.findIndex((item) => item.uid === lastSgUid),
            lastSgItem = arr[lastSgIndex]

          //1-3. licenseData的lastSgIndex位置添加逻辑和许可证
          if (!lastSgItem || lastSgIndex === 0) return
          let uid1 = getUid(),
            uid2 = getUid()
          arr.splice(
            lastSgIndex,
            0,
            { type: 'logical', value: 'and', level: lastSgItem.level + 1, uid: uid1 },
            { type: 'license', value: '', level: lastSgItem.level + 1, uid: uid2 }
          )

          //1-4 添加的逻辑和许可证也需要选中
          sgArr.splice(sgArr.length - 1, 0, uid1, uid2)
        } else {
          /**2 */
          //2-1. 获取selectGroup的第一个Item 和 索引
          let sgFristIndex = arr.findIndex((item) => item.uid === sgArr[0]),
            sgFristItem = arr[sgFristIndex]
          if (!sgFristItem) return
          //2-2. licenseData的 sgFristIndex + 1 位置插入许可证
          let uid = getUid()
          arr.splice(sgFristIndex + 1, 0, { type: 'license', value: '', level: sgFristItem.level + 1, uid })
          //2-3. 添加的许可证也需要选中
          sgArr.splice(sgFristIndex + 1, 0, uid)
        }
      } else {
        /**(3,4) 不选中组添加 */
        //3
        if (arr.length !== 2) {
          //3-1.等级全部+1
          arr.map((item) => (item.level += 1))

          //3-2.数组头部添加开括号
          arr.splice(0, 0, { type: 'openBracket', value: '(', level: 0, uid: getUid() })

          //3-3.数组尾部添加闭括号
          arr.push({ type: 'closeBracket', value: ')', level: 0, uid: getUid() })

          //3-4.数组倒数第二位添加逻辑和许可证
          arr.splice(
            arr.length - 1,
            0,
            { type: 'logical', value: 'and', level: 1, uid: getUid() },
            { type: 'license', value: '', level: 1, uid: getUid() }
          )
        } else {
          //4
          arr.splice(1, 0, { type: 'license', value: '', level: 1, uid: getUid() })
        }
      }
    }

    /**
     * 删除许可证
     * 1. 删的为组内最后一个
     * 2. 删的为非组内最后一个
     * 3.
     */

    /**
     * 组：除初始组以外，其他组里面至少两对类型
     * 添加组
     * 1.不选中组添加
     * 2.选中组添加
     */

    /**
     * 删除选定组
     * 1.选中的最外一层的组 开括号level === 0
     * 2.选中的非最外一层的组 且该组在兄弟组中非最后一个组
     * 3.选中的非最外一层的组 且该组在兄弟组中是最后(或只有)一个组 [只有一组元素(该组)时，不需要删除逻辑组件]
     */
    function handleClicRemoveGroup() {
      let arr = licenseData.value
      let sgArr = selectGroup.value

      /**1 level === 0 */
      if (sgArr[0] === arr[0].uid) {
        licenseData.value = [{ ...arr[0] }, { ...arr[arr.length - 1] }]
        selectGroup.value = []
        return
      }
      const lastSgIndex = arr.findIndex((item) => item.uid === sgArr[sgArr.length - 1])
      const nextItem = arr[lastSgIndex + 1]

      /**2 */
      //开括号level >= 1 的group 的 闭括号 的下一个item是否为logical类型 true则满足2的条件
      if (nextItem.type === 'logical') {
        //2-1. 要删除licenseData中所有selectGroup的item和nextItem
        licenseData.value = arr.filter((item) => !sgArr.includes(item.uid)).filter((item) => item.uid !== nextItem.uid)
        selectGroup.value = []
        return
      }

      /**3 */
      //判断上一个item是否为逻辑符号  是 则改组没有兄弟组
      const fristSgIndex = arr.findIndex((item) => item.uid === sgArr[0]),
        prevItem = arr[fristSgIndex - 1]
      if (arr[fristSgIndex - 1].type === 'logical') {
        licenseData.value = arr.filter((item) => !sgArr.includes(item.uid)).filter((item) => item.uid !== prevItem.uid)
        selectGroup.value = []
      } else {
        console.error('只有一个组 后续看如何判断')
        //只有一个组
      }
    }

    return () => (
      <main>
        <h1>JSON</h1>
        <section>{JSON.stringify(licenseData.value)}</section>
        <hr />
        <h1>expression</h1>
        <section>{licenseData.value.map((item) => item.value + ' ').reduce((total, currentValue) => total + currentValue, '')}</section>
        <hr />
        <h1>edit zone</h1>
        <section class="zone">
          <div>
            {pageState.value === 'edit' ? (
              <>
                <section>
                  <a-button onClick={hanldeClickSave}>保存</a-button>
                </section>
                <section>
                  <a-button onClick={hanldeClickAddLicense}>添加许可证</a-button>
                  <a-button>添加组</a-button>
                  {selectGroup.value.length === 0 ? (
                    ''
                  ) : (
                    <a-button danger onClick={handleClicRemoveGroup}>
                      删除选定组
                    </a-button>
                  )}
                </section>
              </>
            ) : (
              <a-button onClick={hanldeClickEdit}>编辑</a-button>
            )}
          </div>
          <div class="edit-zone">
            {licenseData.value.map((item) => {
              const { type, value, level, uid } = item
              let dom: JSX.Element
              switch (type) {
                case 'openBracket':
                  dom = (
                    <section
                      style={{ 'padding-left': `${level * 16}px` }}
                      class={`item-ele bracket open color-level-${level} ${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}
                      onClick={() => setSelectGroup(item)}>
                      {value}
                    </section>
                  )
                  break
                case 'closeBracket':
                  dom = (
                    <section
                      style={{ 'padding-left': `${level * 16}px` }}
                      class={`item-ele bracket close color-level-${level} ${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}>
                      {value}
                    </section>
                  )
                  break
                case 'logical':
                  dom = LogicalSelect(item)
                  break
                case 'license':
                  dom = LicenseSelect(item)
                  break
              }
              return dom
            })}
          </div>
        </section>
      </main>
    )
  }
})
