#!/bin/sh
# Writes the password file for /crypto/ from the app variables, then starts Apache as the base image does.
if [ -n "$CRYPTO_USER" ] && [ -n "$CRYPTO_PASS" ]; then
  htpasswd -cbB /etc/apache2/crypto.htpasswd "$CRYPTO_USER" "$CRYPTO_PASS" >/dev/null 2>&1
else
  : > /etc/apache2/crypto.htpasswd
fi
exec apache2-foreground
