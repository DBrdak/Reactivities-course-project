import { Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../../App/stores/store'
import * as Yup from 'yup'
import MyTextInput from '../../App/common/form/MyTextInput'
import { Button } from 'semantic-ui-react'
import MyTextArea from '../activities/form/MyTextArea'

interface Props {
  setEditMode: (editMode: boolean) => void
}

function ProfileEditForm({setEditMode}: Props) {
  const {profileStore: {updateProfile, profile}} = useStore()
  
  return (
    <Formik
      initialValues={{displayName: profile?.displayName, bio: profile?.bio}}
      onSubmit={values => {
        updateProfile(values).then(() => {
          setEditMode(false)
        })
      }}
      validationSchema={Yup.object({displayName: Yup.string().required()})}
    >
      {({isSubmitting, isValid, dirty}) => (
        <Form className='ui form'>
          <MyTextInput placeholder='Display Name' name='displayName' />
          <MyTextArea rows={3} placeholder='Add your bio' name='bio' />
          <Button 
            positive
            type='submit'
            loading={isSubmitting}
            content='Update profile'
            floated='right'
            disabled={!isValid || !dirty}
          />
        </Form>
      )}

    </Formik>
  )
}

export default observer(ProfileEditForm)