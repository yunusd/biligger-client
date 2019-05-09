import React from 'react';
import {
 Grid, Card, Divider, Header, List,
} from 'semantic-ui-react';

const SiteInfo = ({ location }) => {
  const pathname = location.pathname;

  return (
    <Grid columns={1} centered>
      <Grid.Row>
        <Grid.Column largeScreen={12} computer={12} widescreen={12} tablet={12} mobile={16}>
          <Card fluid>
            <Card.Content>
              { pathname === '/hakkinda' && (
                <React.Fragment>
                  <Card.Header textAlign="center" style={{ margin: '5px 0 0 0', fontSize: '30px' }}>
                    Hakkında
                  </Card.Header>
                  <Divider />
                  <Card.Description>
                    <Header size="medium">
                      Biligger nedir?
                    </Header>
                    Biligger doğruların, fikirlerin karşılaşmasıyla
                    ortaya çıktığına inanan, bilgiyi paylaşarak,
                    tartışarak büyütmeyi ve geliştirmeyi amaç edinmiş,
                    saygıyı, nezaketi öne alan düşünürlerin
                    (biligger’ların) buluştuğu ütopik bir tartışma platformudur.
                    Biligger bilgi yazarı demektir. Biligger’lar fikirlere,
                    kişilere saygılı, nazik, yapıcı ve yardımseverdir.
                    Araştırmacı, halden anlayan ve medenidir.
                    Bilir ki hiç kimse bilgiye sahip olarak doğmaz.

                    <Header size="medium">
                      Biligger neden var?
                    </Header>
                    Biligger.com, tartışma kültürünün kaybolduğu,
                    insanların fikirlerini dikte etmeye çalıştığı,
                    anlamaktan çok konuşmayı tercih ettiği günümüzde
                    olması gerektiğini düşündüğümüz, farklı görüşlerin
                    paylaşıldığı, düşüncelere, çeşitliliğe değer veren,
                    medeni bir tartışma ve sohbet ortamının oluştuğu
                    çevrimiçi bir alan olmak için yola çıkmıştır.
                    Kutuplaşmadan uzaklaşmak, karşılıklı anlayışı artırmak,
                    fikirlerin değişebileceğini ve bunun bir yenilgi
                    olmadığını, aksine kazanç olduğunu anlayabilmek,
                    problemleri anlayarak ve konuşarak çözebileceğimizi
                    gösterebilmek için varız.
                    <br />
                    <br />
                    <q>
                      Herkesin aynı şeyi düşündüğü ortamda
                      aslında hiç kimse düşünmüyor demektir.
                    </q>
                    &nbsp;
                    Walter Lippman
                  </Card.Description>
                </React.Fragment>
              )}

              { pathname === '/gizlilik-politikasi-ve-hizmet-sartlari' && (
                <React.Fragment>
                  <Card.Header textAlign="center" style={{ margin: '5px 0 0 0', fontSize: '30px' }}>
                    Gizlilik politikası ve hizmet şartları
                  </Card.Header>
                  <Divider />
                  <Card.Description>
                    <List relaxed bulleted>
                      <List.Item>
                        Gizliliğiniz bizim için önemlidir.
                        Web sitemizden sizden topladığımız
                        herhangi bir bilgi ile ilgili gizliliğinize
                        büyük saygı gösteriyoruz.
                      </List.Item>
                      <List.Item>
                        Biligger’daki hesabınızı kullanırken doğrudan
                        paylaştığınız verilerle otomatik olarak elde edilen log bilgileri,
                        çerezler vasıtasıyla elde edilen bilgiler, ürün ve hizmetlerimizi
                        sağlayabilmek için gereken süre boyunca saklıyoruz. Yer sağlayıcı
                        olarak yasalar gereğince hesabınızı kullanırken otomatik olarak elde
                        edilen ip bilgilerinizi yasal süre boyunca saklıyoruz.
                      </List.Item>
                      <List.Item>
                        Kişisel bilgileri herhangi bir iletişim faaliyeti
                        amacıyla kullanabileceği gibi tarafımızdan sunulan hizmet
                        kalitesinin arttırılması ve site faaliyetlerinin daha iyi şekilde
                        yürütülmesi amacıyla da kayıt altına alınıp, kullanabilir.
                      </List.Item>
                      <List.Item>
                        Biligger, web sitesinde görünen hiçbir içeriğin,
                        doğru, eksiksiz veya güncel olduğunu garanti etmemektedir.
                      </List.Item>
                      <List.Item>
                        Biligger, web sitesinde herhangi bir bağlantının eklenmesi,
                        biligger tarafından onaylandığı anlamına gelmez.
                        Bu tür bağlantılı web sitelerinin kullanımı kullanıcının sorumluluğundadır.
                      </List.Item>
                      <List.Item>
                        Kullanıcıların Türkiye Cumhuriyeti kanunlarına uygun olarak sistemi
                        kullanmaları kendi sorumluluklarındadır.
                      </List.Item>
                      <List.Item>
                        Biligger, bu web sitesi için bu gizlilik politikasını herhangi
                        bir zamanda önceden bildirimde bulunmaksızın revize edebilir.
                        Bu web sitesini kullanarak, bu hizmet şartlarının geçerli sürümüne
                        bağlı kalmayı kabul etmiş sayılırsınız.
                      </List.Item>
                      <List.Item>
                        Bu şartlar ve koşullar, Türkiye yasalarına göre yönetilir ve yorumlanır
                        ve geri dönülmez bir şekilde, o bölgedeki mahkemelerin münhasır yargı
                        yetkisine sunulur.
                      </List.Item>
                    </List>
                  </Card.Description>
                </React.Fragment>
              )}

              { pathname === '/kullanim-kosullari' && (
                <React.Fragment>
                  <Card.Header textAlign="center" style={{ margin: '5px 0 0 0', fontSize: '30px' }}>
                    Kullanım Politikası
                  </Card.Header>
                  <Divider />
                  <Card.Description>
                    <List relaxed bulleted>
                      <List.Item>
                      Güçlü tartışma ile saygısızlık arasında ince bir çizgi vardır.
                      Eğer bir fikre katılmıyorsanız ve tamamen farklı bir bakış açınız
                      varsa kendi cevabınızı diğer kullanıcılara suçlayıcı ve aşağılayıcı dil
                      kullanmadan medenice yazın ve kişileri değil fikirleri karşılaştırın.
                      </List.Item>
                      <List.Item>
                        Günümüz sosyal medyasının sığ yorum kültüründen uzak daha
                        derinlemesine ve bilgiyi büyütmek amacıyla daha özenli yorumlar
                        ve düşünceler oluşturun.
                      </List.Item>
                      <List.Item>
                        Fikirlerimizi ifade ederken nefret söylemi, herhangi bir fikri
                        mülkiyet veya başka bir tarafın kişisel haklarını ihlal eden,
                        hakaret, aşağılayıcı söz, spam, taciz, kötü amaçlı ve yasadışı
                        faaliyetlerde ve davranışlarda bulunmayın.
                      </List.Item>
                      <List.Item>
                        Yazılarınızın anlaşılır olması için yazım kurallarına azami özen gösterin.
                      </List.Item>
                      <List.Item>
                        Paylaşmış olduğunuz içeriğin orijinal kaynağını belirtin.
                      </List.Item>
                      <List.Item>
                        Eğer bir yorumun veya gönderinin tartışmaya,
                        topluluğa ve bilgiye bir katkıda bulunduğunu
                        düşünüyorsanız katılıyorum butonunu kullanın ve insanları teşvik edin.
                      </List.Item>
                      <List.Item>
                        Doğru olan her zaman popüler değil, popüler olan
                        her zaman doğru değildir bunu unutmayın
                      </List.Item>
                      <List.Item>
                        Bir bilig göndermeden önce daha önce paylaşılmadığına emin olun.
                      </List.Item>
                      <List.Item>
                      Sorduğunuz sorular, tartışmaya açtığınız konular cevapların da
                      kalitesini belirleyecektir. Kaliteli sorular, kaliteli bir yaşam yaratır.
                      </List.Item>
                      <List.Item>
                        Gönderdiğiniz içeriklerden sizler sorumlusunuz.
                      </List.Item>
                      <List.Item>
                        Büyük ve kalın harf kullanmayın. Vurgulmak istediğiniz kelimeleri
                        italik yazın.
                      </List.Item>
                      <List.Item>
                        Özellikle hakaret içerikli paylaşımlar ve ifadeler kullananlar
                        önce uyarılır, tekrarı sonrasında tamamen ihraç edilir.
                      </List.Item>
                      <List.Item>
                        Biligger’lar fikirlerinde sınırsız özgürlüğe sahipken
                        ifadelerinde başkalarına
                        karşı saygı sınırını korumakla yükümlüdürler.
                      </List.Item>
                      <List.Item>
                        Bilig başlıkları anlaşılır, net ve kısa olmalı.
                      </List.Item>
                    </List>
                  </Card.Description>
                </React.Fragment>
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default SiteInfo;
