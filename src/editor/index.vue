<script setup lang="ts">
import { ref } from 'vue'

type TLogical = 'or' | 'and' | ''

type TTypeGroup = 'group'
type TTypeLicense = 'license'

// type Test<>

// type TLicense = {
//   logical: TLogical
//   type: TTypeLicense
//   license: string
// }

// type TGroup = {
//   logical: TLogical
//   type: TTypeGroup
//   group: TGroup[]| TLicense[]
// }

type TLicenseObject = {
  logical: TLogical
  type: TTypeGroup | TTypeLicense
  license?: string
  group?: TLicenseObject[]
}

const licenseData = ref<TLicenseObject[]>([
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
            logical: '',
            type: 'license',
            license: 'gpl'
          }
        ]
      }
    ]
  },
  {
    logical: 'or',
    type: 'group',
    group: [
      {
        logical: 'or',
        type: 'license',
        license: 'BSD'
      },
      {
        logical: '',
        type: 'license',
        license: 'gpl'
      }
    ]
  },
  {
    logical: 'or',
    type: 'license',
    license: 'BSD'
  }
])

function showLicenseArr(data: TLicenseObject[] | TLicenseObject, str: string = '') {
  if (Array.isArray(data)) {
    for (const item of data) {
      showLicenseArr(item, str)
    }
  } else {
    const { type, logical } = data
  }

  str
  //  licenseData.value.
}
</script>

<template>
  <header>
    <button>编辑</button>
    <button>保存</button>
  </header>
  <main>
    <h3>json</h3>
    <section>{{ licenseData }}</section>

    <h3>content</h3>
    <section>{{ showLicenseArr(licenseData) }}</section>
  </main>
</template>

<style lang="less" scoped></style>
