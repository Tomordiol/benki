
import { getSettings } from '@/lib/article-actions';
import FooterClient from './FooterClient';

export default async function Footer() {
    const settings = await getSettings();

    return (
        <FooterClient
            facebookFollowers={settings.facebook_followers}
            instagramFollowers={settings.instagram_followers}
        />
    );
}
