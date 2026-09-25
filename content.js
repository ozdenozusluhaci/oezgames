/* ============================================================
   İÇERİK DOSYASI — Sitedeki her şeyi buradan değiştirirsin.
   Kurallar:
   - Metinler tırnak içinde: 'metin'
   - Her öğenin sonunda virgül olsun.
   - Üç dilli alanlar: { tr: '...', en: '...', de: '...' }
   ============================================================ */

window.SITE = {
  name: 'Özden',
  email: 'merhaba@alanadin.com',          // iletişim e-postan

  social: {
    youtube:   'https://youtube.com/@KULLANICI_ADIN',
    instagram: 'https://instagram.com/KULLANICI_ADIN',
    facebook:  'https://facebook.com/KULLANICI_ADIN'
  },

  // ---- 30 saniyede ben ----
  about: {
    photo: '',                            // örn: 'images/ben.jpg' (boşsa yer tutucu görünür)
    bio: {
      tr: 'Kendini 3–4 cümleyle anlattığın kısa tanıtım metnini buraya yaz.',
      en: 'Write your short 3–4 sentence introduction here.',
      de: 'Schreib hier deine kurze Vorstellung in 3–4 Sätzen.'
    },
    stats: { books: 2, games: 4, countries: 0, shows: 0 },
    cvPdf: 'pdf/ozgecmis.pdf',            // pdf klasörüne koyacağın özgeçmiş
    timeline: [
      { year: '2026', text: { tr: 'Rol / kurum / yayın', en: 'Role / institution / publication', de: 'Rolle / Institution / Veröffentlichung' } },
      { year: '2025', text: { tr: 'Rol / kurum / yayın', en: 'Role / institution / publication', de: 'Rolle / Institution / Veröffentlichung' } },
      { year: '2024', text: { tr: 'Rol / kurum / yayın', en: 'Role / institution / publication', de: 'Rolle / Institution / Veröffentlichung' } }
    ]
  },

  // ---- Kitaplar ----
  // buyUrl: satış sayfası (Amazon, Google Play Kitaplar vb.). Boşsa "Yakında" yazar.
  // freePdf: ücretsiz örnek PDF yolu (örn. 'pdf/ornek.pdf'). Boşsa gösterilmez.
  books: [
    { title: 'The Team Lab', color: '#1C2B4B', ink: '#F6EFE0',
      tag: { tr: 'İş yeri psikolojisi, 2. kitap', en: 'Workplace psychology, book 2', de: 'Arbeitspsychologie, Band 2' },
      price: '', buyUrl: '', freePdf: '' },
    { title: 'Little Learners', color: '#E0A23B', ink: '#121D36',
      tag: { tr: 'Çocuk etkinlik kitapları', en: 'Kids activity books', de: 'Aktivitätsbücher für Kinder' },
      price: '', buyUrl: '', freePdf: '' }
  ],

  // ---- Oyunlar ----
  // Her oyunun dosyalarını games/<klasör>/ içine koy. index.html o klasörde olmalı.
  games: [
    { folder: 'sevimli-balikci', name: 'Sevimli Balıkçı', screen: '#BFD3CF', art: 'fish',
      tag: { tr: 'Huzurlu balık tutma', en: 'Cozy fishing', de: 'Gemütliches Angeln' } },
    { folder: 'doga-evim', name: 'Doğa Evim', screen: '#DCE5C8', art: 'house',
      tag: { tr: 'Topla, inşa et, süsle', en: 'Gather, build, decorate', de: 'Sammeln, bauen, dekorieren' } },
    { folder: 'birdy-namnam', name: 'Birdy Namnam', screen: '#F4DDB0', art: 'bird',
      tag: { tr: 'Papağanla İngilizce kelimeler', en: 'Learn words with a parrot', de: 'Wörter lernen mit Papagei' } },
    { folder: 'tabula', name: 'Tabula: The Lost Scripts', screen: '#E6D3A8', art: 'tablet',
      tag: { tr: 'Kayıp yazıları çöz', en: 'Decipher lost scripts', de: 'Verlorene Schriften entziffern' } }
  ],

  // ---- Sahne ----
  // YouTube video kimliği: youtube.com/watch?v=BURADAKI_KISIM
  videos: [ '', '', '' ],
  photos: [ '', '', '', '', '' ],        // örn: 'images/sahne1.jpg'

  // ---- Uluslararası yayınlar (pasaport damgaları) ----
  stamps: [
    { country: 'Ülke', what: 'Dergi / konferans', year: '2025' },
    { country: 'Ülke', what: 'Dergi / konferans', year: '2024' },
    { country: 'Ülke', what: 'Dergi / konferans', year: '2023' }
  ],

  // ---- Blog ----
  // id: adres için kısa ad (boşluksuz). Paragrafları body listesine yaz.
  posts: [
    { id: 'ilk-yazi', minutes: 4, date: '2026-09-24',
      title: 'İlk yazının başlığı',
      body: [
        'Yazının ilk paragrafı buraya.',
        'İkinci paragraf. Okuyucu aşağı kaydırdıkça sağdaki fincan dolar.',
        'Üçüncü paragraf. Yazı bittiğinde kahve de hazır olur.'
      ] }
  ]
};
