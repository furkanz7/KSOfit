import { Redirect } from 'expo-router';

export default function Index() {
    // Burada ileride auth kontrolü yapılıp dashboard'a yönlendirme eklenebilir.
    return <Redirect href="/(auth)/login" />;
}
