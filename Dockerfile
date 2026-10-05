# Static portfolio + PHP contact form, served by Apache.
# The site itself is the prebuilt "dist" folder (rebuild with: npm install && npx gulp build).
FROM php:8.3-apache

# production PHP settings, gzip and cache headers
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && a2enmod headers expires deflate

COPY docker/site.conf /etc/apache2/conf-available/site.conf
RUN a2enconf site

COPY dist/ /var/www/html/

EXPOSE 80
