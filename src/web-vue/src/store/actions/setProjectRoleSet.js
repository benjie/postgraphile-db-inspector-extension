
async function setProjectRoleSet({commit, dispatch}, roleSet) {
  await dispatch('resetDefaultState')
  await commit('setProjectRoleSet', roleSet)
  await commit('defaultRlsUsing', roleSet.defaultRlsUsing)
  return `role set set - ${roleSet}`
}

export default setProjectRoleSet;
