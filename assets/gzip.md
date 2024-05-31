```conf
  gzip on;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  gzip_comp_level 4;
  gzip_types text/plain application/x-javascript application/javascript text/javascript text/xml text/css;
  gzip_vary on;
```