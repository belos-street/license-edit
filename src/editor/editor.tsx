import { defineComponent, ref } from 'vue'
import { IEditItem, IEditData, TState } from './type'
import { setUid } from './tools'
import { TypeValue } from './const'
import './index.less'

export default defineComponent({
  setup() {
    const pageState = ref<TState>('view')
    const licenceData = ref<IEditItem[]>([])
    const selectGroup = ref<string[]>([])

    const initData: IEditData = [
      { type: 'openBracket', value: '(' },
      { type: 'openBracket', value: '(' },
      { type: 'licence', value: 'EPL' },
      { type: 'logical', value: 'or' },
      { type: 'licence', value: 'gpl' },
      { type: 'closeBracket', value: ')' },
      { type: 'logical', value: 'or' },
      { type: 'openBracket', value: '(' },
      { type: 'licence', value: 'EPL' },
      { type: 'logical', value: 'or' },
      { type: 'licence', value: 'gpl' },
      { type: 'closeBracket', value: ')' },
      { type: 'logical', value: 'or' },
      { type: 'licence', value: 'gpl' },
      { type: 'closeBracket', value: ')' }
    ]

    licenceData.value = setEditDataAddAttr(initData)
    /**
     * 初始化原始数组的属性 添加level和uid
     * 闭括号 level - 1
     * 开括号后 level + 1
     */
    function setEditDataAddAttr(arr: IEditData) {
      let pointer: number = 0
      let licenceData: IEditItem[] = []
      for (const item of arr) {
        const { type } = item
        if (type === TypeValue.closeBracket) pointer--
        licenceData.push({ ...item, level: pointer, uid: setUid() })
        if (type === TypeValue.openBracket) pointer++
      }
      return licenceData
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
    function LicenceSelect(item: IEditItem) {
      const { uid, level, value } = item
      const selectChange = (e: any) => {
        licenceData.value.filter((_item) => (_item.uid === uid ? (_item.value = e.target.value) : ''))
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
          {pageState.value === 'edit' ? (
            <a-button type="link" onClick={() => hanldeClickDeleteLicence(item)}>
              删除
            </a-button>
          ) : (
            ''
          )}
        </section>
      )
    }

    /**
     * 逻辑下拉框
     */
    function LogicalSelect(item: IEditItem) {
      const { uid, level, value } = item
      const selectChange = (e: any) => {
        licenceData.value.filter((_item) => (_item.uid === uid ? (_item.value = e.target.value) : ''))
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
      for (const { uid, level, type } of licenceData.value) {
        if (uid === item.uid) {
          flag = true
          colorArr.push(uid)
        } else if (flag) {
          colorArr.push(uid)
          if (level === item.level && type === TypeValue.closeBracket) {
            flag = false
          }
        }
      }
      selectGroup.value.toString() === colorArr.toString() ? (selectGroup.value = []) : (selectGroup.value = colorArr)
    }

    /**
     * 添加许可证
     * 1.选中添加 选中的区间数组倒数第二位添加的逻辑和许可证
     * 2.不选中添加
     *    2.1 licenceData.value.length > 0 出一对括号包住 licenceData.value数组头部添加开括号 尾部闭括号 倒数第二位添加逻辑元素符号和许可证
     *    2.2 licenceData.value.length === 0 数组长度是0的时候 添加一个许可证
     */
    function hanldeClickAddLicence() {
      const arr = licenceData.value
      let sgArr = selectGroup.value
      if (sgArr.length !== 0) {
        /**1 */
        //1-1. 获取selectGroup的最后一个uid
        const lastSgUid = sgArr[sgArr.length - 1]

        //1-2. 根据lastUid找到它在licenceData的元素和索引位置
        let lastSgIndex = arr.findIndex((item) => item.uid === lastSgUid),
          lastSgItem = arr[lastSgIndex]

        //1-3. licenceData的lastSgIndex位置添加逻辑和许可证
        if (!lastSgItem || lastSgIndex === 0) return
        let uid1 = setUid(),
          uid2 = setUid()
        arr.splice(
          lastSgIndex,
          0,
          { type: TypeValue.logical, value: 'and', level: lastSgItem.level + 1, uid: uid1 },
          { type: TypeValue.licence, value: '', level: lastSgItem.level + 1, uid: uid2 }
        )

        //1-4 添加的逻辑和许可证也需要选中
        sgArr.splice(sgArr.length - 1, 0, uid1, uid2)
      } else {
        /**(2,3) 不选中组添加 */
        //2

        if (arr.length > 0) {
          //2-1.等级全部+1
          arr.map((item) => (item.level += 1))

          //2-2.数组头部添加开括号
          arr.splice(0, 0, { type: TypeValue.openBracket, value: '(', level: 0, uid: setUid() })

          //2-3.数组尾部添加闭括号
          arr.push({ type: TypeValue.closeBracket, value: ')', level: 0, uid: setUid() })

          //2-4.数组倒数第二位添加逻辑和许可证
          arr.splice(
            arr.length - 1,
            0,
            { type: TypeValue.logical, value: 'and', level: 1, uid: setUid() },
            { type: TypeValue.licence, value: '', level: 1, uid: setUid() }
          )
        } else {
          //2.2
          licenceData.value = [{ type: TypeValue.licence, value: '', level: 0, uid: setUid() }]
        }
      }
    }

    /**
     * 删除许可证
     */
    function hanldeClickDeleteLicence(licenceItem: IEditItem) {
      const { level, uid } = licenceItem
      //1.level === 0
      if (level === 0) return (licenceData.value = [])

      //2.该许可证的兄弟(开括号和许可证类型)是否只有一个
      let arr = licenceData.value
      const licenceItemIndex = arr.findIndex((item) => item.uid === uid),
        fatherOpenBracketIndex = getFatherOpenBracketIndex(licenceItemIndex),
        fatherCloseBracketIndex = getFatherCloseBracketIndex(licenceItemIndex)

      /**
       * sameLevelItemArr 兄弟item的数组
       * sameLevel  用来判断是否和删除许可证一个等级
       */
      let sameLevelItemArr = [],
        sameLevel = licenceItem.level

      for (let index = fatherOpenBracketIndex; index <= fatherCloseBracketIndex; index++) {
        const item = arr[index]
        sameLevelItemArr.push(item)
      }

      const sameLevelNotSelfArr = sameLevelItemArr.filter((item) => item.level >= sameLevel && item.uid !== uid)
      let sameLevelItemNum = sameLevelItemArr.reduce(
          (value, item) => (item.type === TypeValue.logical && item.level === sameLevel ? ++value : value),
          0
        ),
        sameLevelNotSelfOpenBracketNum = sameLevelNotSelfArr.reduce(
          (value, item) => (item.level === sameLevel && item.type === TypeValue.openBracket ? ++value : value),
          0
        )

      const itemIndex = arr.findIndex((item) => item.uid === licenceItem.uid)
      /**
       * 2.1.  sameLevelItemNum === 1 兄弟只有1个 删除 父级开闭括号 逻辑、和自己。  同时兄弟level - 1
       * 2.2.  (sameLevelItemNum === 2 && sameLevelNotSelfOpenBracketNum === 2 && sameLevel !== 1)
       * 2.1, 2.2 一样的处理逻辑
       */
      if (sameLevelItemNum === 1 || (sameLevelItemNum === 2 && sameLevelNotSelfOpenBracketNum === 2 && sameLevel !== 1)) {
        debugger
        let sameLevelItemArrlogicalItem = sameLevelItemArr.find(({ type, level }) => type === TypeValue.logical && level === sameLevel)
        const sameLevelNotSelfUidArr = sameLevelNotSelfArr.map((item) => item.uid)
        console.log(322)
        licenceData.value = arr
          .filter((item) => item.uid !== uid) //删除选中许可证
          .filter((item) => item.uid !== arr[fatherOpenBracketIndex].uid) //删除选中组的父亲开括号
          .filter((item) => item.uid !== arr[fatherCloseBracketIndex].uid) //删除选中组的父亲闭括号
          .filter((item) => item.uid !== sameLevelItemArrlogicalItem!.uid) //删除选中组的兄弟item的逻辑
          .map((item) => {
            //修改兄弟item的level
            if (sameLevelNotSelfUidArr.includes(item.uid)) item.level--
            return item
          })
      } else {
        //3.
        let delLogicalUid = ''
        arr[itemIndex + 1].type === TypeValue.logical ? (delLogicalUid = arr[itemIndex + 1].uid) : (delLogicalUid = arr[itemIndex - 1].uid)
        licenceData.value = arr.filter((item) => item.uid !== uid && item.uid !== delLogicalUid)
      }

      selectGroup.value = []
    }

    /**
     * 组：除初始组以外，其他组里面至少两对类型
     * 添加组
     * 1.不选中组添加
     * 2.选中组添加
     */
    function handleClickAddGroup() {
      let arr = licenceData.value
      let sgArr = selectGroup.value

      //1.选中组添加 选中的区间数组倒数第二位添加的逻辑和组(licence and licence)
      if (sgArr.length !== 0) {
        const lastSgUid = sgArr[sgArr.length - 1]
        let lastSgIndex = arr.findIndex((item) => item.uid === lastSgUid),
          lastSgItem = arr[lastSgIndex]
        if (!lastSgItem || lastSgIndex === 0) return
        let uid1 = setUid(),
          uid2 = setUid(),
          uid3 = setUid(),
          uid4 = setUid(),
          uid5 = setUid(),
          uid6 = setUid()
        arr.splice(
          lastSgIndex,
          0,
          { type: TypeValue.logical, value: 'and', level: lastSgItem.level + 1, uid: uid1 },
          { type: TypeValue.openBracket, value: '(', level: lastSgItem.level + 1, uid: uid2 },
          { type: TypeValue.licence, value: '', level: lastSgItem.level + 2, uid: uid3 },
          { type: TypeValue.logical, value: 'and', level: lastSgItem.level + 2, uid: uid4 },
          { type: TypeValue.licence, value: '', level: lastSgItem.level + 2, uid: uid5 },
          { type: TypeValue.closeBracket, value: ')', level: lastSgItem.level + 1, uid: uid6 }
        )
        sgArr.splice(sgArr.length - 1, 0, uid1, uid2, uid3, uid4, uid5, uid6)
        return
      }

      /**
       * 2.1 不选中添加  licenceData.value.length > 1 出一对括号包住
       * licenceData.value数组头部添加开括号 尾部闭括号 ，
       *    倒数第二位添加逻辑元素符号和组(licence and licence)
       */
      if (licenceData.value.length < 2) return
      arr.map((item) => (item.level += 1))

      //2-2.数组头部添加开括号
      arr.splice(0, 0, { type: TypeValue.openBracket, value: '(', level: 0, uid: setUid() })

      //2-3.数组尾部添加闭括号
      arr.push({ type: TypeValue.closeBracket, value: ')', level: 0, uid: setUid() })

      //2-4.数组倒数第二位添加逻辑和组(licence and licence)
      arr.splice(
        arr.length - 1,
        0,
        { type: TypeValue.logical, value: 'and', level: 1, uid: setUid() },
        { type: TypeValue.openBracket, value: '(', level: 1, uid: setUid() },
        { type: TypeValue.licence, value: '', level: 2, uid: setUid() },
        { type: TypeValue.logical, value: 'and', level: 2, uid: setUid() },
        { type: TypeValue.licence, value: '', level: 2, uid: setUid() },
        { type: TypeValue.closeBracket, value: ')', level: 1, uid: setUid() }
      )
    }

    /**
     * 删除选定组
     * 1.该组是不是level === 0 的组
     * 2.该组的兄弟(开括号和许可证类型)是否只有1个
     *   2.1兄弟只有1个 删除 组的括号
     *   2.2兄弟大于1个
     *      2.2.1 选中的是最后一个 删上面的逻辑
     *      2.2.2 选中的非最后一个 删下面的逻辑
     */
    function handleClicRemoveGroup() {
      let arr = licenceData.value
      let sgArr = selectGroup.value

      /**1 level === 0 */
      if (sgArr[0] === arr[0].uid) {
        licenceData.value = []
        selectGroup.value = []
        return
      }

      /**2  该组的兄弟(开括号和许可证类型)是否只有1个*/
      const fristSgIndex = arr.findIndex((item) => item.uid === sgArr[0]),
        fristSgItem = arr[fristSgIndex],
        lastSgIndex = arr.findIndex((item) => item.uid === sgArr[sgArr.length - 1]),
        lastSgItem = arr[lastSgIndex]

      //获取选中组的父级组的开闭括号的index
      let fatherOpenBracketIndex = getFatherOpenBracketIndex(fristSgIndex),
        fatherCloseBracketIndex = getFatherCloseBracketIndex(lastSgIndex)
      /**
       * sameLevelItemArr 兄弟item的数组
       * sameLevel  判断是否和选中组一个等级
       */
      let sameLevelItemArr = [],
        sameLevel = fristSgItem.level

      for (let index = fatherOpenBracketIndex; index <= fatherCloseBracketIndex; index++) {
        const item = arr[index]
        if (item.level === sameLevel && item.uid !== fristSgItem.uid && item.uid !== lastSgItem.uid) sameLevelItemArr.push(item)
      }

      let sameLevelItemNum = sameLevelItemArr.reduce((value, item) => (item.type === TypeValue.logical ? ++value : value), 0)

      /**
       * 2.1
       *  改组的同级兄弟item数量 根据logical数量判断
       */

      if (sameLevelItemNum === 1) {
        if (sameLevelItemArr.length < 1) return

        let sameLevelItemArrlogicalItem = sameLevelItemArr.find(({ type }) => type === TypeValue.logical)
        let sameLevelItemArrLicenceItem = sameLevelItemArr.find(({ type }) => type === TypeValue.licence)
        let sameLevelItemOpenBracketItem = sameLevelItemArr.find(({ type }) => type === TypeValue.openBracket)
        let sameLevelItemCloseBracketItem = sameLevelItemArr.find(({ type }) => type === TypeValue.closeBracket)

        // 2.1.1 兄弟是许可证
        if (sameLevelItemArrLicenceItem && !sameLevelItemOpenBracketItem) {
          licenceData.value.map((item) => {
            //修改选中组的兄弟item的许可证的level
            if (item.uid === sameLevelItemArrLicenceItem!.uid) item.level--
            return item
          })

          licenceData.value = arr
            .filter((item) => !sgArr.includes(item.uid)) //删除选中item
            .filter((item) => item.uid !== arr[fatherOpenBracketIndex].uid) //删除选中组的父亲开括号
            .filter((item) => item.uid !== arr[fatherCloseBracketIndex].uid) //删除选中组的父亲闭括号
            .filter((item) => item.uid !== sameLevelItemArrlogicalItem!.uid) //删除选中组的兄弟item的逻辑
        }

        //2.1.2 兄弟是组 里面的元素都level--

        //坑
        if (!sameLevelItemArrLicenceItem && sameLevelItemOpenBracketItem) {
          const openIndex = arr.findIndex((item) => item.uid === sameLevelItemOpenBracketItem?.uid),
            closeIndex = arr.findIndex((item) => item.uid === sameLevelItemCloseBracketItem?.uid)
          for (let index = openIndex + 1; index < closeIndex; index++) {
            licenceData.value[index].level = licenceData.value[index].level - 1
          }

          licenceData.value = arr
            .filter((item) => !sgArr.includes(item.uid)) //删除选中item
            .filter((item) => item.uid !== arr[openIndex].uid) //删除选中组的开括号
            .filter((item) => item.uid !== arr[closeIndex].uid) //删除选中组的闭括号
            .filter((item) => item.uid !== sameLevelItemArrlogicalItem!.uid) //删除选中组的兄弟item的逻辑
        }
      } else {
        /**
         * 2.2
         * 兄弟大于1个
         * 根据选中组的最后一个item的nextItem是否为logical类型
         * 如果是 说明不是最后的组 则删除下面的逻辑item ，
         *     如果不是 则删除选择组的上一个逻辑item
         * 2.2.1 选中的组不是父组中最后的组
         * 2.2.2 选中的组是父组中最后的组
         */
        const sgLastNextItem = arr[lastSgIndex + 1],
          sgFristPrevItem = arr[fristSgIndex - 1]
        let delLogicalUid = ''
        sgLastNextItem.type === TypeValue.logical ? (delLogicalUid = sgLastNextItem.uid) : (delLogicalUid = sgFristPrevItem.uid)
        licenceData.value = arr.filter((item) => !sgArr.includes(item.uid) && item.uid !== delLogicalUid)
      }

      selectGroup.value = []
    }

    /** 寻找选中组的父级开括号 */
    function getFatherOpenBracketIndex(fristSgIndex: number): number {
      const fristSgItem = licenceData.value[fristSgIndex]
      const fatherLevel = fristSgItem.level - 1
      let index = fristSgIndex - 1
      for (index; index >= 0; index--) {
        const item = licenceData.value[index]
        if (item.level === fatherLevel && item.type === TypeValue.openBracket) break
      }
      return index
    }

    /** 寻找选中组的父级闭括号 */
    function getFatherCloseBracketIndex(lastSgIndex: number): number {
      const lastSgItem = licenceData.value[lastSgIndex]
      const fatherLevel = lastSgItem.level - 1,
        arr = licenceData.value
      let index = lastSgIndex + 1
      for (index; index < arr.length; index++) {
        const item = arr[index]
        if (item.level === fatherLevel && item.type === TypeValue.closeBracket) break
      }
      return index
    }

    return () => (
      <main>
        <h1>JSON</h1>
        <section>{JSON.stringify(licenceData.value)}</section>
        <hr />
        <h1>expression</h1>
        <section>{licenceData.value.map((item) => item.value + ' ').reduce((total, currentValue) => total + currentValue, '')}</section>
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
                  <a-button onClick={hanldeClickAddLicence}>添加许可证</a-button>
                  {licenceData.value.length <= 1 ? '' : <a-button onClick={handleClickAddGroup}>添加组</a-button>}
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
            {licenceData.value.map((item) => {
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
                case 'licence':
                  dom = LicenceSelect(item)
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
