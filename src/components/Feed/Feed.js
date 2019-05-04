import React from 'react';

import { Grid } from 'semantic-ui-react';
import { List, LatestList } from './Post';

const Feed = ({ location }) => (
  <Grid>
    <Grid.Row columns={1} centered>
      <Grid.Column width={12}>
        { location.pathname !== '/yeni' ? <List /> : <LatestList /> }
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default Feed;
