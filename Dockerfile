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

# Private job list for Dasha (noindex): reachable only by direct link, not linked from the portfolio.
COPY jobsfordasha/ /var/www/html/jobsfordasha/

EXPOSE 80
