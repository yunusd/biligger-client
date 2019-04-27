import React from 'react';
import { Grid } from 'semantic-ui-react';
import { User } from './User';


const Profile = (props) => {
  return (
    <Grid columns={2} centered>
      <Grid.Column width={12}>
        <User {...props} />
      </Grid.Column>
    </Grid>
  );
};

export default Profile;
