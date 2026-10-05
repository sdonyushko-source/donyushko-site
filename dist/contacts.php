<?php

    // Contact form handler.
    //  - validates and escapes the input, drops bot submissions (hidden "website" field),
    //  - limits how often one visitor can send a message,
    //  - delivers the message to Telegram when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set
    //    (App Platform / Docker: set them as environment variables),
    //    otherwise falls back to e-mail via mail() (classic shared hosting),
    //  - redirects back with ?sent=1 or ?error=1 so a refresh never re-sends the message.
    if (isset($_POST['send'])) {

        $field = function ($key, $max = 2000) {
            $value = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
            return substr($value, 0, $max);
        };
        $esc = function ($value) {
            return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        };
        $back = function ($flag) {
            header('Location: contacts.php?' . $flag . '=1');
            exit;
        };

        // Honeypot: real visitors never see or fill this field
        if ($field('website') !== '') {
            $back('sent');
        }

        $name = $field('name', 200);
        $phone = $field('phone', 100);
        $email = $field('email', 200);
        $company = $field('company', 200);
        $comment = $field('comment');

        if ($name === '' || $phone === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $back('error');
        }

        // One message per visitor every 30 seconds
        $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
        $stamp = sys_get_temp_dir() . '/contact-form-' . md5($ip);
        if (is_file($stamp) && time() - (int) @filemtime($stamp) < 30) {
            $back('error');
        }
        @touch($stamp);

        $subject = 'Заявка с сайта donyushko.ru';
        $token = getenv('TELEGRAM_BOT_TOKEN');
        $chatId = getenv('TELEGRAM_CHAT_ID');
        $sent = false;

        if ($token && $chatId) {
            $text = "<b>" . $esc($subject) . "</b>\n\n"
                . "Имя: " . $esc($name) . "\n"
                . "Телефон: " . $esc($phone) . "\n"
                . "Почта: " . $esc($email) . "\n"
                . "Компания: " . $esc($company) . "\n"
                . "Комментарий: " . $esc($comment);

            $query = http_build_query([
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => 'true',
            ]);

            if (function_exists('curl_init')) {
                $ch = curl_init('https://api.telegram.org/bot' . $token . '/sendMessage');
                curl_setopt_array($ch, [
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => $query,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CONNECTTIMEOUT => 5,
                    CURLOPT_TIMEOUT => 10,
                ]);
                $response = curl_exec($ch);
                $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                $sent = ($response !== false && $code === 200);
            }
        } else {
            // E-mail fallback (works on regular shared hosting)
            $to = 's.donyushko@gmail.com';
            $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

            // The validated e-mail cannot contain line breaks, so it is safe to use in a header
            $headers = "From: sergey@donyushko.ru\r\n"
                . "Reply-To: " . $email . "\r\n"
                . "MIME-Version: 1.0\r\n"
                . "Content-type: text/html; charset=utf-8";

            $mailBody = "<!DOCTYPE html>
            <html lang='ru'>
              <head>
                <meta charset='UTF-8'>
                <title>" . $esc($subject) . "</title>
              </head>
              <body>
                <p>Имя: " . $esc($name) . "</p>
                <p>Телефон: " . $esc($phone) . "</p>
                <p>Адрес электронной почты: " . $esc($email) . "</p>
                <p>Название компании: " . $esc($company) . "</p>
                <p>Комментарий: " . nl2br($esc($comment)) . "</p>
              </body>
            </html>";

            $sent = mail($to, $encodedSubject, $mailBody, $headers);
        }

        $back($sent ? 'sent' : 'error');
    }

