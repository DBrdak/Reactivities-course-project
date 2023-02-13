import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, GridColumn } from 'semantic-ui-react'
import LoadingComponent from '../../App/layout/LoadingComponent'
import { useStore } from '../../App/stores/store'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

function ProfilePage() {
  const {username} = useParams<{username: string}>()
  const {profileStore} = useStore()
  const {loadProfile, loadingProfile, profile, setActiveTab} = profileStore

  useEffect(() => {
    if(username) loadProfile(username)
    return () => {
      setActiveTab(0)
    }
  }, [loadProfile, username])
  
  if(loadingProfile) return <LoadingComponent content='Loading profile...' />

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && 
        <ProfileHeader profile={profile} />}
        {profile &&
        <ProfileContent profile={profile} />}
      </Grid.Column>
    </Grid>
  )
}

export default observer(ProfilePage)