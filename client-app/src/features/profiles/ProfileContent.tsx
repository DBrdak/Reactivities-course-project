import { observer } from "mobx-react-lite";
import React from "react";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../App/models/profile";
import ProfileStore from "../../App/stores/profileStore";
import { useStore } from "../../App/stores/store";
import ProfileEvents from "./Events/ProfileEvents";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowing from "./ProfileFollowing";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
  profile: Profile
}

function ProfileContent({profile}:Props) {
  const {profileStore} = useStore()
  
  const panes = [
    {menuItem: 'About', render: () => <ProfileAbout />},
    {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
    {menuItem: 'Events', render: () => <ProfileEvents profile={profile} />},
    {menuItem: 'Followers', render: () => <ProfileFollowing />},
    {menuItem: 'Following', render: () => <ProfileFollowing />},
  ]

  return (
    <Tab 
      menu={{fluid: true, vertical: true}}
      menuPosition='right'
      panes={panes}
      onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
    />
  )
}

export default observer(ProfileContent)