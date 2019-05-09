import React from 'react';
import { Link } from 'react-router-dom';
import { List, Grid } from 'semantic-ui-react';

const Footer = () => (
  <footer>
    <Grid>
      <Grid.Row columns={1} centered>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
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
  </footer>
);

export default Footer;
