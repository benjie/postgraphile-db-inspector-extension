const { makeExtendSchemaPlugin, gql } = require('graphile-utils');

const DbSchemaPlugin = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      type Function {
        id: String!
        functionName: String!
        functionSchema: String!
        resultDataType: String
        argumentDataTypes: String
        definition: String
      }

      type PgPolicy {
        schemaName: String!
        tableName: String!
        policyName: String!
        roles: [String]!
        cmd: String!
        qual: String!
        withCheck: String
      }

      type PgEnum {
        id: String!
        enumSchema: String!
        enumName: String!
        enumValues: [String]!
      }

      extend type Trigger {
        id: String!
        triggerFunction: Function
      }

      extend type EnabledRole {
        applicableRoles: [ApplicableRole]!
      }

      extend type Schema {
        id: String!
        schemaTables: [Table]!
        schemaFunctions: [Function]!
        schemaEnums: [PgEnum]!
      }

      type Index {
        id: String!
        indexName: String!
        tableSchema: String!
        tableName: String!
        columnName: String!
      }

      extend type Table {
        id: String!
        tableColumns: [Column]!
        indices: [Index]!
        tableConstraints: [ConstraintTableUsage]!
        referentialConstraints: [ReferentialConstraint]!
        checkConstraints: [CheckConstraint]!
        primaryKeyConstraints: [TableConstraint]!
        uniqueConstraints: [TableConstraint]!
        roleTableGrants: [RoleTableGrant]!
        roleColumnGrants: [RoleColumnGrant]!
        policies: [PgPolicy]!
        triggers: [Trigger]!
        psqlDescription: String!
      }

      extend type ReferentialConstraint {
        referencingColumnUsage: [KeyColumnUsage]!
        referencedColumnUsage: [KeyColumnUsage]!
      }

      extend type CheckConstraint {
        tableConstraints: [TableConstraint]!
      }

      extend type TableConstraint {
        keyColumnUsage: [KeyColumnUsage]!
      }

      extend type Query {
        tableById(id: String!): Table
        functionById(id: String!): Function
        dbIntrospection: JSON!
        pgdbiOptions: JSON!
      }

      extend type Mutation {
        searchFunctions(searchTerm: String!): [Function]!
      }
    `,
    resolvers: {
      Schema: {
        id: require('./resolvers/schema/id')(build),
        schemaTables: require('./resolvers/schema/schemaTables')(build),
        schemaFunctions: require('./resolvers/schema/schemaFunctions')(build),
        schemaEnums: require('./resolvers/schema/schemaEnums')(build),
      },
      Table: {
        id: require('./resolvers/table/id')(build),
        tableColumns: require('./resolvers/table/tableColumns')(build),
        indices: require('./resolvers/table/indices')(build),
        tableConstraints: require('./resolvers/table/tableConstraints')(build),
        referentialConstraints: require('./resolvers/table/referentialConstraints')(
          build,
        ),
        checkConstraints: require('./resolvers/table/checkConstraints')(build),
        primaryKeyConstraints: require('./resolvers/table/primaryKeyConstraints')(
          build,
        ),
        uniqueConstraints: require('./resolvers/table/uniqueConstraints')(
          build,
        ),
        roleTableGrants: require('./resolvers/table/roleTableGrants')(build),
        roleColumnGrants: require('./resolvers/table/roleColumnGrants')(build),
        policies: require('./resolvers/table/policies')(build),
        triggers: require('./resolvers/table/triggers')(build),
        psqlDescription: require('./resolvers/table/psqlDescription')(build),
      },
      Trigger: {
        id: require('./resolvers/trigger/id')(build),
        triggerFunction: require('./resolvers/trigger/triggerFunction')(build),
      },
      EnabledRole: {
        applicableRoles: require('./resolvers/enabledRole/applicableRoles')(
          build,
        ),
      },
      ReferentialConstraint: {
        referencingColumnUsage: require('./resolvers/referentialConstraint/referencingColumnUsage')(
          build,
        ),
        referencedColumnUsage: require('./resolvers/referentialConstraint/referencedColumnUsage')(
          build,
        ),
      },
      CheckConstraint: {
        tableConstraints: require('./resolvers/checkConstraint/tableConstraint')(
          build,
        ),
      },
      TableConstraint: {
        keyColumnUsage: require('./resolvers/tableConstraint/keyColumnUsage')(
          build,
        ),
      },
      Query: {
        tableById: require('./resolvers/table/tableById')(build),
        functionById: require('./resolvers/function/functionById')(build),
        dbIntrospection: require('./introspection')(build),
        pgdbiOptions: require('./pgdbiOptions')(build)
      },
      Mutation: {
        searchFunctions: require('./resolvers/function/searchFunctions')(build),
      },
    },
  };
});

module.exports = DbSchemaPlugin;
