<?php
    /*** 
     This File contains the database configuration.

     Written By : Femi Fatokun.

     Github : www.github.com/FemiFatokun03
     Email : fatokunfemi3@gmail.com
     Whatsapp : +234 9047238648
    ***/

    #Host Name, In most cases, 'localhost' is valid, 
    #but you can use any domain name incase you are using a different server for your database.
    $server = 'localhost';
    #This is the username of an account that has access to the database you want to use
    $user = 'root';
    #This contains the password of the database user you want to use.
    $pass = '';
    #The name of the database you want to use.
    $database = 'uploads';
    #Initializinf the connection.
    $connect = mysqli_connect($server, $user, $pass, $database);
    #Returning the status of the connecton.
    $connector = $connect ? $connect : false;

    /*** 
        If you are having any problem in connecting to your database server, please contact me.
        
        Github : www.github.com/FemiFatokun03
        Email : fatokunfemi3@gmail.com
        Whatsapp : +234 9047238648
    ***/
?>