import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../App/layout/LoadingComponent'
import { useStore } from '../../../App/stores/store'
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../App/common/form/MyTextInput'
import MyTextArea from './MyTextArea'
import MySelectInput from './MySelectInput'
import CategoryOptions from '../../../App/common/options/CategoryOptions'
import MyDateInput from '../../../App/common/form/MyDateInput'
import { Activity } from '../../../App/models/activity'
import {v4 as uuid} from 'uuid';

export default observer (function ActivityForm() { 
  
  const {activityStore} = useStore();
  const {selectedActivity, createActivity, updateActivity, 
    loading, loadActivity, loadingInitial} = activityStore;
  const {id} = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city:'',
    venue: '',
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    category: Yup.string().required(),
    date: Yup.string().required('Date is required').nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  })

  useEffect(() => {
    if(id) loadActivity(id).then(activity => setActivity(activity!));
  }, [id, loadActivity])

  function handleFormSubmit(activity: Activity) {
    if(!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }
  }

  if (loadingInitial) return <LoadingComponent content='Loading activity...' />;
  
  return (
    <Segment clearing>
      <Header content ="Activity Details" sub color='teal' />
        <Formik
        validationSchema={validationSchema}
        enableReinitialize 
        initialValues={activity} 
        onSubmit={values => handleFormSubmit(values)}>
          {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >
            <MyTextInput name='title' placeholder='Title' />
            <MyTextArea placeholder='Description' name='description' rows={3}/>
            <MySelectInput placeholder='Category' name='category' options={CategoryOptions}/>
            <MyDateInput 
              placeholderText='Date'
              name='date' 
              showTimeSelect
              timeCaption='time'
              dateFormat='d MMMM, yyyy hh:mm aa'
            />
            <Header content ="Location Details" sub color='teal' />
            <MyTextInput placeholder='City' name='city'/>
            <MyTextInput placeholder='Venue' name='venue'/>
            <Button 
            loading={loading} 
            floated='right' 
            positive type='submit' 
            content='Submit'
            disabled={isSubmitting || !dirty || !isValid}
            />
            <Button as={Link} to={`/activities/${activity.id}`} floated='right' type='button' content='Cancel'/>
          </Form>
          )}
        </Formik>

    </Segment>
  )
})