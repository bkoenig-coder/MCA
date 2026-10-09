# MailerLite setup for the Mongolian Center in Austria

## 1. Account and sender
1. Sign up at mailerlite.com (free plan to start). Use admin@mongoliancenter.org.
2. **Account → Domains**: add `mongoliancenter.org` and add the DNS records MailerLite shows (DKIM and SPF/CNAME) at your domain host (Hostinger → DNS). This keeps your emails out of spam.
3. **Account → Sender**: name "Mongolian Center in Austria", reply-to admin@mongoliancenter.org.
4. **Account settings → Company details**: association name and address as in the register (Schöpfleuthnergasse 25/45, 1210 Wien). This goes into every email footer (required).

## 2. List and consent
1. **Subscribers → Groups**: create "Website newsletter". Open it and copy the group ID from the web address (a long number).
2. **Subscribe settings**: switch **double opt-in** on, so each address is confirmed by email first.
3. Write the confirmation email in all four languages (see the texts below).

## 3. Connect the website
1. **Integrations → MailerLite API → Generate new token**. Keep it secret.
2. In Vercel (Project → Settings → Environment Variables) add:
   - `MAILERLITE_API_KEY` = the token
   - `MAILERLITE_GROUP_ID` = the group ID
   - Optional, to send per language: in MailerLite create a custom text field named `language` (Subscribers → Fields), then add `MAILERLITE_LANGUAGE_FIELD` = `1`
3. Redeploy, then subscribe once from the live site and confirm the email arrives.

## 4. First emails (copy and paste)

**Confirmation / welcome (EN)**
Subject: Welcome to the Mongolian Center in Austria
Thank you for joining our newsletter. We share events, news and community updates from Vienna and Mongolia. You can unsubscribe at any time with the link at the bottom of every email.

**Willkommen (DE)**
Betreff: Willkommen beim Mongolischen Zentrum in Österreich
Danke für Ihre Anmeldung zu unserem Newsletter. Wir informieren über Veranstaltungen, Neuigkeiten und die Gemeinschaft in Wien und der Mongolei. Sie können sich jederzeit über den Link am Ende jeder E-Mail abmelden.

**Тавтай морил (MN)**
Гарчиг: Австри дахь Монголын Төвд тавтай морил
Манай мэдээллийн товхимолд бүртгүүлсэнд баярлалаа. Бид Вена, Монголын арга хэмжээ, мэдээ мэдээллийг хуваалцана. Имэйл бүрийн доод талын холбоосоор хүссэн үедээ хасуулж болно.

**Hoş geldiniz (TR)**
Konu: Avusturya Moğol Merkezi’ne hoş geldiniz
Bültenimize abone olduğunuz için teşekkürler. Viyana ve Moğolistan’dan etkinlikleri, haberleri ve topluluk gelişmelerini paylaşıyoruz. Her e-postanın altındaki bağlantıyla istediğiniz zaman abonelikten çıkabilirsiniz.

## 5. Checklist before the first newsletter
- Privacy policy mentions MailerLite as the newsletter provider.
- Footer of every email has the association's name, address and an unsubscribe link (MailerLite adds the link).
- Only people who confirmed (double opt-in) get emails.
- Brand colours: blue #0066B3, deep blue #0A1128, gold #D4AF37, cream #F6EEDC; logo from `public/logo.png`.