?>
<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Связаться с Сергеем Донюшко: Telegram @donyushko, почта и форма обратной связи."><meta property="og:type" content="website"><meta property="og:site_name" content="Sergey Donyushko"><meta property="og:description" content="Связаться с Сергеем Донюшко: Telegram @donyushko, почта и форма обратной связи."><meta property="og:image" content="https://donyushko.ru/images/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/png" href="images/favicon.png"><link rel="stylesheet" href="css/common.css?v=20261005"><link rel="stylesheet" href="css/contacts.css?v=20261005"><title>Contact — Sergey Donyushko, Product Designer</title></head><body><div class="page-effect"><div class="section section_logo section_clickable"><div class="section__wrap"><a href="index.php"><span class="section section_logo"><span class="section__wrap"><span class="section-logo"><span class="logo"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="42" viewBox="0 0 80 42">
    <path fill="#1b1b1b" fill-rule="evenodd" d="M0 0h80v42H0V0zm15 29.407h6.468c1.322 0 2.53-.2 3.624-.599 1.094-.4 2.034-.971 2.821-1.715a7.76 7.76 0 0 0 1.83-2.656c.432-1.026.649-2.158.649-3.395 0-1.238-.213-2.366-.638-3.384a7.53 7.53 0 0 0-1.817-2.632c-.787-.736-1.724-1.304-2.81-1.704-1.085-.399-2.29-.599-3.611-.599H15v16.684zm3.517-3.102v-10.48h2.786c1.118 0 2.085.212 2.904.635a4.47 4.47 0 0 1 1.888 1.809c.441.783.661 1.715.661 2.796 0 1.081-.22 2.013-.66 2.797a4.47 4.47 0 0 1-1.89 1.809c-.818.423-1.785.634-2.903.634h-2.786zm20.185 3.455c.944 0 1.813-.165 2.608-.494a6.268 6.268 0 0 0 2.078-1.386 6.427 6.427 0 0 0 1.38-2.091c.331-.8.496-1.669.496-2.609s-.16-1.805-.484-2.596a6.263 6.263 0 0 0-1.357-2.068 6.257 6.257 0 0 0-2.054-1.375 6.605 6.605 0 0 0-2.573-.493c-.944 0-1.814.164-2.609.493a6.268 6.268 0 0 0-2.077 1.386 6.46 6.46 0 0 0-1.381 2.08c-.33.791-.496 1.657-.496 2.597s.162 1.81.484 2.608a6.234 6.234 0 0 0 1.358 2.08 6.257 6.257 0 0 0 2.053 1.374 6.605 6.605 0 0 0 2.574.494zm.047-2.961a2.837 2.837 0 0 1-1.605-.47 3.3 3.3 0 0 1-1.122-1.28c-.275-.541-.413-1.156-.413-1.845 0-.69.138-1.305.413-1.845a3.3 3.3 0 0 1 1.122-1.28 2.837 2.837 0 0 1 1.605-.47c.598 0 1.133.156 1.605.47a3.3 3.3 0 0 1 1.121 1.28c.276.54.414 1.155.414 1.845 0 .689-.138 1.304-.414 1.844a3.3 3.3 0 0 1-1.12 1.281 2.837 2.837 0 0 1-1.606.47zm8.687 2.608h3.305v-7.12c0-.517.11-.979.33-1.386.221-.408.52-.725.898-.952.378-.227.818-.34 1.322-.34.692 0 1.235.246 1.629.74.393.493.59 1.17.59 2.032v7.026h3.305v-7.449c0-1.08-.189-2.02-.567-2.82-.377-.799-.909-1.413-1.593-1.844-.685-.431-1.483-.646-2.396-.646-.819 0-1.547.176-2.184.528a3.958 3.958 0 0 0-1.499 1.422L50.482 17h-3.046v12.407zm14.023 0h3.305V17h-3.305v12.407zm0-14.097h3.305V12h-3.305v3.31z"/>
