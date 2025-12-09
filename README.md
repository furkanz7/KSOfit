# 🏋️ Killer Skinny Obese Fit (KSOFit)

> **"Skinny Fat" ve Obezite Döngüsünü Kıran Bilimsel Dönüşüm Asistanı.**

![Expo](https://img.shields.io/badge/Expo-Go-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

## 📖 Proje Hakkında

**Killer Skinny Obese Fit (KSOFit)**, özellikle "Skinny Fat" (zayıf ama yağlı) ve obezite sınırındaki bireyler için tasarlanmış, **Progressive Overload (Aşamalı Yüklenme)** prensibini temel alan kapsamlı bir mobil koçluk uygulamasıdır.

Standart fitness uygulamalarının aksine, KSOFit kullanıcıya sadece ne yaptığını sormaz; bir sonraki antrenmanda ne yapması gerektiğini **matematiksel olarak hesaplar**. Ayrıca, kullanıcının mutfağında halihazırda bulunan malzemelere göre makro odaklı beslenme planları oluşturur.

Bu proje, **Mobil Uygulama Geliştirme** dersi final projesi kapsamında geliştirilmiştir.

---

## 🔥 Temel Özellikler

### 1. ⚙️ Progressive Overload (PO) Motoru
Uygulamanın kalbidir. Kullanıcının gelişimini şansa bırakmaz.
* **Otomatik Hedefleme:** Bir önceki antrenman verisini (Set/Tekrar/Ağırlık) analiz eder.
* **Dinamik Öneri:** Kullanıcıya bir sonraki antrenman için *"Ağırlığı %2.5 artır"* veya *"Tekrar sayısını 2 artır"* şeklinde spesifik hedefler sunar.
* **PR Takibi:** Kişisel rekorları otomatik olarak algılar ve kaydeder.

### 2. 🥕 Akıllı Beslenme Planlayıcısı (Anti-Yağ Modu)
Sabit diyet listeleri yerine, eldeki malzemeye odaklanan esnek yapı.
* **Malzeme Envanteri:** Kullanıcı dolabındaki malzemeleri (Örn: Yumurta, Yulaf, Ton Balığı) girer.
* **API Entegrasyonu:** Edamam API kullanılarak, girilen malzemelerle yapılabilecek, kullanıcının Protein/Kalori hedefine uygun tarifler dinamik olarak listelenir.

### 3. 💎 Premium Koçluk Simülasyonu
Uygulamanın iş modelini gösteren prototip modülüdür.
* **Kademeli Abonelik:** Bronz, Gümüş ve Altın koçluk seviyeleri.
* **Erişim Kontrolü:** Kullanıcının abonelik seviyesine göre kilitli içeriklere (Gelişmiş Analiz, Video Form Kontrolü vb.) erişim yönetimi.
* **Koç Arayüzü:** Dijital koç ile iletişim simülasyonu.

---

## 🛠️ Teknik Mimari ve Kullanılan Teknolojiler

Proje, modern mobil geliştirme standartlarına uygun olarak **Expo (React Native)** ekosistemi üzerinde inşa edilmiştir.

| Teknoloji | Kullanım Amacı |
| :--- | :--- |
| **Expo Framework** | Cross-platform geliştirme ve hızlı prototipleme. |
| **React Navigation** | Stack ve Tab navigasyon yapıları için. |
| **Firebase Auth** | Güvenli kullanıcı kimlik doğrulama işlemleri. |
| **Firebase Firestore** | NoSQL tabanlı gerçek zamanlı veri saklama (Antrenman kayıtları, Profil). |
| **Axios & Fetch API** | Harici beslenme servisleri (Edamam) ile HTTP istekleri. |
| **AsyncStorage** | Cihaz üzerinde yerel veri önbellekleme. |
| **Expo Notifications** | Antrenman hatırlatıcıları ve motivasyon bildirimleri. |

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

**1. Repoyu Klonlayın**
```bash
git clone [https://github.com/KULLANICI_ADINIZ/killer-skinny-obese-fit.git](https://github.com/KULLANICI_ADINIZ/killer-skinny-obese-fit.git)
cd killer-skinny-obese-fit
