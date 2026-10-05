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
