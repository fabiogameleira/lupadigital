echo on
drush sql-dump --result-file=c:\web\lupadigital\backup\lupadigital-%date:~6,4%%date:~3,2%%date:~0,2%.sql
