import React from 'react'
import { Form, Label } from 'semantic-ui-react';
import { useField, FormikProps, Formik } from 'formik';

interface Props {
  placeholder: string,
  name: string,
  rows: number;
  label?: string,
}

function MyTextArea(props: Props) {
  const [field, meta] = useField(props.name);
  
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <textarea {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color='red'>{meta.error}</Label>
      ) : null}
    </Form.Field>
  )
}

export default MyTextArea