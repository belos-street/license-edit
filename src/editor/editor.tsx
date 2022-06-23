import { defineComponent, ref } from 'vue'
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
    ]

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
     * 闭括号 level - 1
     * 开括号后 level + 1
     */
    const setEditDataAddAttr = (arr: IEditData) => {
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

    licenseData.value = setEditDataAddAttr(initData)

    function hanldeClickSave() {
      pageState.value = 'view'
    }

    function hanldeClickEdit() {
      pageState.value = 'edit'
    }

    function LicenseSelect(item: IEditItem) {
      const { uid, level, value } = item
      const selectChange = (e: any) => {
        licenseData.value.filter((_item) => (_item.uid === uid ? (_item.value = e.target.value) : ''))
      }
      return (
        <section style={{ 'padding-left': `${level * 16}px` }} class={`${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}>
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

    function LogicalSelect(item: IEditItem) {
      const { uid, level, value } = item
      const selectChange = (e: any) => {
        licenseData.value.filter((_item) => (_item.uid === uid ? (_item.value = e.target.value) : ''))
      }
      return (
        <section style={{ 'padding-left': `${level * 16}px` }} class={`${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}>
          <select onChange={(e) => selectChange(e)} value={value} disabled={pageState.value !== 'edit'}>
            <option value="and">and</option>
            <option value="or">or</option>
          </select>
        </section>
      )
    }

    function setSelectGroup(item: IEditItem) {
      /**
       * 设置选中颜色
       * flag 收集数组的标志
       * 当收集到同级的闭括号后取消收集
       */
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
     * 1.不选中组添加
     * 2.选中组添加
     */

    /**
     * 添加组
     * 1.不选中组添加
     * 2.选中组添加
     */

    /**
     * 删除选定组
     */

    /**
     * 删除许可证
     */

    return () => (
      <main>
        <h1>JSON</h1>
        <section>{JSON.stringify(licenseData.value)}</section>
        <hr />
        <h1>expression</h1>
        <section>{licenseData.value.map((item) => item.value + ' ').reduce((total, currentValue) => total + currentValue, '')}</section>
        <hr />
        <section class="zone">
          <h1>edit zone</h1>
          <div>
            {pageState.value === 'edit' ? (
              <>
                <section>
                  <a-button onClick={hanldeClickSave}>保存</a-button>
                </section>
                <section>
                  <a-button>添加许可证</a-button>
                  <a-button>添加组</a-button>
                  <a-button>删除选定组</a-button>
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
                      class={`bracket open color-level-${level} ${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}
                      onClick={() => setSelectGroup(item)}>
                      {value}
                    </section>
                  )
                  break
                case 'closeBracket':
                  dom = (
                    <section
                      style={{ 'padding-left': `${level * 16}px` }}
                      class={`bracket close color-level-${level} ${selectGroup.value.includes(uid) ? 'color-group-select' : ''}`}>
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
