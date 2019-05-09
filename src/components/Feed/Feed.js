import React from 'react';

import { Grid } from 'semantic-ui-react';
import { List, LatestList } from './Post';

const Feed = ({ location }) => (
  <Grid>
    <Grid.Row columns={1} centered>
      <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
        { location.pathname !== '/yeni' ? <List /> : <LatestList /> }
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default Feed;
