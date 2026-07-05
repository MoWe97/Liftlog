import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import PublicNavbar from "@/components/public-navbar";

type Section = { title: string; body: string };
type LegalContent = { pageTitle: string; lastUpdated: string; intro: string; sections: Section[] };

const content: Record<"en" | "de" | "ja", LegalContent> = {
    en: {
        pageTitle: "Terms of Service",
        lastUpdated: "Last updated: July 5, 2026",
        intro: "Welcome to LiftLog. By creating an account or using LiftLog (\"the Service\"), you agree to these Terms of Service. If you do not agree, please do not use the Service.",
        sections: [
            {
                title: "1. The Service",
                body: "LiftLog is a personal workout tracking tool that lets you log training sessions, exercises, and sets. It is provided for personal, non-commercial use.",
            },
            {
                title: "2. Not Medical or Fitness Advice",
                body: "LiftLog does not provide medical, health, or fitness advice. Any exercises, weights, or routines you log are entered at your own discretion. Consult a qualified professional before starting or changing a training program. You are solely responsible for how you train and for any injury or harm that may result from your training.",
            },
            {
                title: "3. Accounts",
                body: "You sign in using a third-party authentication provider (Google, via Clerk). You are responsible for keeping your account credentials secure and for all activity that occurs under your account.",
            },
            {
                title: "4. Your Data",
                body: "You retain ownership of the workout data you enter into LiftLog. You may delete your account and associated data at any time by contacting us at the address below.",
            },
            {
                title: "5. Acceptable Use",
                body: "You agree not to misuse the Service, attempt to access another user's data, disrupt or interfere with the Service, or use it for any unlawful purpose.",
            },
            {
                title: "6. Service Provided “As Is”",
                body: "LiftLog is provided on an “as is” and “as available” basis, without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that data will never be lost. Please do not rely on LiftLog as your only record of important information.",
            },
            {
                title: "7. Limitation of Liability",
                body: "To the maximum extent permitted by law, LiftLog and its operator shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to personal injury, loss of data, or loss of profits.",
            },
            {
                title: "8. Termination",
                body: "You may stop using the Service and delete your account at any time. We may suspend or terminate accounts that violate these Terms.",
            },
            {
                title: "9. Changes to These Terms",
                body: "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.",
            },
            {
                title: "10. Contact",
                body: "Questions about these Terms? Contact us at emdobbleu@gmail.com.",
            },
        ],
    },
    de: {
        pageTitle: "Nutzungsbedingungen",
        lastUpdated: "Zuletzt aktualisiert: 5. Juli 2026",
        intro: "Willkommen bei LiftLog. Mit der Erstellung eines Kontos oder der Nutzung von LiftLog („der Dienst“) stimmst du diesen Nutzungsbedingungen zu. Wenn du nicht einverstanden bist, nutze den Dienst bitte nicht.",
        sections: [
            {
                title: "1. Der Dienst",
                body: "LiftLog ist ein persönliches Trainingstracking-Tool, mit dem du Trainingseinheiten, Übungen und Sets protokollieren kannst. Es ist für den persönlichen, nicht-kommerziellen Gebrauch bestimmt.",
            },
            {
                title: "2. Keine medizinische oder sportliche Beratung",
                body: "LiftLog bietet keine medizinische, gesundheitliche oder sportliche Beratung. Alle Übungen, Gewichte oder Trainingspläne, die du einträgst, erfolgen nach eigenem Ermessen. Konsultiere eine qualifizierte Fachperson, bevor du ein Trainingsprogramm beginnst oder änderst. Du bist allein verantwortlich für die Art, wie du trainierst, und für etwaige Verletzungen oder Schäden, die daraus entstehen können.",
            },
            {
                title: "3. Konten",
                body: "Du meldest dich über einen externen Authentifizierungsanbieter an (Google, über Clerk). Du bist dafür verantwortlich, deine Zugangsdaten sicher aufzubewahren, sowie für sämtliche Aktivitäten unter deinem Konto.",
            },
            {
                title: "4. Deine Daten",
                body: "Du behältst das Eigentum an den Trainingsdaten, die du in LiftLog einträgst. Du kannst dein Konto und die zugehörigen Daten jederzeit löschen lassen, indem du uns unter der unten stehenden Adresse kontaktierst.",
            },
            {
                title: "5. Zulässige Nutzung",
                body: "Du verpflichtest dich, den Dienst nicht zu missbrauchen, nicht zu versuchen, auf die Daten anderer Nutzer zuzugreifen, den Dienst nicht zu stören und ihn nicht für rechtswidrige Zwecke zu verwenden.",
            },
            {
                title: "6. Bereitstellung „wie besehen“",
                body: "LiftLog wird „wie besehen“ und „wie verfügbar“ bereitgestellt, ohne Gewährleistungen jeglicher Art, weder ausdrücklich noch stillschweigend. Wir garantieren nicht, dass der Dienst unterbrechungsfrei oder fehlerfrei ist oder dass Daten niemals verloren gehen. Bitte verlasse dich nicht ausschließlich auf LiftLog als Aufzeichnung wichtiger Informationen.",
            },
            {
                title: "7. Haftungsbeschränkung",
                body: "Im gesetzlich zulässigen Rahmen haften LiftLog und dessen Betreiber nicht für indirekte, zufällige oder Folgeschäden, die aus der Nutzung des Dienstes entstehen, einschließlich, aber nicht beschränkt auf Verletzungen, Datenverlust oder entgangenen Gewinn.",
            },
            {
                title: "8. Kündigung",
                body: "Du kannst die Nutzung des Dienstes jederzeit beenden und dein Konto löschen. Wir können Konten sperren oder kündigen, die gegen diese Bedingungen verstoßen.",
            },
            {
                title: "9. Änderungen dieser Bedingungen",
                body: "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung des Dienstes nach Inkrafttreten der Änderungen gilt als Zustimmung zu den aktualisierten Bedingungen.",
            },
            {
                title: "10. Kontakt",
                body: "Fragen zu diesen Bedingungen? Kontaktiere uns unter emdobbleu@gmail.com.",
            },
        ],
    },
    ja: {
        pageTitle: "利用規約",
        lastUpdated: "最終更新日：2026年7月5日",
        intro: "LiftLogへようこそ。アカウントを作成または LiftLog（以下「本サービス」）を利用することにより、本利用規約に同意したものとみなされます。同意されない場合は、本サービスをご利用にならないでください。",
        sections: [
            {
                title: "1. 本サービスについて",
                body: "LiftLogは、トレーニングセッション、種目、セットを記録できる個人向けのワークアウト記録ツールです。個人的かつ非商用の利用を目的として提供されます。",
            },
            {
                title: "2. 医療・フィットネスに関する助言ではありません",
                body: "LiftLogは医療、健康、またはフィットネスに関する助言を提供するものではありません。記録される種目、重量、トレーニングプログラムはすべて自己の判断により入力されます。トレーニングプログラムを開始または変更する前に、専門家にご相談ください。トレーニングの内容および、それに起因する怪我や損害について、利用者ご自身が全責任を負うものとします。",
            },
            {
                title: "3. アカウント",
                body: "本サービスへのサインインには、第三者の認証プロバイダー（Clerk経由のGoogle）を使用します。アカウント認証情報を安全に保管する責任、およびアカウント内で行われるすべての行為についての責任は利用者にあります。",
            },
            {
                title: "4. お客様のデータ",
                body: "LiftLogに入力したトレーニングデータの所有権は利用者に帰属します。下記の連絡先にご連絡いただくことで、いつでもアカウントおよび関連データを削除することができます。",
            },
            {
                title: "5. 適正利用",
                body: "本サービスを悪用しないこと、他の利用者のデータへのアクセスを試みないこと、本サービスの運営を妨害しないこと、また違法な目的で利用しないことに同意するものとします。",
            },
            {
                title: "6. 現状有姿での提供",
                body: "LiftLogは「現状有姿」および「提供可能な範囲」で提供され、明示または黙示を問わずいかなる保証も行いません。本サービスが中断なく、または欠陥なく提供されること、またデータが失われないことを保証するものではありません。重要な情報についてはLiftLogのみに依存しないようにしてください。",
            },
            {
                title: "7. 責任の制限",
                body: "法律で許容される最大限の範囲において、LiftLogおよびその運営者は、本サービスの利用に起因する間接的、付随的、または結果的損害（怪我、データの損失、利益の損失を含むがこれらに限られない）について責任を負わないものとします。",
            },
            {
                title: "8. 利用終了",
                body: "利用者はいつでも本サービスの利用を終了し、アカウントを削除することができます。本規約に違反したアカウントについては、当方が利用停止または削除を行う場合があります。",
            },
            {
                title: "9. 本規約の変更",
                body: "本規約は随時更新される場合があります。変更の発効後も本サービスの利用を継続した場合、更新後の規約に同意したものとみなされます。",
            },
            {
                title: "10. お問い合わせ",
                body: "本規約に関するご質問は、emdobbleu@gmail.com までご連絡ください。",
            },
        ],
    },
};

function TermsOfServicePage() {
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

export default TermsOfServicePage;
