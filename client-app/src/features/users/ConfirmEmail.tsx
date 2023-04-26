import React, { useEffect, useState } from 'react'
import { useStore } from '../../App/stores/store'
import useQuery from '../../App/util/hooks'
import agent from '../../App/api/agent'
import { toast } from 'react-toastify'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'
import LoginForm from './LoginForm'

function ConfirmEmail() {
  const {modalStore} = useStore()
  const email = useQuery().get('email') as string
  const token = useQuery().get('token') as string

  const Status = {
    Verifying: 'Verifying',
    Failed: 'Failed',
    Success: 'Success'
  }

  const [status, setStatus] = useState(Status.Verifying)

  function handleConfirmEmailResend(){
    agent.Account.resendEmailConfirmation(email).then(() => {
      toast.success('Verification email resent - please check your email')
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    agent.Account.verifyEmail(token, email)
    .then(() => setStatus(Status.Success))
    .catch(() => setStatus(Status.Failed))
  }, [Status.Failed, Status.Success, token, email])

  function getBody() {
    switch (status){
      case Status.Verifying:
        return <p>Varifying...</p>
      case Status.Failed:
        return (
          <div>
            <p>Verification failed. Try resending verify email</p>
            <Button primary onClick={handleConfirmEmailResend} size='huge' content='Resend email'/>
          </div>
        )
      case Status.Success:
        return (
          <div>
            <p>Email has been verified</p>
            <Button primary onClick={() => modalStore.openModal(<LoginForm />)} size='huge' content='Log In'/>
          </div>
        )
    }
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon>
        <Icon name='envelope' />
        Email verification
      </Header>
      <Segment.Inline>
        {getBody()}
      </Segment.Inline>
    </Segment>
  )
}

export default ConfirmEmail