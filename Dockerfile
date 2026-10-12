# Static portfolio + PHP contact form, served by Apache.
# The site itself is the prebuilt "dist" folder (rebuild with: npm install && npx gulp build).
FROM php:8.3-apache

# production PHP settings, gzip and cache headers
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && a2enmod headers expires deflate

COPY docker/site.conf /etc/apache2/conf-available/site.conf
COPY docker/demo.htpasswd /etc/apache2/demo.htpasswd
RUN a2enconf site

COPY dist/ /var/www/html/

# Hidden client preview (M-One redesign): reachable only by direct link, not linked from the portfolio.
# Built separately from the moneteam-redesign Astro project; kept outside dist/ because `gulp build` wipes dist/.
COPY moneteam/ /var/www/html/moneteam/

# Hidden sales demo (Implant52 dental clinic redesign): reachable only by direct link, not linked from the portfolio.
# Built separately from the implant52 Astro project (npx astro build, then copy dist/ here).
COPY implant52/ /var/www/html/implant52/

# Hidden sales demo (Akvilio dental network redesign), same rules as Implant52: direct link only, password, noindex.
# Built separately from the akvilio Astro project (npx astro build, then copy dist/ here).
COPY akvilio/ /var/www/html/akvilio/

# Private job list for Dasha (noindex): reachable only by direct link, not linked from the portfolio.
COPY jobsfordasha/ /var/www/html/jobsfordasha/

EXPOSE 80
