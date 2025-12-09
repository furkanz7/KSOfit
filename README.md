# 🏋️ Killer Skinny Obese Fit (KSOFit)

> **"Skinny Fat" ve Obezite Döngüsünü Kıran Bilimsel Dönüşüm Asistanı.**

![Expo](https://img.shields.io/badge/Expo-Go-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## 📖 Proje Hakkında ve Amaç

**Killer Skinny Obese Fit (KSOFit)**, piyasadaki standart fitness uygulamalarının göz ardı ettiği spesifik bir probleme çözüm üretmek için geliştirilmiş, **sonuç odaklı** bir mobil koçluk platformudur.

### 🎯 Çözülen Problem
Çoğu uygulama "Kilo Ver" veya "Kas Yap" şeklinde iki genel seçenek sunar. Ancak **"Skinny Fat"** (kıyafetle zayıf görünen ama yağ oranı yüksek, kas kütlesi düşük) veya **Metabolik Obezite** sınırındaki bireyler için bu genel yaklaşımlar başarısız olmaktadır:
* Sadece kilo vermeye odaklanmak, kas kaybına ve daha kötü bir "Skinny Fat" görünümüne yol açar.
* Sadece kas yapmaya odaklanmak (Dirty Bulk), yağ oranını tehlikeli seviyelere çıkarır.

### 🚀 KSOFit'in Misyonu
KSOFit, bu kısır döngüyü kırmak için **Re-Composition (Vücut Kompozisyonunu Değiştirme)** bilimini kullanır. Amacı; kullanıcıyı rastgele diyetlerden ve verimsiz antrenmanlardan kurtarıp, **Progressive Overload (Aşamalı Yüklenme)** prensibiyle kas dokusunu artırırken, **Erişime Dayalı Akıllı Beslenme** ile yağ yakımını maksimize etmektir.

Kullanıcıya "yapabildiğin kadar yap" demez; algoritmik olarak **"yapman gerekeni"** hesaplar ve sunar.

---

## 🔥 Temel Özellikler

### 1. ⚙️ Progressive Overload (PO) Motoru
Uygulamanın beyni ve en kritik modülüdür.
* **Algoritmik Gelişim:** Bir önceki antrenman verisini (Set/Tekrar/Ağırlık) analiz eder.
* **Zorlayıcı Hedefler:** Kullanıcıya bir sonraki antrenman için *"Ağırlığı %2.5 artır"* veya *"Tekrar sayısını 2 artır"* şeklinde, matematiksel olarak hesaplanmış spesifik hedefler sunar.
* **PR Takibi:** Kişisel rekorları otomatik olarak algılar, kaydeder ve kullanıcıyı motive eder.

### 2. 🥕 Akıllı Beslenme Planlayıcısı (Anti-Yağ Modu)
Kalıplaşmış, pahalı ve sürdürülemez diyet listelerine bir alternatiftir.
* **Malzeme Envanteri:** Kullanıcı mutfağında halihazırda bulunan malzemeleri (Örn: Yumurta, Mercimek, Tavuk, Yulaf) sisteme girer.
* **Dinamik Üretim:** Edamam API entegrasyonu sayesinde, sadece eldeki malzemeler kullanılarak, kullanıcının **Yüksek Protein / Orta Karbonhidrat** hedefine uygun öğün alternatifleri anlık olarak üretilir.

### 3. 💎 Premium Koçluk Simülasyonu (İş Modeli)
Uygulamanın gelir modelini ve ölçeklenebilirliğini gösteren prototip yapıdır.
* **Seviyeli Koçluk:** Bronz (Giriş), Gümüş (Orta) ve Altın (İleri) koçluk paketleri.
* **Erişim Yönetimi:** Kullanıcının abonelik statüsüne göre (Örn: `isPremium: true`) "Form Analizi" veya "Koçla Sohbet" gibi özelliklerin kilitlenip açılması.

---

## 🛠️ Teknik Mimari ve Kullanılan Teknolojiler

Proje, modern mobil geliştirme standartlarına uygun olarak **Expo (React Native)** ekosistemi üzerinde inşa edilmiştir.

| Teknoloji | Kullanım Amacı |
| :--- | :--- |
| **Expo Framework** | Cross-platform (iOS/Android) geliştirme ve hızlı derleme. |
| **React Navigation** | Stack ve Tab navigasyon yapıları ile akıcı sayfa geçişleri. |
| **Firebase Auth** | Güvenli kullanıcı kimlik doğrulama ve oturum yönetimi. |
| **Firebase Firestore** | NoSQL tabanlı gerçek zamanlı veri saklama (Antrenman logları, Profil verisi). |
| **Axios & Fetch API** | Harici beslenme servisleri (Edamam) ile RESTful veri alışverişi. |
| **AsyncStorage** | Cihaz üzerinde yerel veri önbellekleme (Cache). |
| **Expo Notifications** | Kullanıcı disiplinini sağlamak için antrenman hatırlatıcıları. |

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

**1. Repoyu Klonlayın**
```bash
git clone [https://github.com/furkanz7/killer-skinny-obese-fit.git](https://github.com/furkanz7/killer-skinny-obese-fit.git)
cd killer-skinny-obese-fit
