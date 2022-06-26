import { defineComponent, ref } from 'vue'
import './index.less'
type TLogical = 'or' | 'and' | ''

type TTypeGroup = 'group'
type TTypeLicense = 'license'

type TLicense = {
  logical: TLogical
  type: TTypeLicense
  license: string
}

type TGroup = {
  logical: TLogical
  type: TTypeGroup
  group: TGroup[] | TLicense[]
}

type TLicenseObject = {
  logical: TLogical
  type: TTypeGroup | TTypeLicense
  license?: string
  group?: TLicenseObject[]
}

type TState = 'view' | 'edit'

function LicenseSelect() {
  const selectChange = (e: Event) => {
    //  console.log(e.target.value)
  }
  return (
    <section>
      <select onChange={(e) => selectChange(e)}>
        <option value="BSD">BSD</option>
        <option value="Apache-2.0">Apache-2.0</option>
        <option value="MIT">MIT</option>
        <option value="EPL">EPL</option>
        <option value="GNU">GNU</option>
        <option value="gpl">gpl</option>
      </select>
    </section>
  )
}

function LogicalSelect() {
  return (
    <section>
      <select>
        <option value="and">and</option>
        <option value="or">or</option>
        <option value="" selected>
          none{' '}
        </option>
      </select>
    </section>
  )
}

export default defineComponent({
  setup() {
    const pageState = ref<TState>('view')
    const licenseData = ref<TLicenseObject[]>([
      {
        logical: 'or',
        type: 'license',
        license: 'EPL'
      },
      {
        logical: 'or',
        type: 'group',
        group: [
          {
            logical: 'and',
            type: 'license',
            license: 'MIT'
          },
          {
            logical: '',
            type: 'group',
            group: [
              {
                logical: 'or',
                type: 'license',
                license: 'BSD'
              },
              {
                logical: 'or',
                type: 'license',
                license: 'gpl'
              },
              {
                logical: '',
                type: 'group',
                group: [
                  {
                    logical: 'or',
                    type: 'license',
                    license: 'Apache-2.0'
                  },
                  {
                    logical: '',
                    type: 'license',
                    license: 'GNU'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        logical: '',
        type: 'group',
        group: [
          {
            logical: 'or',
            type: 'license',
            license: 'Apache-2.0'
          },
          {
            logical: '',
            type: 'license',
            license: 'GNU'
          }
        ]
      }
    ])

    function transitionLicenseArr(dataArr: TLicenseObject[] | TLicenseObject) {
      let str = ''
      showLicenseArr(dataArr)
      function showLicenseArr(data: TLicenseObject[] | TLicenseObject) {
        if (Array.isArray(data)) {
          str += '('
          for (const item of data) {
            showLicenseArr(item)
          }
        } else {
          const { type, logical } = data
          if (type === 'group' && data.group) {
            str += ' ('
            for (const item of data.group) {
              showLicenseArr(item)
            }
            str += `${logical}`
            if (logical === '') {
              str += ') '
            }
          } else if (type === 'license') {
            str += ` ${data.license} `
            if (logical === '') {
              str += ') '
            } else {
              str += `${logical}`
            }
          }
        }
      }

      return str
    }

    function transitionEditZone(dataArr: TLicenseObject[] | TLicenseObject) {
      // function showEditZone(data: TLicenseObject[] | TLicenseObject){
      //   if (Array.isArray(data)) {
      //     return
      //     for (const item of data) {
      //       showLicenseArr(item)
      //     }
      //   } else {
      //     const { type, logical } = data
      //     if (type === 'group' && data.group) {
      //       str += ' ('
      //       for (const item of data.group) {
      //         showLicenseArr(item)
      //       }
      //       str += `${logical}`
      //       if (logical === '') {
      //         str += ') '
      //       }
      //     } else if (type === 'license') {
      //       str += ` ${data.license} `
      //       if (logical === '') {
      //         str += ') '
      //       } else {
      //         str += `${logical}`
      //       }
      //     }
      //   }
      // }
    }

    /**
     * 开始括号 openBracket
     * 逻辑符号 logical
     * 许可证 license
     * 闭括号 closeBracket
     */

    function hanldeClickSave() {
      pageState.value = 'view'
    }

    function hanldeClickEdit() {
      pageState.value = 'edit'
    }

    return () => (
      <>
        <header>
          {pageState.value === 'edit' ? <button onClick={hanldeClickSave}>保存</button> : <button onClick={hanldeClickEdit}>编辑</button>}
        </header>
        <main>
          <h3>json</h3>
          <section>{JSON.stringify(licenseData.value)}</section>
          <h3>content</h3>
          <section>{transitionLicenseArr(licenseData.value)}</section>

          <section class="zone">
            <h3>edit zone</h3>
            <div class="edit-zone">
              <section class="bracket open">(</section>
              <LicenseSelect />
              <LogicalSelect />
              <section class="bracket open">(</section>
              <LicenseSelect />
              <LogicalSelect />
              <section class="bracket open">(</section>
              <LicenseSelect />
              <LogicalSelect />
              <LicenseSelect />
              <LogicalSelect />
              <section class="bracket open">(</section>
              <LicenseSelect />
              <LogicalSelect />
              <LicenseSelect />
              <section class="bracket close">)</section>
              <section class="bracket close">)</section>
              <section class="bracket close">)</section>
              <LogicalSelect />
              <section class="bracket open">(</section>
              <LicenseSelect />
              <LogicalSelect />
              <LicenseSelect />
              <section class="bracket close">)</section>
              <section class="bracket close">)</section>
            </div>
          </section>
        </main>
      </>
    )
  }
})
