# VouchIT Pitch Deck — Sunum Planı & Notları

**Toplam süre:** ~14 dakika + demo  
**Format:** 9 slide · Klavye: `←` `→` gezin · `F` tam ekran

---

## Genel Akış

| # | Slide | Süre |
|---|-------|------|
| 01 | Cover | 0:30 |
| 02 | Problem | 1:30 |
| 03 | Çözüm | 1:00 |
| 04 | Ürün | 1:30 |
| 05 | Pazar | 1:00 |
| 06 | Rekabet | 1:30 |
| 07 | İş Modeli | 1:30 |
| 08 | Yol Haritası | 1:00 |
| 09 | Demo | 4:00 |
| — | Soru & Cevap | açık uçlu |

---

## Slide 01 — Cover `0:30`

**Açılış cümlesi:**
> "Merhaba. Ben [isim]. VouchIT'i kuruyorum — yazılım mühendisleri için gürültüsüz, kanıta dayalı bir kariyer platformu."

**Notlar:**
- Kendini tanıt, kısa tut — dinleyiciler hâlâ yerleşiyor
- Stack pill'lerine bakırlarsa: *"Bunlara ürün slide'ında döneceğiz"* de geç
- Badgedeki "Beta · 2025" kasıtlı — erken aşamada yatırım arıyorsun, gizleme

---

## Slide 02 — Problem `1:30`

**Açılış sorusu** *(dinleyiciye sor)*:
> "Geçen hafta kaç LinkedIn bildirimi sildинiz bakmadan?"

**Notlar:**
- Sol kart (LinkedIn): spam ve gürültüyü vurgula — herkesin yaşadığı bir acı
- Sağ kart (Mühendis): perspektifi çevir — *sorun sadece recruiter'ın değil, mühendisinde de*
- Güçlü kapanış cümlesi: *"Gerçek yetenek, sahte sertifikaların arasında boğuluyor."*
- **Durakla.** Slide'ı sindirmelerine izin ver, hemen geçme

---

## Slide 03 — Çözüm `1:00`

**Notlar:**
- Formül yavaş akar — her satırda dur, anlattıktan sonra tıkla
- "Sosyal medya gürültüsünü çıkart" → "Teknik kanıtı koy" → "Doğrudan eşleştir"
- Son kutu (`⚡ VouchIT`) çıkınca: *"İşte bu kadar basit. Sinyal bırak, gürültüyü at."*
- Teknik detaya girme — sonraki slide için sakla

---

## Slide 04 — Ürün `1:30`

**Sol kart — Mühendis tarafı:**
- GitHub commit'leri ve LeetCode skoru: *"Bunlar CV'de 'iyi yazılımcıyım' yazmaktan çok daha anlamlı"*
- "12 Vouch Aldı": sosyal kanıt mekanizması, LinkedIn recommendation'ın ölçülebilir versiyonu
- "AI Doğrulanmış Projeler" → GPT-4o CV'yi okur, GitHub'la karşılaştırır, uyuşmayan iddiayı yakalar

**Sağ kart — HR tarafı:**
- Güven Skoru `98%` → recruiter artık CV okumak zorunda kalmıyor
- *"Bir recruiter günde 50 profil bakıyorsa, bu onu 5'e düşürür"*

**Kapanış:** Flow şeridini göster → `CV → GPT-4o → GitHub cross-check → Doğrulanmış Profil`

---

## Slide 05 — Pazar `1:00`

**Notlar:**
- Sayaçların animasyonla çıkmasını bekle — etkili
- **30M+ mühendis:** *"Bu, dünyanın en büyük homojen profesyonel kitlesi"*
- **1.4M açık pozisyon:** *"Talep var. Arz var. Aralarında doğru köprü yok."*
- `$4.2B+ TAM` ve `%25 yıllık büyüme` — rakamları tartışmaya açma, geç
- > **Uyarı:** Rakamlar için kaynak sorulursa → Stack Overflow Survey 2024 + McKinsey Tech Talent, slide'da yazıyor

---

## Slide 06 — Rekabet `1:30`

