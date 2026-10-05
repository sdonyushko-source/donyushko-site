# donyushko.ru

Портфолио Сергея Донюшко: статический двуязычный сайт (RU/EN) и PHP-форма обратной связи.

## Структура

- `app/` — исходники (Pug, Stylus, JS, картинки)
- `gulp-tasks/`, `gulpfile.js`, `package.json` — сборка
- `dist/` — готовый сайт, его и раздаёт сервер (в репозитории лежит собранная версия)
- `Dockerfile`, `docker/site.conf` — образ PHP + Apache для App Platform

## Пересобрать сайт

```bash
npm install
npx gulp build
```

После сборки закоммитьте обновлённую папку `dist/`.

## Форма контактов

`dist/contacts.php` отправляет заявку в Telegram, если заданы переменные окружения:

- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather (хранить только в «Переменных» приложения, не в коде)
- `TELEGRAM_CHAT_ID` — id чата, в который бот пишет заявки

Если переменных нет, используется `mail()` (подходит для обычного хостинга с почтой).

## Деплой (Timeweb Cloud → App Platform)

1. Залить репозиторий на GitHub.
2. App Platform → Создать → выбрать репозиторий, тип «Dockerfile», порт 80.
3. В «Переменных» добавить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
4. В настройках приложения привязать домен `donyushko.ru`, включить SSL (Let's Encrypt).
