<?php
    /*** 
     This file isused to :
     1. Recieve the filename from the asynchronous 'delete_function' function in 'uploader.js' file.
     2. Delete file details from database.
     3. Delete file from 'uploads' folder.

     Written By : Femi Fatokun.

     Github : www.github.com/FemiFatokun03
     Email : fatokunfemi3@gmail.com
     Whatsapp : +234 9047238648
    ***/

    #Getting the request content-type(JSON is being expected)
    $contenttype = $_SERVER['CONTENT_TYPE'] == 'application/json' ? trim($_SERVER['CONTENT_TYPE']) : "";
    
    #Include the database connection file
    include 'config.php';
    #Check if request content-type is valid
    if($contenttype == 'application/json'){
        #Recieving and decoding the request content.
        $file_path_from_request = json_decode(file_get_contents('php://input'), true);
        #Extracting filename out of the decoded data
        $file_path_from_request = $file_path_from_request['file_name'];
        #Sedning back a JSON response if database connection failed
        if ($connector == false) {
            $data_to_send = ['status' => false, 'msg' => 'Sorry an error occured'];
            header('Content-Type: application/json');
            echo json_encode($data_to_send);
        }else{
            #Removing file details from the database
            $query = "DELETE FROM files WHERE name_in_directory='$file_path_from_request'";
            if (mysqli_query($connector, $query)) {
                #Deleting the file from the 'uploads' folder
                if (unlink('uploads/'.$file_path_from_request)) {
                    #Sending a success JSON if the file was deleted successfuly.
                    $data_to_send = ['status' => true, 'msg' => 'success'];
                    header('Content-Type: application/json');
                    echo json_encode($data_to_send);
                #Sending a JSON error if the file was not removed successfully
                }else{
                    $data_to_send = ['status' => false, 'msg' => 'Sorry an error occured'];
                    header('Content-Type: application/json');
                    echo json_encode($data_to_send);
                }
            #Sending JSON error is the file was not removed from database successfully.
            }else{
                $data_to_send = ['status' => false, 'msg' => 'Sorry an error occured'];
                header('Content-Type: application/json');
                echo json_encode($data_to_send);
            }
        }
    #Send a JSON error if the request content-type is invalid
    }else{
        $data_to_send = ['status' => false, 'msg' => 'Sorry an error occured'];
        header('Content-Type: application/json');
        echo json_encode($data_to_send);
    }