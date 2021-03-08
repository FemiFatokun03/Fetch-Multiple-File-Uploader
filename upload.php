<?php 
    /*** 
     This file isused to :
     1. Recieve the uploaded file from the asynchronous 'upload' function in 'uploader.js' file.
     2. Process and validate the recieved file.
     3. Create new unique file name to avoid override.
     4. Save file details in database.
     5. Move file to a folder on the backend.
     6. Send needed JSON response.

     Written By : Femi Fatokun.

     Github : www.github.com/FemiFatokun03
     Email : fatokunfemi3@gmail.com
     Whatsapp : +234 9047238648
    ***/

    #This function is the overall function used to perform all the needed processes concerning the file.
    function file_uploader($file){
        #Include the database connection file
        include 'config.php';
        
        #Getting needing file details.
        #File temporary name
        $tmp_name = $file['tmp_name'];
        #File name
        $name = $file['name'];
        #File Size
        $size = $file['size'];
        #File type
        $type = $file['type'];
        #Upload error
        $error = $file['error'];
        
        #Sending back a JSON error if the there is an Internal Server error.
        if ($error > 0){
            $send_back = ['status' => false, 'msg' => ['Sorry an error occured', rand(1000, 10000), $tmp_name]];
            header('Content-Type: application/json');
            echo json_encode($send_back);
        #Continue processing file it there was no Internal error.
        }else{
            #Check if file size is greater than 5mb
            /*** 
             * You can use any file size here, but the default value for this code is 5mb.
             * If changing the value, make sure that you change the value of the max_post_size variable in your php.ini file too.
            ***/
            if ($size <= 52428800) {
                #Getting the file extension.
                $path = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                #Checking if extension is valid.
                /*** 
                 * The Default file extensions allowed are of image file types.
                 * You can change the file types to correspond to the file types that you want to use this code for.
                ***/
                if (in_array($path, ['png', 'jpg', 'jpeg', 'pneg', 'gif', 'svg'])) {
                    #Sedning back a JSON response if database connection failed
                    if ($connector == false) {
                        $send_back = ['status' => false, 'msg' => ['Sorry an error occured', rand(10000, 100000)]];
                        header('Content-Type: application/json');
                        echo json_encode($send_back);
                    }else{
                        #Consuming and sanitizing the name of the file
                        $file_name = strip_tags(mysqli_real_escape_string($connector, $name));
                        #Creating new name for the file in order to avoind overwriting.
                        $name_in_directory = uniqid($name, true).'-'.rand(10000, 1000000).'-'.$size.'.'.$path;
                        #Query to insert file into database.
                        $query = "INSERT INTO files(file_name, name_in_directory)VALUES('$file_name', '$name_in_directory')";
                        #Checking if file details were added to the database successfully.
                        if (mysqli_query($connector, $query)) {
                            #Uploading file to a folder on the server.
                            /*** 
                             * You can use any folder you want.
                             * In this case our folder is 'uploads' folder in the root directory
                             ***/
                            if (move_uploaded_file($tmp_name, 'uploads/'.$name_in_directory)) {
                                #Sending back a JSON success
                                $send_back = ['status' => true, 'msg' => ['file_new_name' => $name_in_directory]];
                                header('Content-Type: application/json');
                                echo json_encode($send_back);
                            #Checking if file was not moved to folder
                            }else{
                                #Deleting file details from database if file was not moved to folder.
                                $query = "DELETE FROM files WHERE name_in_directory='$name_in_directory'";
                                mysqli_query($connector, $query);
                                #Sending back a JSON error.
                                $send_back = ['status' => false, 'msg' => 'error'];
                                header('Content-Type: application/json');
                                echo json_encode($send_back);
                            }
                        #Sending back a JSON error if file details was not added to databse successfully.
                        }else{
                            $send_back = ['status' => false, 'msg' => ['Sorry an error occured', rand(1000, 10000)]];
                            header('Content-Type: application/json');
                            echo json_encode($send_back);
                        }
                    }
                #Sending back a JSON response if file type is not allowed.
                }else{
                    $send_back = ['status' => false, 'msg' => ['Invalid file type', rand(100000, 1000000)]];
                    header('Content-Type: application/json');
                    echo json_encode($send_back);
                }
            #Sending back JSON response if file size was too large
            }else{
                $send_back = ['status' => false, 'msg' => ['Size is too large', rand(1000000, 10000000)]];
                header('Content-Type: application/json');
                echo json_encode($send_back);
            }
        }
    }
    #Initializing the 'file_uploader' function
    file_uploader($_FILES['files']);
?>