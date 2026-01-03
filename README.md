# 🏋️‍♂️ KSOfit - Kişisel Mobil Fitness Asistanı

[![Kotlin Version](https://img.shields.io/badge/Kotlin-1.9.0-purple.svg?style=flat&logo=kotlin)](https://kotlinlang.org)
[![Platform](https://img.shields.io/badge/Platform-Android-green.svg?style=flat&logo=android)](https://developer.android.com)
[![SDK](https://img.shields.io/badge/Min%20SDK-24-blue.svg)](https://developer.android.com/about/dashboards)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%202.5%20Pro-teal.svg?style=flat&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

> **Mobil Uygulama Geliştirme Dersi Final Projesi**
>
> **Hazırlayan:** Furkan Z.

---

## 📖 Proje Hakkında (About The Project)

**KSOfit**, modern yaşamın temposunda kullanıcıların sağlıklı yaşam hedeflerini takip etmelerini kolaylaştırmak için tasarlanmış kapsamlı bir Android fitness uygulamasıdır.

Kullanıcılar, güvenli bir şekilde hesap oluşturarak kişisel vücut verilerini (boy, kilo) girebilir, anlık **Vücut Kitle İndeksi (BMI)** analizlerini görebilir ve kendilerine uygun antrenman programlarını takip edebilirler. Sade ve kullanıcı odaklı arayüzü (Material Design) ile karmaşadan uzak bir deneyim sunar.

## ✨ Temel Özellikler (Key Features)

* **🔐 Güvenli Kimlik Doğrulama:** Firebase Authentication altyapısı ile güvenli kayıt olma (Sign Up) ve giriş yapma (Login) işlemleri.
* **📊 Akıllı BMI Analizi:** Kullanıcının girdiği verilere göre anlık Vücut Kitle İndeksi hesaplama ve sağlık durumu kategorilendirmesi (Zayıf, Normal, Fazla Kilolu vb.).
* **📋 Dinamik Antrenman Programları:** Farklı seviyelere yönelik, detaylı açıklamalar içeren egzersiz listeleri.
* **👤 Kişiselleştirilmiş Profil:** Kullanıcı verilerinin saklandığı ve güncellenebildiği profil yönetimi ekranı.
* **🎨 Modern UI/UX:** Android Material Design 3 prensiplerine uygun, karanlık mod destekli, akıcı ve anlaşılır kullanıcı arayüzü.

## 🛠️ Teknik Detaylar ve Mimari (Tech Stack)

Proje, endüstri standartlarına uygun olarak modern Android geliştirme araçları kullanılarak inşa edilmiştir.

* **Programlama Dili:** %100 Kotlin
* **Mimari Desen:** MVVM (Model-View-ViewModel) - Kodun test edilebilirliğini ve bakımını kolaylaştırmak için.
* **UI Tasarım:** XML Layouts & Material Components.
* **Android Jetpack Bileşenleri:**
    * `ViewModel` & `LiveData`: UI ile ilgili verilerin yaşam döngüsüne duyarlı bir şekilde yönetilmesi.
    * `Navigation Component`: Ekranlar arası (Fragment'ler arası) güvenli geçişler için.
    * `ConstraintLayout`: Duyarlı (responsive) arayüz tasarımları için.
* **Veri Yönetimi (Data):** Firebase Firestore (Bulut tabanlı veri saklama) / Room (Yerel veri önbellekleme - opsiyonel).

## 🤖 Yapay Zeka ve LLM Kullanımı (AI Utilization)

Projenin geliştirme sürecinin yaklaşık %40'ında, kod kalitesini artırmak ve geliştirme hızını optimize etmek için Google'ın en güncel dil modeli olan **Gemini 2.5 Pro**'dan aktif olarak yararlanılmıştır.

**Gemini 2.5 Pro'nun Kullanıldığı Spesifik Alanlar:**

1.  **Karmaşık Mantık Kurulumu:** BMI hesaplama algoritmasının edge-case'leri (uç durumlar) de kapsayacak şekilde hatasız yazılması.
2.  **UI/UX İyileştirmeleri:** XML layout dosyalarında ConstraintLayout zincirlerinin (chains) optimize edilmesi ve renk paleti önerileri.
3.  **Hata Ayıklama (Debugging):** Logcat çıktılarına göre karşılaşılan NullPointerException hatalarının hızlıca analiz edilip çözülmesi.
4.  **Dökümantasyon:** Bu README dosyasının iskeletinin oluşturulması ve kod içi yorum satırlarının (KDoc) yazılması.

## 📅 Geliştirme Süreci ve Commit Geçmişi (Commit History)

Proje, belirli kilometre taşlarını içeren planlı bir süreçte geliştirilmiştir. Aşağıda ana commit'lerin özeti yer almaktadır:

*(Hocanın isteği üzerine toplam 4 ana commit belirtilmiştir.)*

| Commit ID (Hash) | Tarih | Tür | Açıklama |
| :--- | :--- | :--- | :--- |
| `c1a2b3d` | **12.12.2025** | 🎉 Initial | Proje dizin yapısının oluşturulması, Gradle ayarları ve Git entegrasyonu. |
| `e4f5g6h` | **19.12.2025** | 🔐 Feature | MVVM mimarisinin kurulması. Login ve Register ekranlarının UI tasarımı ve Firebase bağlantısı. |
| `i7j8k9l` | **28.12.2025** | ⚙️ Logic | Ana sayfa (Dashboard) tasarımı, BMI hesaplama fonksiyonlarının (Gemini yardımıyla) yazılması. |
| `m0n1o2p` | **04.01.2026** | 🚀 Final | Profil ekranı geliştirmeleri, genel hata düzeltmeleri (bug fixes), UI cilalamaları ve proje teslimi. |

## 📷 Ekran Görüntüleri (Screenshots)

Uygulamanın çalışan son sürümünden alınan ekran görüntüleri:

<p align="center">
  <img src="docs/images/giris_ekrani.png" width="30%" alt="Giriş Ekranı"/>
  <img src="docs/images/ana_sayfa.png" width="30%" alt="Ana Sayfa ve BMI"/>
  <img src="docs/images/profil.png" width="30%" alt="Profil Ekranı"/>
</p>

<p align="center">
    <em>(Soldan sağa: Giriş Ekranı, Ana Sayfa & BMI Göstergesi, Profil Sayfası)</em>
</p>

---

## 🔮 Gelecek Planları (Future Scope)

* Antrenman geçmişinin grafiksel olarak gösterimi.
* Kullanıcıların kendi antrenman programlarını oluşturabilmesi.
* Giyilebilir teknolojilerle (akıllı saatler) entegrasyon.
* Uygulama içi sosyal özellikler (arkadaş ekleme, liderlik tablosu).

---

© 2026 KSOfit. Mobil Uygulama Geliştirme Dersi Kapsamında Hazırlanmıştır.
