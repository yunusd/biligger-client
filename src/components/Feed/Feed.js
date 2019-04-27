import React from 'react';

import { Grid } from 'semantic-ui-react';
import { List } from './Post';

const Feed = () => (
  <Grid>
    <Grid.Row columns={1} centered>
      <Grid.Column width={12}>
        <List />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default Feed;
