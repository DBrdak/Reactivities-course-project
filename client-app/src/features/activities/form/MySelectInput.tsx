import { Form, Label, Select } from 'semantic-ui-react';
import { useField } from 'formik';

interface Props {
  placeholder: string,
  name: string,
  options: any;
  label?: string,
}

function MySelectInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);
  
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select 
        clearable
        value={field.value || null}
        options={props.options}    
        onChange={(event, data) => helpers.setValue(data.value)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={props.placeholder}
      />
      {meta.touched && meta.error ? (
        <Label basic color='red'>{meta.error}</Label>
      ) : null}
    </Form.Field>
  )
}

export default MySelectInput