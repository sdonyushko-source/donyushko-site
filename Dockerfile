# Static portfolio + PHP contact form, served by Apache.
# The site itself is the prebuilt "dist" folder (rebuild with: npm install && npx gulp build).
FROM php:8.3-apache

# production PHP settings, gzip and cache headers
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && a2enmod headers expires deflate

COPY docker/site.conf /etc/apache2/conf-available/site.conf
RUN a2enconf site

COPY dist/ /var/www/html/

# Hidden client preview (M-One redesign): reachable only by direct link, not linked from the portfolio.
# Built separately from the moneteam-redesign Astro project; kept outside dist/ because `gulp build` wipes dist/.
COPY moneteam/ /var/www/html/moneteam/

# Hidden sales demo (Implant52 dental clinic redesign): reachable only by direct link, not linked from the portfolio.
# Built separately from the implant52 Astro project (npx astro build, then copy dist/ here).
COPY implant52/ /var/www/html/implant52/

# Hidden sales demo (Akvilio dental network redesign), same rules as Implant52: direct link only, noindex.
# Built separately from the akvilio Astro project (npx astro build, then copy dist/ here).
COPY akvilio/ /var/www/html/akvilio/

# Hidden sales demo (Семейная стоматология Волоховой redesign), same rules as Implant52: direct link only, noindex.
# Built separately from the volokhova Astro project (npx astro build, then copy dist/ here).
COPY volokhova/ /var/www/html/volokhova/

# Hidden demo ("Гараж" fight club landing): direct link only, noindex, no password (no client assets inside).
# Built separately from the garazh Astro project (npx astro build, then copy dist/ here).
COPY garazh/ /var/www/html/garazh/

# Hidden case page (Rexi App Store screenshots, for job applications): direct link only, noindex, no password.
# Static page; App Store creatives are rendered from the rexi-appstore project.
COPY appstore/ /var/www/html/appstore/

# Hidden client prototype (Hi,Life wireframe: structure and copy, no design yet): direct link only, noindex, no password.
# Built separately from the hilife Astro project (npm run build, then copy dist/ here).
COPY hilife/ /var/www/html/hilife/

# Hidden pitch demo (S&O IP home page prototypes: v1, v2): direct link only, noindex, no password.
# Static pages from the "S&O IP/demo" folder.
COPY so-ip/ /var/www/html/so-ip/

# Private job list for Dasha (noindex): reachable only by direct link, not linked from the portfolio.
COPY jobsfordasha/ /var/www/html/jobsfordasha/

EXPOSE 80
