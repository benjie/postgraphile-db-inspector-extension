<template>
  <v-data-table
    :headers="headers"
    :items="grantMatrix"
    hide-default-footer
    item-key="id"
    class="text-sm-left"
    dense
  >
    <template v-slot:item.select="{ item }">
      <v-checkbox 
        :input-value="roleGrantSelected(item, 'select')" 
        @click="toggleRoleGrant(item.roleName, 'select')"
        :disabled="roleGrantDisabled(item, 'select')"
        dense
      ></v-checkbox>
    </template>

    <template v-slot:item.insert="{ item }">
      <v-checkbox 
        :input-value="roleGrantSelected(item, 'insert')" 
        @click="toggleRoleGrant(item.roleName, 'insert')"
        :disabled="roleGrantDisabled(item, 'insert')"
        dense
      ></v-checkbox>
    </template>

    <template v-slot:item.update="{ item }">
      <v-checkbox 
        :input-value="roleGrantSelected(item, 'update')" 
        @click="toggleRoleGrant(item.roleName, 'update')"
        :disabled="roleGrantDisabled(item, 'update')"
        dense
      ></v-checkbox>
    </template>

    <template v-slot:item.delete="{ item }">
      <v-checkbox 
        :input-value="roleGrantSelected(item, 'delete')" 
        @click="toggleRoleGrant(item.roleName, 'delete')"
        :disabled="roleGrantDisabled(item, 'delete')"
        dense
      ></v-checkbox>
    </template>
  </v-data-table>
</template>

<script>
  const ALLOWED = 'ALLOWED'
  const DENIED = 'DENIED'
  const IMPLIED = 'IMPLIED'

  export default {
    name: 'PolicyDefinitionGrantGrid',
    props: {
      policyDefinition: {
        type: Object,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        policyStructure: [],
        calculatedPolicy: 'NOT CALCULATED',
        toggleCompleted: false
      }
    },
    watch: {
    },
    methods: {
      roleGrantSelected(roleGrant, action) {
        return [ALLOWED, IMPLIED].indexOf(roleGrant[action]) > -1
      },
      roleGrantDisabled(roleGrant, action) {
        return (roleGrant[action] === IMPLIED) || this.disabled
      },
      toggleRoleGrant(toggledRoleName, action) {
        if (this.toggleCompleted === true) {
          this.toggleCompleted = false
          return
        }
        const currentValue = this.policyDefinition.roleGrants[toggledRoleName][action]

        const impliedRoleNames = this.dbUserRoles.filter(
          pr => {
            return (pr.applicableRoles || []).find(ar => ar.roleName === toggledRoleName) !== undefined
          }
        ).reduce((a,r)=>{ return a.concat(r.roleName)}, [])

        const newPolicy = {
          ...this.policyDefinition,
          roleGrants: Object.keys(this.policyDefinition.roleGrants).reduce(
            (newGrants, newRoleName) => {
              const toggledRoleIsApplicableToNew = impliedRoleNames.indexOf(newRoleName) > -1
              const newRoleIsToggledRole = newRoleName === toggledRoleName

              return {
                ...newGrants,
                [newRoleName]: Object.keys(this.policyDefinition.roleGrants[newRoleName]).reduce(
                  (newRow, newAction) => {
                    let newValue
                    if (newAction === action) {
                      if (newRoleIsToggledRole) {
                        newValue = currentValue === ALLOWED ? DENIED : ALLOWED
                      } else if (toggledRoleIsApplicableToNew) {
                        newValue = currentValue === ALLOWED ? DENIED : IMPLIED
                      } else {
                        newValue = this.policyDefinition.roleGrants[newRoleName][newAction]
                      }
                    } else {
                      if (newAction == 'all') {
                        if ((toggledRoleIsApplicableToNew || newRoleIsToggledRole) && currentValue === ALLOWED) {
                          newValue = DENIED
                        } else {
                          newValue = this.policyDefinition.roleGrants[newRoleName][newAction]
                        }
                      } else {
                        newValue = this.policyDefinition.roleGrants[newRoleName][newAction]
                      }
                    }

                    return {
                      ...newRow,
                      [newAction]: newValue
                    }
                  }, {}
                )
              }
            }, {}
          )
        }

        this.$store.commit('savePolicy', {
            policy: newPolicy
          }
        )
        this.toggleCompleted = true
      },
    },
    computed: {
      dbUserRoles () {
        return this.$store.state.roleSet.dbUserRoles
      },
      grantMatrix () {
        return Object.keys(this.policyDefinition.roleGrants).map(
          roleName => {
            return {
              ...this.policyDefinition.roleGrants[roleName]
              ,roleName: roleName
            }
          }
        )
      },
      headers () {
        return [
          {
            text: 'Role Name',
            sortable: false,
            value: 'roleName'
          },
          {
            text: 'SELECT',
            sortable: false,
            value: 'select'
          },
          {
            text: 'INSERT',
            sortable: false,
            value: 'insert'
          },
          {
            text: 'UPDATE',
            sortable: false,
            value: 'update'
          },
          {
            text: 'DELETE',
            sortable: false,
            value: 'delete'
          }
        ]
      },
    },
  }
</script>