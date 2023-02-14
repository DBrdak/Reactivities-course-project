import format from 'date-fns/format'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'
import { UserActivity } from '../../../App/models/activity'

interface Props {
  activity: UserActivity
}

function UserActivityCard({activity}: Props) {
  return (
    <>
      <Card as={Link} to={`/activities/${activity.id}`}>
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid />
        <Card.Content>
          <Card.Header textAlign='center' >{activity.title}</Card.Header>
          <Card.Meta textAlign='center'><div>{format(new Date(activity.date!),'do LLL')}</div></Card.Meta>
          <Card.Meta textAlign='center'><div>{format(new Date(activity.date!),'h:mm a')}</div></Card.Meta>
        </Card.Content>
      </Card>
    </>

  )
}

export default observer(UserActivityCard)