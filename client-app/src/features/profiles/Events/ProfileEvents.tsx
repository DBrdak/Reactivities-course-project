import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useEffect } from 'react'
import { SyntheticEventData } from 'react-dom/test-utils'
import { CardGroup, Grid, Header, Tab, TabProps } from 'semantic-ui-react'
import { UserActivity } from '../../../App/models/activity'
import { Profile } from '../../../App/models/profile'
import { useStore } from '../../../App/stores/store'
import UserActivityCard from './UserActivityCard'

interface Props {
  profile: Profile
}

function ProfileEvents({profile}:Props) {
  const {profileStore: {loadEvents, loadingEvents, userActivities}} = useStore()
  
  useEffect(() => {
    loadEvents(panes[0].pane.key ,profile!.username);
    }, [loadEvents, profile]);

  const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } },
  ]

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadEvents(panes[data.activeIndex as number].pane.key,profile!.username)
  }

  return (
    <Tab.Pane loading={loadingEvents}>
      <Grid>
        <Grid.Column width={16}>
          <Header icon={'calendar'} content='Activities'/>
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab 
            panes={panes}
            menu={{secondary: true, pointing: true}}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <CardGroup itemsPerRow={4}>
            {userActivities.map((activity: UserActivity) => (
              <UserActivityCard key={activity.id} activity={activity} />
            ))}
          </CardGroup>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}
export default observer(ProfileEvents)