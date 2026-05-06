# VouchIT Pitch Deck - Frontend Design Prompt

## GENEL VİZYON

Yazılım mühendisleri için yeni nesil profesyonel ağ olan **VouchIT**'in VC pitch deck'ini tasarla. 8 slaytlı, etkileyici, profesyonel, minimal ama güçlü. Jüriyi etkilemeli, satış konusu olmalı.

---

## DESİGN FOKUSİ

**Estetik Yönü:** Refined Minimalism + Professional Tech
- Koyu tema (dark mode first): `#0a0e27` (arka plan)
- Turkuaz/mavi aksentler: `#00BCD4` (vurgu ve CTA)
- Yeşil (başarı): `#27AE60`
- Kırmızı (uyarı/problem): `#E74C3C`
- Beyaz metin: `#FFFFFF`

**Font Seçimi:** 
- Display: **Poppins Bold** (geometric, modern, distinctive)
- Body: **Inter** (clean, refined)

**Animasyonlar:** Subtle, purposeful, smooth transitions (200-300ms)

---

## SLAYT-BY-SLAYT SPEC

### SLAYT 1: KAPAKSlayt ve Değer Önerisi (15 saniye)

**Layout:**
- Ekranın ortasında VouchIT logosu (80px+, turkuaz, bold)
- Logo girdikten 1.5 saniye sonra fade-in: elevator pitch metni

**Elevator Pitch:**
```
"Yazılım mühendisleri için gürültüden arındırılmış,
liyakat odaklı yeni nesil profesyonel ağ"
```
- Font: Poppins 36px, bold, turkuaz, merkez hizalı
- Hiç başka element yok — sade, güçlü, merak uyandıran

**Animasyon:**
- Logo: bottom-to-top giriş (200ms, cubic-bezier for bounce)
- Pitch: fade-in (300ms) logo girdikten 1.5s sonra

---

### SLAYT 2: SORUN (45 saniye)

**Layout:**
- Üst kısımda başlık: "Mevcut Durumun Gerçeği" (56px, Poppins Bold, beyaz)
- İçerik: 2 sütun grid

**Sol Sütun — LinkedIn & Benzer Platformlar:**
- Başlık: "LinkedIn & Benzer Platformlar" (24px, kırmızı `#E74C3C`)
- 3 bullet point (staggered fade-in, 300ms aralıklar):
  - "Endüstriyel spam ve marketing gürültüsü"
  - "Gerçek yetkinlik, sahte sertifikalar arasında kaybolmuş"
  - "İK'nın doğru yeteneği bulması gittikçe zorlaşıyor"
- Her bullet başında: `✗` (kırmızı)

**Sağ Sütun — Yazılım Mühendislerinin Sorunu:**
- Başlık: "Yazılım Mühendislerinin Sorunu" (24px, turkuaz)
- 3 bullet point (aynı animasyon):
  - "Profil = Biyografi, hobi, siyaset, meme paylaşımları"
  - "Gerçek teknik yeteneklerini gösteremiyorlar"
  - "Kaliteli işe alım fırsatlarına erişemiyorlar"
- Her bullet başında: `→` (turkuaz)

