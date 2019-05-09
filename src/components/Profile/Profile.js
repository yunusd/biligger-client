import React from 'react';
import { Grid } from 'semantic-ui-react';
import { User } from './User';


const Profile = (props) => {
  return (
    <Grid columns={1} centered>
      <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
        <User {...props} />
      </Grid.Column>
    </Grid>
  );
};

export default Profile;
