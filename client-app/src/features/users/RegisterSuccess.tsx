import React from 'react'
import useQuery from '../../App/util/hooks'
import agent from '../../App/api/agent'
import { toast } from 'react-toastify'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

function RegisterSuccess() {
  const email = useQuery().get('email') as string

  function handleConfirmEmailResend(){
    agent.Account.resendEmailConfirmation(email).then(() => {
      toast.success('Verification email resent - please check your email')
    }).catch(error => console.log(error))
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon color='green'>
        <Icon name='check'/>
        Successfully registered!
      </Header>
      <p>Please check you email (including junk email) for the verification email</p>
      {email &&
        <>
          <p>Didn't revice the email? Click the below button to resend</p>
          <Button primary onClick={handleConfirmEmailResend} 
          content='Resend Email' size='huge' />
        </>
      }
    </Segment>
  )
}

export default RegisterSuccess