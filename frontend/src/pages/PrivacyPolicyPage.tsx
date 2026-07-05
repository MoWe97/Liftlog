import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import PublicNavbar from "@/components/public-navbar";

type Section = { title: string; body: string };
type LegalContent = { pageTitle: string; lastUpdated: string; intro: string; sections: Section[] };

const content: Record<"en" | "de" | "ja", LegalContent> = {
    en: {
        pageTitle: "Privacy Policy",
        lastUpdated: "Last updated: July 5, 2026",
        intro: "This Privacy Policy explains what information LiftLog collects, how it is used, and your rights regarding that information.",
        sections: [
            {
                title: "1. Information We Collect",
                body: "When you sign in with Google (via Clerk), we receive your name, email address, and Google account ID. When you use LiftLog, we store the workout data you create: workout sessions, exercises, workout types, and sets (weight and reps).",
            },
            {
                title: "2. How We Use Your Information",
                body: "We use this information solely to provide the Service to you: authenticating your account and storing and displaying your own workout data back to you. We do not sell your data or use it for advertising.",
            },
            {
                title: "3. Third-Party Services",
                body: "LiftLog relies on third-party providers to operate: Clerk for authentication, and Fly.io for application hosting and database storage. These providers process data on our behalf under their own privacy and security practices.",
            },
            {
                title: "4. Data Storage and Security",
                body: "Your data is stored in a PostgreSQL database hosted on Fly.io. We take reasonable measures to protect it, but no method of electronic storage is completely secure, and we cannot guarantee absolute security.",
            },
            {
                title: "5. Local Storage",
                body: "LiftLog stores your theme and language preference in your browser's local storage. This information stays on your device and is not sent to our servers.",
            },
            {
                title: "6. Your Rights",
                body: "You can access and edit your workout data at any time within the app. You may request deletion of your account and all associated data by contacting us at the address below.",
            },
            {
                title: "7. Children's Privacy",
                body: "LiftLog is not directed at children under 16, and we do not knowingly collect information from them.",
            },
            {
                title: "8. Changes to This Policy",
                body: "We may update this Privacy Policy from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated policy.",
            },
            {
                title: "9. Contact",
                body: "Questions about this Privacy Policy? Contact us at emdobbleu@gmail.com.",
            },
        ],
    },
    de: {
        pageTitle: "Datenschutzerklärung",
        lastUpdated: "Zuletzt aktualisiert: 5. Juli 2026",
        intro: "Diese Datenschutzerklärung erklärt, welche Informationen LiftLog erhebt, wie sie verwendet werden und welche Rechte du in Bezug auf diese Informationen hast.",
        sections: [
            {
                title: "1. Informationen, die wir erheben",
                body: "Wenn du dich mit Google anmeldest (über Clerk), erhalten wir deinen Namen, deine E-Mail-Adresse und deine Google-Konto-ID. Bei der Nutzung von LiftLog speichern wir die von dir erstellten Trainingsdaten: Trainingseinheiten, Übungen, Trainingsarten und Sets (Gewicht und Wiederholungen).",
            },
            {
                title: "2. Wie wir deine Informationen verwenden",
                body: "Wir verwenden diese Informationen ausschließlich, um dir den Dienst bereitzustellen: zur Authentifizierung deines Kontos sowie zum Speichern und Anzeigen deiner eigenen Trainingsdaten. Wir verkaufen deine Daten nicht und nutzen sie nicht für Werbezwecke.",
            },
            {
                title: "3. Drittanbieter-Dienste",
                body: "LiftLog nutzt Drittanbieter, um den Betrieb zu ermöglichen: Clerk für die Authentifizierung und Fly.io für das Hosting der Anwendung und die Datenbankspeicherung. Diese Anbieter verarbeiten Daten in unserem Auftrag gemäß ihren eigenen Datenschutz- und Sicherheitsrichtlinien.",
            },
            {
                title: "4. Datenspeicherung und Sicherheit",
                body: "Deine Daten werden in einer PostgreSQL-Datenbank gespeichert, die auf Fly.io gehostet wird. Wir treffen angemessene Maßnahmen, um sie zu schützen, können jedoch keine absolute Sicherheit garantieren, da keine Methode der elektronischen Speicherung vollständig sicher ist.",
            },
            {
                title: "5. Lokaler Speicher",
                body: "LiftLog speichert deine Theme- und Spracheinstellung im lokalen Speicher deines Browsers. Diese Informationen verbleiben auf deinem Gerät und werden nicht an unsere Server übertragen.",
            },
            {
                title: "6. Deine Rechte",
                body: "Du kannst jederzeit auf deine Trainingsdaten in der App zugreifen und sie bearbeiten. Du kannst die Löschung deines Kontos und aller zugehörigen Daten beantragen, indem du uns unter der unten stehenden Adresse kontaktierst.",
            },
            {
                title: "7. Datenschutz von Kindern",
                body: "LiftLog richtet sich nicht an Kinder unter 16 Jahren, und wir erheben wissentlich keine Informationen von ihnen.",
            },
            {
                title: "8. Änderungen dieser Richtlinie",
                body: "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung des Dienstes nach Inkrafttreten der Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.",
            },
            {
                title: "9. Kontakt",
                body: "Fragen zu dieser Datenschutzerklärung? Kontaktiere uns unter emdobbleu@gmail.com.",
            },
        ],
    },
    ja: {
        pageTitle: "プライバシーポリシー",
        lastUpdated: "最終更新日：2026年7月5日",
        intro: "本プライバシーポリシーでは、LiftLogが収集する情報の内容、その利用方法、および利用者の権利について説明します。",
        sections: [
            {
                title: "1. 収集する情報",
                body: "Google（Clerk経由）でサインインすると、氏名、メールアドレス、GoogleアカウントIDを取得します。LiftLogの利用時には、利用者が作成したトレーニングデータ（トレーニングセッション、種目、トレーニングの種類、セット（重量および回数））を保存します。",
            },
            {
                title: "2. 情報の利用方法",
                body: "これらの情報は、本サービスを提供する目的、すなわちアカウントの認証、および利用者自身のトレーニングデータの保存と表示のためにのみ使用します。データを販売したり、広告目的で利用することはありません。",
            },
            {
                title: "3. 第三者サービス",
                body: "LiftLogの運営には第三者プロバイダーを利用しています。認証にはClerk、アプリケーションのホスティングおよびデータベースストレージにはFly.ioを使用しています。これらのプロバイダーは、それぞれ独自のプライバシーおよびセキュリティ方針のもと、当方に代わってデータを処理します。",
            },
            {
                title: "4. データの保存とセキュリティ",
                body: "利用者のデータは、Fly.io上でホストされているPostgreSQLデータベースに保存されます。当方はデータ保護のために合理的な対策を講じますが、電子的な保存方法に完全な安全性を保証することはできません。",
            },
            {
                title: "5. ローカルストレージ",
                body: "LiftLogは、テーマおよび言語設定をブラウザのローカルストレージに保存します。この情報は利用者の端末内にとどまり、当方のサーバーには送信されません。",
            },
            {
                title: "6. 利用者の権利",
                body: "利用者はアプリ内でいつでも自身のトレーニングデータにアクセスし、編集することができます。下記の連絡先にご連絡いただくことで、アカウントおよび関連するすべてのデータの削除を依頼することができます。",
            },
            {
                title: "7. 児童のプライバシー",
                body: "LiftLogは16歳未満の児童を対象としておらず、児童から意図的に情報を収集することはありません。",
            },
            {
                title: "8. 本ポリシーの変更",
                body: "本プライバシーポリシーは随時更新される場合があります。変更の発効後も本サービスの利用を継続した場合、更新後のポリシーに同意したものとみなされます。",
            },
            {
                title: "9. お問い合わせ",
                body: "本プライバシーポリシーに関するご質問は、emdobbleu@gmail.com までご連絡ください。",
            },
        ],
    },
};

function PrivacyPolicyPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const lang = (i18n.language.split("-")[0] in content ? i18n.language.split("-")[0] : "en") as "en" | "de" | "ja";
    const { pageTitle, lastUpdated, intro, sections } = content[lang];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <PublicNavbar />
            <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft size={16} />
                    {t("legal_page.back_to_home")}
                </button>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
                    <p className="text-sm text-muted-foreground">{lastUpdated}</p>
                    <p className="text-sm text-muted-foreground pt-2">{intro}</p>
                </div>

                <div className="flex flex-col gap-6">
                    {sections.map(({ title, body }) => (
                        <section key={title} className="flex flex-col gap-1.5">
                            <h2 className="text-base font-semibold">{title}</h2>
                            <p className="text-sm text-muted-foreground">{body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;
