import React from 'react';
import { Link } from 'react-router-dom';
import { List, Grid } from 'semantic-ui-react';

const Footer = () => (
  <Grid centered>
    <Grid.Row>
      <Grid.Column width={8}>
        <List link horizontal>
          <List.Item as={Link} to="/hakkinda">Hakkında</List.Item>
          <List.Item as={Link} to="/gizlilik-politikasi-ve-hizmet-sartlari">Gizlilik Politikası ve Hizmet Şartları</List.Item>
          <List.Item as={Link} to="/kullanim-kosullari">Kullanım Koşulları</List.Item>
          {/* <List.Item as={Link} to="/">İletişim</List.Item> */}
          <List.Item as={Link} to="/" active>&copy; 2019 Biligger</List.Item>
        </List>
      </Grid.Column>
    </Grid.Row>
  </Grid>
  );

export default Footer;
