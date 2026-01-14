
import { updateSettings, getSettings } from '@/lib/article-actions';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div>
            <h1>Settings</h1>

            <form action={updateSettings} className="article-form" style={{ marginTop: '2rem' }}>
                <h2>Social Media Counters</h2>
                <p style={{ marginBottom: '1rem', color: '#666' }}>Manually update your follower counts displayed on the homepage.</p>

                <div className="form-group">
                    <label>Facebook Followers</label>
                    <input
                        type="text"
                        name="facebook_followers"
                        defaultValue={settings.facebook_followers}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Instagram Followers</label>
                    <input
                        type="text"
                        name="instagram_followers"
                        defaultValue={settings.instagram_followers}
                        className="form-input"
                    />
                </div>

                <h2>Advertisement</h2>
                <div className="form-group">
                    <label>Header Banner (Recommended: 728x90px)</label>
                    {settings.ad_banner_url && (
                        <div style={{ marginBottom: '10px' }}>
                            <img src={settings.ad_banner_url} alt="Current Ad" style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc' }} />
                        </div>
                    )}
                    <input type="file" name="ad_banner" accept="image/*" className="form-input" />
                </div>

                <button type="submit" className="submit-btn">Save Settings</button>
            </form>
        </div>
    );
}