**Notlar:**
- Tabloyu soldan sağa oku, her satırı bir cümleyle anlat
- LinkedIn: *"Her şeyi yapıyor ama hiçbirini iyi yapmıyor"*
- GitHub Jobs: *"Teknik kitleye yakın ama sosyal katman yok, doğrulama yok"*
- VouchIT sütununu gösterirken: *"Biz yeni bir kategori yaratıyoruz — verified professional network"*
- En güçlü satır: **GitHub × CV Cross-check** → *"Bunu dünyada başka kimse yapmıyor"*

---

## Slide 07 — İş Modeli `1:30`

**Notlar:**
- Freemium olmadığını vurgula: *"Freemium, kalitesiz kitleyi büyütür. Biz doğrulanmış kullanıcı istiyoruz."*
- **Developer $9.99/ay:** *"Doğrulanmış bir profil bir iş görüşmesini karşılıyor"*
- **HR $49/ay:** *"Bir iyi işe alım bu planı onlarca aya finanse eder"*
- **Enterprise:** bilerek `Custom` — enterprise satışı ilişki satışı, liste fiyatı kesmez
- Hover efektini göster (3D tilt) — küçük detay, kalite hissi verir

---

## Slide 08 — Yol Haritası `1:00`

**Notlar:**
- Her fazı tek cümleyle geç, fazla detaya girme
- **Şimdi (MVP):** *"Şu an buradayız. Temel döngü çalışıyor."*
- **Yaz 2025:** recruiter araçları → ilk gelir kapısı
- **Son 2025:** Skill Challenge → *"Live coding, CV'ye göre çok daha güçlü bir sinyal"*
- **2026:** Decentralized Identity → vizyonu göster ama *"önce temeli sağlamlaştırıyoruz"* de
- Kapanış: *"Şimdi bunu canlı görelim."* → demo slide'a geç

---

## Slide 09 — Canlı Demo `~4:00`

### Demo scripti (adım adım)

**① GitHub ile Giriş** `~30 sn`
- Tarayıcıda `localhost:3000` aç
- "GitHub ile Giriş" butonuna tıkla
- OAuth akışını göster → *"Token otomatik alınıyor, recruiter bunu görmez"*

**② CV Yükle** `~30 sn`
- `/upload` sayfasına git
- Hazır PDF kullan (kendi CV'n veya test CV'si — önceden test et!)
- Dosyayı sürükle-bırak
- > ⚠️ **Uyarı:** Upload öncesinde API'nin ayakta olduğundan emin ol (`cd api && npm run dev`)

**③ Loading → AI Analiz** `~60 sn`
- Loading sayfasını göster: *"GPT-4o CV'yi okuyor, GitHub'u sorguluyor"*
- Bekleme süresini konuşarak doldur: *"Şu an model CV'deki her proje iddiasını GitHub commit geçmişiyle karşılaştırıyor"*

**④ Profil Sayfası** `~60 sn`
- Oluşan profili gez: developer view → HR view toggle
- Güven skoru ve doğrulanmış yetenekleri göster
- *"Bu profili artık bir link olarak paylaşabilirsin"*

**⑤ Spaces Feed** `~30 sn`
- `/spaces` sayfasına geç
- *"Bu topluluk katmanı — mühendisler burada birbirini vouch'luyor"*

**Kapanış cümlesi:**
> "İşte bu kadar. CV'den doğrulanmış profile 2 dakika. Sorularınız?"

---

## Soru & Cevap — Olası Sorular

| Soru | Kısa Cevap |
|------|-----------|
| "Neden mühendisler ücret ödesin?" | Doğrulanmış profil = daha iyi iş fırsatları. $9.99 bir görüşmeye bile değer. |
| "LinkedIn bunu kopyalarsa?" | Network effect lazım. Biz mühendis-first, onlar genel kitle. Odak farkı. |
| "Sahte GitHub commit'e karşı ne yapıyorsunuz?" | GPT-4o commit kalitesini, proje tutarlılığını analiz ediyor — sadece sayı değil. |
| "Şu an kaç kullanıcı var?" | MVP aşamasındayız, ilk beta kullanıcıları onboarding aşamasında. |
| "Rakip: Wellfound / Angel.co?" | Onlar job board. Biz verified identity layer. Entegre bile olabiliriz. |