</svg>
</span></span></span></span></a></div></div><section class="section section_menu"><div class="section__wrap"><div class="section-menu"><div class="section-menu__menu-top"><div class="menu"><div class="menu__menu-tabs en"><a class="menu__tab" href="projects.php">My projects</a><a class="menu__tab" href="about.php">My experience</a><a class="menu__tab" href="contacts.php">Contact</a></div><div class="menu__menu-tabs ru"><a class="menu__tab" href="projects.php">Мои проекты</a><a class="menu__tab" href="about.php">Мой опыт</a><a class="menu__tab" href="contacts.php">Связаться</a></div></div></div><div class="section-menu__language en"><button class="button button_lang">RU</button></div><div class="section-menu__language ru"><button class="button button_lang">EN</button></div><button class="burger" type="button" aria-label="Menu" aria-expanded="false"><span class="burger__line"></span><span class="burger__line"></span><span class="burger__line"></span></button></div></div><div class="mobile-menu"><button class="mobile-menu__close" type="button" aria-label="Close"><span class="mobile-menu__close-line"></span><span class="mobile-menu__close-line"></span></button><nav class="mobile-menu__nav"><div class="menu"><div class="menu__menu-tabs en"><a class="menu__tab" href="projects.php">My projects</a><a class="menu__tab" href="about.php">My experience</a><a class="menu__tab" href="contacts.php">Contact</a></div><div class="menu__menu-tabs ru"><a class="menu__tab" href="projects.php">Мои проекты</a><a class="menu__tab" href="about.php">Мой опыт</a><a class="menu__tab" href="contacts.php">Связаться</a></div></div></nav><div class="mobile-menu__language en"><button class="button button_lang">RU</button></div><div class="mobile-menu__language ru"><button class="button button_lang">EN</button></div></div></section><section class="section section_contacts en"><div class="section__wrap section__wrap_right"><div class="section-contacts"><form class="section-contacts__send-request" method="POST"><input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="form-note form-note_sent" hidden>Thank you! Your message has been sent, I will get back to you soon.</p><p class="form-note form-note_error" hidden>Something went wrong. Please check the fields or write to me on Telegram: @donyushko.</p><div class="content-left"><p><span class="content-left__bold">Contact.</span> Send me a message with your details.</p><!--+e.services--><!--	+e.P.headline Choose the service you are interested in.--><!--	+e.service-buttons--><!--		+e.buttons-row--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Website--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Mobile app--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") UX/UI Service--><!--		+e.buttons-row--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Analysis--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Prototype--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Illustration--><!--		+e.buttons-row--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Animation--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") HTML/CSS--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Frontend / Backend--><!--		+e.INPUT.services-input(type="hidden" name="services")--></div><div class="section-contacts__information"><div class="section-contacts__send-information"><p class="section-contacts__headline">Write to me</p><div class="section-contacts__contact-fields"><div class="section-contacts__contacts-row"><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_required" id="name-en" required="required" name="name" placeholder=" " type="text"/><label class="contact-input__placeholder" for="name-en"><span class="contact-input__text contact-input__text_required">Your name</span><span class="contact-input__dot contact-input__dot_required">&#729;</span></label></div></div><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_required" id="email-en" required="required" name="email" type="email" placeholder=" "/><label class="contact-input__placeholder" for="email-en"><span class="contact-input__text contact-input__text_required">Your email</span><span class="contact-input__dot contact-input__dot_required">&#729;</span></label></div></div></div><div class="section-contacts__contacts-row"><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_required" id="phone-en" required="required" name="phone" placeholder=" " type="text"/><label class="contact-input__placeholder" for="phone-en"><span class="contact-input__text contact-input__text_required">Your phone number</span><span class="contact-input__dot contact-input__dot_required">&#729;</span></label></div></div><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field" id="company-en" name="company" placeholder=" " type="text"/><label class="contact-input__placeholder" for="company-en"><span class="contact-input__text">Name company</span></label></div></div></div><div class="section-contacts__contacts-row"><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_long" id="comment-en" name="comment" placeholder=" " type="text"/><label class="contact-input__placeholder" for="comment-en"><span class="contact-input__text">Your comment</span></label></div></div></div></div></div><div class="section-contacts__contact-information"><p class="section-contacts__headline">My contact information</p><div class="section-contacts__my-contacts"><div class="section-contacts__my-contact-row"><p class="section-contacts__contact-name">Phone</p><p class="section-contacts__contact-value">+7 987 542-72-25</p></div><div class="section-contacts__my-contact-row"><p class="section-contacts__contact-name">Email</p><p class="section-contacts__contact-value">s.donyushko@gmail.com</p></div><div class="section-contacts__my-contact-row"><p class="section-contacts__contact-name">Telegram</p><p class="section-contacts__contact-value">@donyushko</p></div></div></div></div><div class="section-contacts__send"><button class="button button button_send" type="submit" name="send"><div class="button__text">Send</div><div class="button__svg-picture"><svg class="button__arrow" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 16"><path fill-rule="nonzero" d="M17.49 8.102l-6.71-6.778L12.09 0 21 9l-8.91 9-1.31-1.324 6.636-6.703H0V8.102z"></path></svg></div></button></div></form></div></div></section><section class="section section_contacts ru"><div class="section__wrap"><div class="section-contacts"><form class="section-contacts__send-request" method="POST"><input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><p class="form-note form-note_sent" hidden>Спасибо! Сообщение отправлено, я скоро отвечу.</p><p class="form-note form-note_error" hidden>Не получилось отправить. Проверьте поля или напишите мне в Telegram: @donyushko.</p><div class="content-left"><p><span class="content-left__bold">Связаться.</span> Отправьте сообщение со своими данными.</p></div><!--+e.services--><!--	+e.P.headline Выберите заинтересовавший вас сервис.--><!--	+e.service-buttons--><!--		+e.buttons-row--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Веб сайты--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Мобильные приложения--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") UX/UI Сервис--><!--		+e.buttons-row--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Аналитика--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Прототипирование--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Иллюстрация--><!--		+e.buttons-row--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Анимаци--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") HTML/CSS--><!--			+e.tag--><!--				+b.BUTTON.service-tag(type="button") Frontend / Backend--><!--		+e.INPUT.services-input(type="hidden" name="services")--><div class="section-contacts__information"><div class="section-contacts__send-information"><p class="section-contacts__headline">Напишите мне</p><div class="section-contacts__contact-fields"><div class="section-contacts__contacts-row"><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_required" id="name-ru" required="required" name="name" placeholder=" " type="text"/><label class="contact-input__placeholder" for="name-ru"><span class="contact-input__text contact-input__text_required">Ваше имя</span><span class="contact-input__dot contact-input__dot_required">&#729;</span></label></div></div><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_required" id="email-ru" required="required" name="email" type="email" placeholder=" "/><label class="contact-input__placeholder" for="email-ru"><span class="contact-input__text contact-input__text_required">Ваш электронный адрес</span><span class="contact-input__dot contact-input__dot_required">&#729;</span></label></div></div></div><div class="section-contacts__contacts-row"><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_required" id="phone-ru" required="required" name="phone" placeholder=" " type="text"/><label class="contact-input__placeholder" for="phone-ru"><span class="contact-input__text contact-input__text_required">Ваш телефон</span><span class="contact-input__dot contact-input__dot_required">&#729;</span></label></div></div><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field" id="company-ru" name="company" placeholder=" " type="text"/><label class="contact-input__placeholder" for="company-ru"><span class="contact-input__text" lang="ru">Название компании</span></label></div></div></div><div class="section-contacts__contacts-row"><div class="section-contacts__field"><div class="contact-input"><input class="contact-input__input-field contact-input__input-field_long" id="comment-ru" name="comment" placeholder=" " type="text"/><label class="contact-input__placeholder" for="comment-ru"><span class="contact-input__text">Ваш комментарий</span></label></div></div></div></div></div><div class="section-contacts__contact-information"><p class="section-contacts__headline">Мои контакты</p><div class="section-contacts__my-contacts"><div class="section-contacts__my-contact-row"><p class="section-contacts__contact-name">Телефон</p><p class="section-contacts__contact-value">+7 987 542-72-25</p></div><div class="section-contacts__my-contact-row"><p class="section-contacts__contact-name">Email</p><p class="section-contacts__contact-value">s.donyushko@gmail.com</p></div><div class="section-contacts__my-contact-row"><p class="section-contacts__contact-name">Telegram</p><p class="section-contacts__contact-value">@donyushko</p></div></div></div></div><div class="section-contacts__send"><button class="button button button_send" type="submit" name="send"><div class="button__text">Отправить</div><div class="button__svg-picture"><svg class="button__arrow" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 16"><path fill-rule="nonzero" d="M17.49 8.102l-6.71-6.778L12.09 0 21 9l-8.91 9-1.31-1.324 6.636-6.703H0V8.102z"></path></svg></div></button></div></form></div></div></section><section class="section section_footer section_clickable"><div class="section__wrap"><div class="section-footer section-footer_clickable"><div class="section-footer__logo-menu"><a class="section-footer__logo" href="index.php"><span class="logo"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="42" viewBox="0 0 80 42">
    <path fill="#1b1b1b" fill-rule="evenodd" d="M0 0h80v42H0V0zm15 29.407h6.468c1.322 0 2.53-.2 3.624-.599 1.094-.4 2.034-.971 2.821-1.715a7.76 7.76 0 0 0 1.83-2.656c.432-1.026.649-2.158.649-3.395 0-1.238-.213-2.366-.638-3.384a7.53 7.53 0 0 0-1.817-2.632c-.787-.736-1.724-1.304-2.81-1.704-1.085-.399-2.29-.599-3.611-.599H15v16.684zm3.517-3.102v-10.48h2.786c1.118 0 2.085.212 2.904.635a4.47 4.47 0 0 1 1.888 1.809c.441.783.661 1.715.661 2.796 0 1.081-.22 2.013-.66 2.797a4.47 4.47 0 0 1-1.89 1.809c-.818.423-1.785.634-2.903.634h-2.786zm20.185 3.455c.944 0 1.813-.165 2.608-.494a6.268 6.268 0 0 0 2.078-1.386 6.427 6.427 0 0 0 1.38-2.091c.331-.8.496-1.669.496-2.609s-.16-1.805-.484-2.596a6.263 6.263 0 0 0-1.357-2.068 6.257 6.257 0 0 0-2.054-1.375 6.605 6.605 0 0 0-2.573-.493c-.944 0-1.814.164-2.609.493a6.268 6.268 0 0 0-2.077 1.386 6.46 6.46 0 0 0-1.381 2.08c-.33.791-.496 1.657-.496 2.597s.162 1.81.484 2.608a6.234 6.234 0 0 0 1.358 2.08 6.257 6.257 0 0 0 2.053 1.374 6.605 6.605 0 0 0 2.574.494zm.047-2.961a2.837 2.837 0 0 1-1.605-.47 3.3 3.3 0 0 1-1.122-1.28c-.275-.541-.413-1.156-.413-1.845 0-.69.138-1.305.413-1.845a3.3 3.3 0 0 1 1.122-1.28 2.837 2.837 0 0 1 1.605-.47c.598 0 1.133.156 1.605.47a3.3 3.3 0 0 1 1.121 1.28c.276.54.414 1.155.414 1.845 0 .689-.138 1.304-.414 1.844a3.3 3.3 0 0 1-1.12 1.281 2.837 2.837 0 0 1-1.606.47zm8.687 2.608h3.305v-7.12c0-.517.11-.979.33-1.386.221-.408.52-.725.898-.952.378-.227.818-.34 1.322-.34.692 0 1.235.246 1.629.74.393.493.59 1.17.59 2.032v7.026h3.305v-7.449c0-1.08-.189-2.02-.567-2.82-.377-.799-.909-1.413-1.593-1.844-.685-.431-1.483-.646-2.396-.646-.819 0-1.547.176-2.184.528a3.958 3.958 0 0 0-1.499 1.422L50.482 17h-3.046v12.407zm14.023 0h3.305V17h-3.305v12.407zm0-14.097h3.305V12h-3.305v3.31z"/>
