export default {
  initializing: true,
  schemaFilterOn: true,
  policies: [],
  functionPolicies: [],
  defaultPolicy: null,
  defaultFunctionPolicy: null,
  managedSchemata: [],
  parkedSchemata: [],
  rawSchemata: [],
  schemaFilter: [],
  projectRoles: [],
  selectedRoleFamilies: [],
  defaultRlsUsing: '( owner_id = viewer_id() )',
  // defaultRlsUsing: '(auth_fn.app_user_has_access(app_tenant_id) = true)',
  defaultRlsWithCheck: '',
  defaultRlsQualifiers: {
    all: {
      policies: []
    },
    select: {
      policies: []
    },
    insert: {
      policies: []
    },
    update: {
      policies: []
    },
    delete: {
      policies: []
    }
  },
  defaultRoleGrants: {
    all: 'DENIED',
    select: 'DENIED',
    insert: 'DENIED',
    update: 'DENIED',
    delete: 'DENIED',
  },
  tablePolicyTemplate: `
  --=================== BEGIN: {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} ===================
    -------------------------------------------------------- REMOVE EXISTING TABLE GRANTS ----------------------
  
    revoke all privileges on table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} from public;
  {{#revokeRoles}}
    revoke all privileges on table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} from {{roleName}};
  {{/revokeRoles}}
  
  -------------------------------------------------------- CREATE NEW TABLE GRANTS ----------------------
  {{#allowedRoleGrants}}
    -------------------------------------------------------- {{roleName}}
    {{#grants}}
    grant {{action}} on table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} ro {{roleName}};
    {{/grants}}
  {{/allowedRoleGrants}}
  
  
  {{#verbose}}
  -------------------------------------------------------- IMPLIED TABLE GRANTS ----------------------
    {{#impliedRoleGrants}}
    -------------------------------------------------------- {{roleName}}
    {{#grants}}
    --IMPLIED:   grant {{action}} on table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} ro {{roleName}};
    {{/grants}}
    {{/impliedRoleGrants}}
  
  
  -------------------------------------------------------- DENIED TABLE GRANTS ----------------------
    {{#deniedRoleGrants}}
    -------------------------------------------------------- {{roleName}}
    {{#grants}}
    --DENIED:   grant {{action}} on table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} ro {{roleName}};
    {{/grants}}
    {{/deniedRoleGrants}}
  {{/verbose}}
  
  {{#enableRls}}
    -------------- ENABLE ROW LEVEL SECURITY ----------------------
  
    alter table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} enable row level security;
  
  {{#rlsPolicies}}
    create policy {{name}}_{{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}_{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} 
      on {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}}
      as {{passStrategy}}
      for {{action}}
      to {{roleName}}
      using {{{using}}}
      {{#withCheck}}
      with check {{withCheck}}
      {{/withCheck}}
      ;
  {{/rlsPolicies}}
  
  {{/enableRls}}
  {{^enableRls}}
    -------------- DISABLE ROW LEVEL SECURITY ----------------------
  
    alter table {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} disable row level security;
  {{/enableRls}}
  
  
  --===================== END: {{schemaName}}{{^schemaName}}{{=<% %>=}}{{schemaName}}<%={{ }}=%>{{/schemaName}}.{{tableName}}{{^tableName}}{{=<% %>=}}{{tableName}}<%={{ }}=%>{{/tableName}} ===================
  `,
  functionPolicyHeaderTemplate: `
  --=================== BEGIN: {{schemaName}}.{{functionName}}  ===================
  
  `,
  functionPolicyFooterTemplate: `

  --=================== END: {{schemaName}}.{{functionName}}  ===================`,
  defaultFunctionRoleGrants: {
    execute: 'DENIED'
  }
}