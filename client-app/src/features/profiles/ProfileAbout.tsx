import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react'
import { Profile } from '../../App/models/profile'
import { useStore } from '../../App/stores/store'
import ProfileEditForm from './ProfileEditForm'

function ProfileAbout() {
  const {profileStore: {isCurrentUser, profile}} = useStore()
  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon={'user'} floated='left' content={`About ${profile?.displayName}`} />
          {isCurrentUser && 
          <Button 
          basic
          floated='right'
          content={editMode ? 'Cancel' : 'Edit Profile'}
          onClick={() => setEditMode(!editMode)}
          />}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? 
            <ProfileEditForm setEditMode={setEditMode} />
            : <span style={{whiteSpace: 'pre-wrap'}}>{profile?.bio}</span>}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default observer(ProfileAbout)