</svg>
</span></a><div class="section-footer__menu-bottom"><div class="menu"><div class="menu__menu-tabs en"><a class="menu__tab" href="projects.php">My projects</a><a class="menu__tab" href="about.php">My experience</a><a class="menu__tab" href="policy-en.html">Privacy policy</a></div><div class="menu__menu-tabs ru"><a class="menu__tab" href="projects.php">Мои проекты</a><a class="menu__tab" href="about.php">Мой опыт</a><a class="menu__tab" href="policy-ru.html">Политика конфиденциальности</a></div></div></div></div><div class="section-footer__network-lang"><div class="section-footer__network-icons"><div class="networks"><a class="networks__icon" href="https://www.linkedin.com/in/sergey-donyushko-4a7173165/" target="_blank" rel="noopener"><img src="images/networks/linkedin.png" alt="" role="presentation"/></a><a class="networks__icon" href="https://t.me/donyushko" target="_blank" rel="noopener"><img src="images/networks/telegram.png" alt="" role="presentation"/></a><a class="networks__icon" href="https://vk.com/donyushko" target="_blank" rel="noopener"><img src="images/networks/vkontakte.png" alt="" role="presentation"/></a></div></div><div class="section-footer__language en"><button class="button button_lang">RU</button></div><div class="section-footer__language ru"><button class="button button_lang">EN</button></div></div></div></div></section></div><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script><script type="text/javascript" src="js/common.js?v=20261005"></script><script type="text/javascript" src="js/contacts.js?v=20261005"></script></body></html>