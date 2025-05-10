import {definePlugin, type FieldDefinition} from 'sanity'

// import {structureTool} from 'sanity/structure'
import {FormRenderer} from './components/form-renderer'
import {schema} from './schema-types'
// import {defaultDocumentNode} from './structure'

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {formSchema} from '@sanity/form-toolkit'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [formSchema()],
 * })
 * ```
 */
export type FieldsOption = Array<FieldDefinition>
interface FormSchemaPluginOptions {
  /**
   * Array of field definitions to be used in the form schema.
   */
  fields?: FieldsOption
}
export type {FormDataProps} from './components/types'
export {FormRenderer}
export const formSchema = definePlugin(({fields = []}: FormSchemaPluginOptions) => {
  return {
    name: 'form-toolkit_form-schema',
    schema: schema(fields),
    // plugins: [structureTool({defaultDocumentNode})],
  }
})
