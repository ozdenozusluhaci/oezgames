# Özden — Web sitesi

Bu klasör, GitHub Pages'te ücretsiz ve HTTPS ile yayınlanmaya hazır bir sitedir.
Telefonda, iPad'de ve bilgisayarda kendini ekrana göre düzenler.

## 1. Yayına alma (bir kez)
1. github.com'da **New repository** → adını tam olarak `KULLANICIADIN.github.io` yap → Public → Create.
2. Açılan sayfada **uploading an existing file** bağlantısına tıkla.
3. Bu zip'i bilgisayarında aç; içindeki TÜM dosya ve klasörleri sürükleyip bırak → **Commit changes**.
   (Tarayıcıdan tek seferde en fazla 100 dosya ve dosya başına 25 MB yüklenebilir. Oyunlar büyükse klasör klasör yükle.)
4. Repo'da **Settings → Pages**: Source = *Deploy from a branch*, Branch = *main* / *(root)* → Save.
5. 1–2 dakika sonra site `https://KULLANICIADIN.github.io` adresinde açılır.

## 2. Oyun ekleme (en önemlisi)
- Her oyunun klasörü hazır: `games/sevimli-balikci`, `games/doga-evim`, `games/birdy-namnam`, `games/tabula`.
- Oyununun zip'ini aç, içindeki dosyaları ilgili klasöre yükle. Oyunun `index.html` dosyası o klasörün içinde olmalı (şimdiki "yakında" sayfasının yerine geçer).
- Oyunlar kendi PWA'larıyla çalışır; ana site oyun klasörlerine karışmaz.
- Yeni oyun eklemek için: `games/` altına yeni klasör aç ve `content.js` içindeki `games` listesine bir satır ekle.
- Oyuna seçilen dil `?lang=tr|en|de` olarak iletilir; oyunun bunu okuması isteğe bağlıdır.

## 3. İçeriği değiştirme
Metinlerin, kitapların, oyunların, videoların, damgaların ve blog yazılarının hepsi **content.js** içindedir.
GitHub'da dosyayı aç → kalem simgesi → düzenle → Commit. Site 1–2 dakikada güncellenir.
- Fotoğraflar → `images/` klasörüne yükle, content.js'te yolunu yaz (örn. `images/ben.jpg`).
- PDF'ler → `pdf/` klasörüne yükle.
- YouTube: video adresindeki `v=` sonrasındaki kısmı `videos` listesine yaz.

## 4. Kendi alan adın (İsimtescil)
1. Repo **Settings → Pages → Custom domain**: `alanadin.com` yaz → Save → *Enforce HTTPS* işaretle.
2. İsimtescil DNS yönetiminde:
   - `A` kayıtları (@): 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` kaydı (www): `KULLANICIADIN.github.io`
3. DNS'in yayılması birkaç saat sürebilir.

## 5. Diller
- Türkçe: ana adres, İngilizce: `/en/`, Almanca: `/de/`. Google her dili ayrı sayfa olarak bulur.
- Arayüz metinleri `i18n.js` içinde, içerik metinleri `content.js` içinde.
- Alan adını aldıktan sonra şu 5 dosyada `https://alanadin.com/` yazan yerleri kendi adresinle değiştir:
  `index.html`, `en/index.html`, `de/index.html`, `sitemap.xml`, `robots.txt`.

## 6. Google'da görünme
Site açıldıktan sonra search.google.com/search-console adresinden siteni ekle, doğrula ve `sitemap.xml` dosyasını gönder.
