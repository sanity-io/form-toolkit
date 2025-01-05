import {useForm, createForm, zodValidator} from '@tanstack/react-form'
import {z} from 'zod'
import {FormRenderer} from '../form-renderer'
import type {FormDataProps} from '../types'

interface TanStackFormExampleProps {
  formData: FormDataProps
  onSubmit?: (values: Record<string, any>) => void
}

export const TanStackFormExample: FC<TanStackFormExampleProps> = ({
  formData,
  onSubmit = console.log,
}) => {
  const createSchema = () => {
    const schemaFields: Record<string, z.ZodType> = {}

    formData.sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        let schema = z.string()

        if (field.required) {
          schema = schema.min(1, 'This field is required')
        }

        field.validation?.forEach((rule) => {
          switch (rule.type) {
            case 'minLength':
              schema = schema.min(Number(rule.value), rule.message)
              break
            case 'maxLength':
              schema = schema.max(Number(rule.value), rule.message)
              break
            case 'pattern':
              schema = schema.regex(new RegExp(rule.value), rule.message)
              break
          }
        })

        schemaFields[field.name] = schema
      })
    })

    return z.object(schemaFields)
  }

  const form = createForm({
    defaultValues: formData.sections?.reduce(
      (acc, section) => {
        section.fields?.forEach((field) => {
          acc[field.name] = field.options?.defaultValue ?? ''
        })
        return acc
      },
      {} as Record<string, string>,
    ),
    onSubmit: async (values) => {
      onSubmit?.(values)
    },
    validatorAdapter: zodValidator,
    validator: createSchema(),
  })

  const state = useForm(form)

  const getFieldState = (fieldName: string) => {
    const field = state.getFieldMeta(fieldName)
    const fieldApi = state.getFieldAPI(fieldName)

    return {
      value: field.value,
      onChange: (value: any) => fieldApi.setValue(value),
      onBlur: () => fieldApi.setTouched(true),
    }
  }

  const getFieldError = (fieldName: string) => {
    const field = state.getFieldMeta(fieldName)
    return field.errors?.[0]
  }

  const getFieldValue = (fieldName: string) => {
    return state.getFieldMeta(fieldName).value
  }

  return (
    <FormRenderer
      formData={formData}
      onSubmit={state.handleSubmit}
      getFieldState={getFieldState}
      getFieldError={getFieldError}
      getFieldValue={getFieldValue}
    />
  )
}