**Stil:**
- Sütunlar arasında: hafif bir divider line (turkuaz, opacity 0.2)
- Arka plan: koyu gradient (#0a0e27 → #0f1333)

---

### SLAYT 3: ÇÖZÜM (30 saniye)

**Layout:**
- Başlık: "VouchIT Çözüm Formülü" (56px, Poppins Bold, turkuaz)
- Vertical formula (boxes + operators):

```
   ✗ Sosyal Medya Gürültüsü
   +
   ✓ Sadece Teknik Yetkinlik & Doğrulama
   +
   ✓ Doğrudan Profesyonel Eşleştirme
   _____________
   = VouchIT
```

**Stil:**
- Her box: padding 20px/40px, 2px turkuaz border, dark-secondary bg (`#1a1f3a`)
- X'ler: kırmızı (`#E74C3C`)
- Checkmark'lar: yeşil (`#27AE60`)
- Plus/equals: turkuaz ve büyük (24px+)
- Final "VouchIT": 56px, Poppins Bold, turkuaz, glow effect (text-shadow)

**Animasyon:**
- Her element sırayla giriş yapsın (300ms aralıklar), yukarıdan aşağıya doğru flow

---

### SLAYT 4: ÜRÜN VE DEMO (90 saniye) **← SUNUMUN EN ÖNEMLİ KIMSII**

**Layout:**
- Başlık: "VouchIT Platform" (56px, turkuaz, üst kısım)
- Mockup: genişletilmiş, merkez, 70% slaytın alanı

**Mockup Yapısı (2 sütun grid veya card layout):**

**Sol taraf — Mühendis Profili:**
- Başlık: "Mühendis Profili" (20px, turkuaz)
- Items (minimal, sade):
  - GitHub Repository
  - LeetCode Score: 2100
  - Doğrulanmış Projeler
  - Vouches (kim tarafından)
  - Teknolojiler: React, Node.js, PostgreSQL
- Font: 14px, monospace-feel (courier new veya code font)

**Sağ taraf — İK Bakış Açısı:**
- Başlık: "İK Bakış Açısı" (20px, turkuaz)
- Items:
  - Filtreler: Dil, Deneyim yılı, Teknoloji
  - Güven Skoru: 98%
  - Proje Referansları
  - Önerilen Adaylar
  - [Contact] CTA button (turkuaz)

**Stil:**
- Mockup border: 2px turkuaz
- Bg: dark-secondary (#1a1f3a)
- Items: liste format, her item solda icon veya bullet, sade
- Sütunlar arasında: hafif divider (turkuaz, opacity 0.2)

**Alt Açıklama (product description):**
```
Sadece teknik profil: GitHub, LeetCode, doğrulanmış projeler | 
Vouch Sistemi: Gerçek arkadaşlar sadece gerçek yeteneği doğrular | 
İK için: Kaliteli adaylar, gözlemlenmiş yetkinlik, risk yok
```
- Font: 16px, Inter, gri (#888), merkez hizalı

**Animasyon:** Mockup'ın tamamı fade-in + slide-up (300ms)

---

### SLAYT 5: PAZAR VE HEDEFİ (30 saniye)

**Layout:**
- Başlık: "Pazar Potansiyeli" (56px, turkuaz)
- 2 sütun (sol-sağ):

**Sol — Yazılım Mühendis Sayısı:**
```
~30 Milyon
Yazılım Mühendisi
(Dünya Çapında)

2024 Stack Overflow Survey, Bureau of Labor Statistics
```

**Sağ — Yetenek Açığı:**
```
1.4 Milyon
Açık Pozisyon
(ABD, Avrupa)

McKinsey Tech Talent Global Survey
```

**Stil:**
- Sayılar: 96px, Poppins Bold, turkuaz, glow text-shadow
- Alt metinler: 18px, beyaz
- Kaynak atıf: 12px, gri (#888)

**Animasyon:** Sayılar counter animation ile (0'dan hedef sayıya, 1.5 saniyede) artmaya başlasın

---

### SLAYT 6: REKABET AVANTAJI / FARKI (30 saniye)

**Layout:**
- Başlık: "Neden VouchIT?" (56px, turkuaz)
- Karşılaştırma tablosu (6x4 grid):

```
Özellik                  | LinkedIn      | Indeed       | VouchIT
Sosyal Medya Odaklı      | ✓ (Problem)   | ✗            | ✗
Aşırı Spam/Marketing     | ✓ (Problem)   | ✗            | ✗
Doğrulanmış Yetkinlik    | Kısmi         | Basit        | ✓✓
Vouch/Referans Sistemi   | ✗             | ✗            | ✓✓
Mühendis-Odaklı          | ✗             | Kısmi        | ✓✓
Doğrudan İK Entegrasyonu | ✗             | ✓            | ✓✓
```

**Stil:**
- Header: dark-secondary bg, Poppins Bold, turkuaz metin
- Rows: alternating backgrounds (dark / dark-secondary)
- Checkmark (✓): yeşil (#27AE60)
- Cross (✗): kırmızı (#E74C3C)
- Double check (✓✓): turkuaz (bigger, bold)
- VouchIT sütunu: turkuaz highlights, bold

**Animasyon:** Satırlar yukarıdan aşağıya reveal olsun (staggered, 150ms aralıklar)

---

### SLAYT 7: İŞ MODELİ (30 saniye)

**Layout:**
- Başlık: "Nasıl Para Kazanıyoruz?" (56px, turkuaz)
- 3 card grid (soldan sağa):

**Card 1 — B2B Rekrutment:**
- İkon: 🤝 (48px, turkuaz)
- Başlık: "B2B Rekrutment Komisyonları" (20px, Poppins Bold)
- Açıklama: "İşletmeler başarılı işe alım başına"
- Highlight: "15-20% Komisyon" (20px, turkuaz, bold)
- Example: "150K pozisyon = $22.5K - $30K" (12px, gri)

**Card 2 — Premium Profiller:**
- İkon: ⭐ (48px, turkuaz)
- Başlık: "Premium Mühendis Profilleri" (20px, Poppins Bold)
- Açıklama: "Mühendisler (opsiyonel)"
- Highlight: "$9.99 - $29.99/ay" (20px, turkuaz, bold)
- Example: "Freemium Model" (12px, gri)

**Card 3 — Enterprise:**
- İkon: 🎯 (48px, turkuaz)
- Başlık: "Yetenek Eşleştirme Servisleri" (20px, Poppins Bold)
- Açıklama: "Şirketler için (gelecek)"
- Highlight: "Custom Pricing" (20px, turkuaz, bold)
- Example: "API integrations, bulk hiring" (12px, gri)

**Stil:**
- Cards: 2px turkuaz border, dark-secondary bg, padding 40px
- Merkez hizalı içerik
- Hover effect: slight scale-up ve glow

**Animasyon:** Cardlar soldan sağa slide-in (300ms aralıklar)

---

### SLAYT 8: EKIP VE YOL HARITASI (30 saniye)

**Layout:**
- Başlık: "Ekip & Sonraki Adımlar" (56px, turkuaz)
- 2 sütun: Sol (ekip), Sağ (roadmap)

**Sol Sütun — EKIP:**
- Card: 2px turkuaz border, dark-secondary bg, padding 30px
- İçerik:
  ```
  Kurucunuz / Lead Developer
  
  Yazılım mimarı, [X yıl deneyim]
  Hackathon kazananı, full-stack geliştirici
  ```
- Font: 18px başlık (Poppins Bold), 13px açıklama (Inter)

**Sağ Sütun — YOL HARITASI (3 ay):**
- 3 box (dikey):

**Ay 1 (Temmuz):**
- Başlık: "Ay 1 (Temmuz)" (16px, turkuaz, Poppins Bold)
- Items (checkmark'lı):
  - ✓ Platform beta yayını
  - ✓ İlk 500 yazılımcıyı invite

**Ay 2 (Ağustos):**
- Başlık: "Ay 2 (Ağustos)" (16px, turkuaz, Poppins Bold)
- Items:
  - ✓ Vouch ağını güçlendir
  - ✓ 10+ işletmeyle pilot anlaşmalar

**Ay 3 (Eylül):**
- Başlık: "Ay 3 (Eylül)" (16px, turkuaz, Poppins Bold)
- Items:
  - ✓ Platform stabilizasyonu
  - ✓ İlk başarılı işe alımları göster

**Stil:**
- Boxes: 2px turkuaz border, dark-secondary bg, padding 25px
- Checkmark: yeşil (#27AE60), bold
- Items: 13px, Inter, beyaz

**Animasyon:** Boxlar soldan sağa slide-in (200ms aralıklar)

---

## TEKNIK REQUİREMENTS

### Navigation:
- **Keyboard:** Sol/sağ ok tuşları = slayt geçişi
- **Mouse:** Butonlar (Önceki / Sonraki) + click navigation
- **Shortcut:** `f` = fullscreen, `?` = presenter notes toggle

### Transitions:
- Smooth fade-out (150ms) → fade-in (150ms)
- Slide-to-slide geçişler hızlı, ama element animasyonları staggered

### Responsive:
- Primary: 1920x1080 (16:9)
- Test: 2560x1440 de iyice görünsün

### Extras:
- Slide counter (top-right): "1 / 8"
- Indicator dots (bottom): slayt jump için tıklanabilir
- Presenter notes sidebar (opsiyonel, toggle ile): her slayt için rehber
- Export: sonunda PDF/PNG download linki (opsiyonel)

---

## BONUS DETAYLAR

- **Color Palette as CSS Variables:** tüm renkler sistematik olsun
- **Typography:** Poppins + Inter kombinasyonu, birbirini tamamlayan, distinctive
- **Motion:** Purpose-driven. Sade motion, ama impactful.
- **Lighting:** Text shadows ve glow effects türkuaz aksentlerde
- **Spacing:** Generous padding, ama dense değil — refined
- **No Generic AI Aesthetics:** Orijinal, kontekst-specific, profesyonel

---

## SUNUŞ TONU (Her slaytın amacı)

1. **Kapak:** Güçlü, merak uyandıran, "Bu ne?" sorusunun cevabı
2. **Sorun:** Ağır, dokunaklı, gerçekçi — jüri "Bu gerçekten var mı?" diye inanmalı
3. **Çözüm:** Sakin, mantıklı — formüla ve matematikle anlatılmalı
4. **Ürün:** Göz alıcı, Jüriye "Bunu istiyorum" hissini vermeli — DEMO eğer mümkünse
5. **Pazar:** Sayısal, istatistikli, potansiyel gösteren
6. **Rekabet:** Açık, net, "Biz neden iyiyiz" doğru ve strong ortaya koyuş
7. **Para:** Gerçekçi, mantıklı, yatırımcıyı ikna eden
8. **Ekip & Plan:** İtibar + hız — "Bu adamlar bunu yaparlar" duygusu

---

## ÖZETİ

**8 slayt, 4.5 dakika, etkileyici, minimal, profesyonel, SATIŞ KONUSU.**
Jüri: "Bu harika. Sizinle çalışmak istiyorum." demeli.
