import { defineComponent, ref } from 'vue'

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

export default defineComponent({
  setup() {
    // ((MIT and (BSD or gpl)) or (Apache 2.0 or GNU) or EPL))
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

    return () => (
      <>
        <header>
          <button>编辑</button>
          <button>保存</button>
        </header>
        <main>
          <h3>json</h3>
          <section>{JSON.stringify(licenseData.value)}</section>

          <h3>content</h3>
          <section>{transitionLicenseArr(licenseData.value)}</section>
        </main>
      </>
    )
  }
})
