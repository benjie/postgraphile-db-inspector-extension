<template>
  <v-container fluid>
    <v-card
      class="ma-3 pa-3 green darken-3"
      dense
    >            
      <h2>Indexed</h2>
      <hr>
      <v-data-table
        :items="goodIndices"
        :headers="headers"
        class="elevation-1 text-no-wrap"
        hide-default-footer
        show-expand
        calculate-widths
        dense
        :items-per-page="goodIndices.length"
      >
        <template v-slot:item.tableSchema="{ item }">
          {{ item.tableKey.split('.')[0] }}
        </template>

        <template v-slot:item.tableName="{ item }">
          <router-link :to="{ name: 'table', params: { id: item.tableKey }}" target="_blank" v-if="item.tableKey">{{item.tableKey.split('.')[1]}}</router-link>
        </template>

        <template v-slot:item.columnDisplay="{ item }">
          <div v-for="col in item.columnDisplay" :key="col">{{col}}</div>
        </template>

        <template v-slot:item.evaluation="{ item }">
          <span :class="item.indexDisplayClass">{{ item.evaluation }}</span>
        </template>

        <template slot="expanded-item" slot-scope="props">
          <td :colspan="headers.length + 1">
            <generic-index-detail
              :evaluation="props.item"
            ></generic-index-detail>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-card
      class="ma-3 pa-3 red darken-3"
      dense
    >            
      <h2>Over-Indexed</h2>
      <hr>
      <v-data-table
        :items="badIndices"
        :headers="headers"
        class="elevation-1 text-no-wrap"
        hide-default-footer
        show-expand
        calculate-widths
        dense
        :items-per-page="badIndices.length"
      >
        <template v-slot:item.tableSchema="{ item }">
          {{ item.tableKey.split('.')[0] }}
        </template>

        <template v-slot:item.tableName="{ item }">
          <router-link :to="{ name: 'table', params: { id: item.tableKey }}" target="_blank" v-if="item.tableKey">{{item.tableKey.split('.')[1]}}</router-link>
        </template>

        <template v-slot:item.columnDisplay="{ item }">
          <div v-for="col in item.columnDisplay" :key="col">{{col}}</div>
        </template>

        <template v-slot:item.evaluation="{ item }">
          <span :class="item.indexDisplayClass">{{ item.evaluation }}</span>
        </template>

        <template slot="expanded-item" slot-scope="props">
          <td :colspan="headers.length + 1">
            <generic-index-detail
              :evaluation="props.item"
            ></generic-index-detail>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  import ScriptViewer from '@/components/_common/ScriptViewer'
  import GenericIndexDetail from './GenericIndexDetail'
  const MULTIPLE_INDICES = 'MULTIPLE_INDICES'

  export default {
    name: 'GenericIndexSet',
    props: {
      indexEvaluations: {
        type: Array,
        required: true
      }
    },
    components: {
      GenericIndexDetail
    },
    methods: {
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    },
    computed: {
      goodIndices () {
        return this.indexEvaluations.filter(i => i.evaluation !== MULTIPLE_INDICES)
          .map(
            idx => {
              return {
                ...idx,
                columnDisplay: idx.idxColumns.split('+')
              }
            }
          )
      },
      badIndices () {
        return this.indexEvaluations.filter(i => i.evaluation === MULTIPLE_INDICES)
          .map(
            idx => {
              return {
                ...idx,
                columnDisplay: idx.idxColumns.split('+')
              }
            }
          )
      },
    },
    data: () => ({
      selected: [],
      headers: [
        {
          text: 'Schema',
          value: 'tableSchema'
        },
        {
          text: 'Table',
          value: 'tableName'
        },
        {
          text: 'Index Columns',
          value: 'columnDisplay'
        },
        {
          text: 'Evaluation',
          value: 'evaluation'
        }
      ],
      pagination: {
        sortBy: 'constraintName',
        rowsPerPage: -1
      },
    })
  }
</script>

<style>

</style>