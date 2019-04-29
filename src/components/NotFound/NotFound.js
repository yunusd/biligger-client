import React from 'react';
import { Link } from 'react-router-dom';
import {
 Header, Grid, List, Label,
} from 'semantic-ui-react';

const NotFound = props => (
  <Grid columns={2} divided>
    <Grid.Column mobile={16} tablet={10} computer={8}>
      <Header style={{ fontSize: '19em' }}>
        <span style={{ color: '#527ec0' }}>4</span>
        <span style={{ color: '#da324b' }}>0</span>
        <span style={{ color: '#48ba6f' }}>4</span>
      </Header>
    </Grid.Column>
    <Grid.Column mobile={16} tablet={10} computer={8} verticalAlign="middle" style={{ fontSize: '3em' }}>
      <List>
        <List.Item>
          <p>
            { props.deleted ? 'Aradığınız içerik kullanıcı tarafından silinmiş!' : 'Maalesef aradığınız sayfayı bulamadık.'}
          </p>
        </List.Item>
        <List.Item>
          <Label as="a" onClick={() => props.history.goBack()}> Geri Git </Label>
          <Label as={Link} to="/">Anasayfa</Label>
        </List.Item>
      </List>
    </Grid.Column>
  </Grid>
  );

export default NotFound;
