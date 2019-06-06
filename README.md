Biligger Client
=========
Biligger doğruların, fikirlerin karşılaşmasıyla ortaya çıktığına inanan, bilgiyi paylaşarak, tartışarak büyütmeyi ve geliştirmeyi amaç edinmiş, saygıyı, nezaketi öne alan düşünürlerin (biligger’ların) buluştuğu ütopik bir tartışma platformudur.

## Başlarken
Bu adımlar projenin bir kopyasını yerel makineniz de geliştirme ve test amacıyla nasıl çalıştıracağınızı anlatıyor. Deploy için deployment bölümüne bakınız.

### Önceden Gerekenler
Bu depoyu çalıştırabilmek için aşağıda ki yazılımların yüklü olması gerekmektedir.

[NodeJS <= 10](https://nodejs.org/en/download/package-manager/)

### Yükleme
Bağımlılıkları yükler.<br>
```
npm install
```

Geliştirici modunda çalıştırır.<br>
```
npm start
```
Tarayıcıda görüntülemek için bu adresi [http://localhost:3000](http://localhost:3000) açınız.

### Testleri çalıştırma
Test runner'ı etkileşimli izleme modunda çalıştırır.
```
npm run test -- --watchAll
```

## Deployment
Uygulamayı derler ve `build` klasörü oluşturup dışa aktarır.
```
npm run build
```

Derleme işlemini docker içinde yapmak için aşağıda ki komutu çalıştırın.
```
docker build -t yunusdp/biligger-client .
```

## Kullanılan teknolojiler
* [Docker](https://docker.com) - Container
* [React](https://reactjs.org) - JS Library for User Interface
* [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL API
* [Rich Markdown Editor](https://github.com/outline/rich-markdown-editor) - Markdown Editor
* [Yup](https://github.com/jquense/yup) - Object Schema Validator
* [React Helmet](https://github.com/nfl/react-helmet) - Document Head Manager
* [Formik](https://jaredpalmer.com/formik/) - For forms

## Sürümleme
Sürümleme için [SemVer](https://semver.org) kullanılıyor. Sürümler için [deponun etiketlerine](https://github.com/yunusd/biligger-client/tags) bakabilirsiniz.