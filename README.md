# Fetch-Multiple-File-Uploader
Uses FETCH API to upload any amount of files at the same time.


DESCRIPTION

This widget/addon is used to upload multiple file to a server at the same time.

FEATURES.

1. Errors are properly handled.
2. Asynchronous design pattern to improver UX.
3. Fetch Api was used to allow faster upload.
4. Each file is sends a different request to a server, the benefit of this is that, the server at each request will
only record one filw upload.

INSTALLATION[USAGE]

1. Edit the 'config.php' file to match your details
2. Run the sql code in the 'uploads.sql' file on your database to create the needed table.
3. Add all the files into your project/web root.
4. Create an 'uploads' folder in your root, you can use any folder of your choice.
    Incase you want to use another folder, then you have to go and edit the folder name in
    upload.php on line 75.
    delete.php on line 36.
5. Make sure that all your files are linked correctly.


If you are encounter eny problem in installing this code please contact me.

Github : www.github.com/FemiFatokun03
Email : fatokunfemi3@gmail.com
Whatsapp : +234 9047238648
