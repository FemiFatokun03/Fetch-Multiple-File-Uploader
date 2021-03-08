/***
    This file is used to :
    1. Handle click or drag and drop events to upload files.
    2. HAndle uploaded file.
    3. Make aynchronous request to server to upload file.
    4. Handle server or local error.
    5. Format page before and after upload.
    6. Make asynchronous request to server to retry upload after failure.
    7. Make asynchronous request to server to delete uploaded file if needed.

    
     Written By : Femi Fatokun.

     Github : www.github.com/FemiFatokun03
     Email : fatokunfemi3@gmail.com
     Whatsapp : +234 9047238648
***/

//This is a simple function that creates a short hand to get elements by id.
function id(x) {
    return document.getElementById(x);
}
//This function is used to format file size into readable string
function format_size(size) {
    if (size > 999) {
        if (size > 999999) {
            return `${Math.ceil(size / 1000000)}Mb`;
        } else {
            return `${Math.ceil(size / 1000)}Kb`;
        }
    } else {
        return `${size}Bytes`;
    }
}
//Assigning constant variables to the needed html elements, using the 'id' function

//Selcting the form element.
const form = id('file-upload-form');
//selcting the file input
const file = id('file');
//Creating an empty object to contain list of files that failed to upload.
const file_store = {};
//Creating an empty array to contain list of files that failed to delete.
const delete_files_store = [];
//Selecting the table that contains the list of selected files.
const div_to_contain = id('list-of-selected');
//Selecting the div that is responsible for recieving drag and dropped files.
const selector = id('fake_selector');
//Selecting the Check Icon from DOM
check_icon = id('check_icon').innerHTML;
//Selecting the Delete Icon from DOM
delete_image = id('delete_icon').innerHTML;
//Selecting the Refresh Icon from DOM
refresh_image = id('refresh_icon').innerHTML;
/*** 
    This function is used to :
    1. To format the list of selected files into a table, that contains filename, filesize and the upload status.
    2. Call the asynchronous function that is responsible for file upload.
    3. Call the function that is responsible for displaying status.
    4. Make sure that newly uploaded files are displayed at the top of the files list.
***/
const submit_function = () => {
    //Harnessing the files that are available in the file input
    const files = file.files;
    //Copy the available list of selected files in a variable incase new files are added.
    current_data = div_to_contain.innerHTML.trim();
    //Empty the files that were initially selected incase files are added.
    div_to_contain.innerHTML = "";
    /*** 
     This Loop is used to :
     * Display all the files selected.
     * Display the upload status.
     * Creating new form data for each file.
     * Sending each file at a time, to avoid server error.
            ***Most servers have a limit of files that are allowed to be uploaded at a time,
            So this loop sends each file at a time so the server wouldn't notice that multiple 
            files are uploaded at the same time.***
    ***/
    for (let index = 0; index < files.length; index++) {
        //Displaying the files selected.
        //Displaying file size.
        //Displaying the file upload status.
        div_to_contain.innerHTML += `
            <tbody name="each-file" class="each-file">
                <tr>
                    <td class="file-name"><p id="file-name">${files[index].name}</p></td>
                    <td class="file-s"><p id="file-size">${format_size(files[index].size)}</p></td>
                    <td><div id="file-status-icon" name="file-status-icon" class="font-container"><div class="loading"></div></td>
                </tr>
                <tr></tr>
            </tbody>`;
        //Creating form data.
        const formData = new FormData();
        //Adding the current file to the created file data
        formData.append('files', files[index]);
        //Calling the 'upload' asynchronous function for every every file, sending the created formdata as the parameter.
        upload(formData).then((res) => {
            //Recieving the new file name if file upload was successful.
            //Assigning the new file name as the id of the element that contains the file on the frontend.
            document.getElementsByName('each-file')[index].id = res.file_new_name;
            //Calling the 'log_response' function, to log format the page properly and display the upload status.
            log_response(true, res.file_new_name, res.file_new_name, index);
        }).catch((err) => {
            //Checking if the error is on frontend
            if (err == "Sorry an error occured") {
                //Generating a random number.
                each_id = Math.floor((Math.random() * 1000000000) + 1);
                //Assigning the generated number as the id of the element that contains the file on the frontend.
                document.getElementsByName('each-file')[index].id = each_id;
                //Calling the 'log_response' function, to log format the page properly and display the upload status.
                log_response(false, each_id, "Sorry an error occured", index);
                //Adding the file to the 'file_store' object incase if user wants to retry the upload
                file_store[`${each_id}-retry`] = files[index];
                //Checking if the request was successful but file upload failed.
            } else {
                //Assigning the random number recieved from server as the id of the element that contains the file on the frontend.
                document.getElementsByName('each-file')[index].id = err.msg[1];
                //Calling the 'log_response' function, to log format the page properly and display the upload status.
                log_response(false, err.msg[1], err.msg[0], index);
                //Adding the file to the 'file_store' object incase if user wants to retry the upload 
                file_store[`${err.msg[1]}-retry`] = files[index];
            }
        });
    }
    //Making sure that new files are displayed at the top of the list.
    div_to_contain.innerHTML += current_data;
}
/*** 
    This is an asychronous function used to :
    1. Send the file to the server.
    2. Handle server or client error.
***/
const upload = async (formData) => {
    //Making the needed fetch request using a promise so as to be able to handle errors properly.
    const to_return = await new Promise((resolve, reject) => {
        fetch('upload.php', {
            method: 'POST',
            body: formData
        }).then((res) => {
            res.json().then((json) => {
                //Consuming the Response.
                json.status == true ? resolve(json.msg) : reject(json);
            }).catch(err => reject("Sorry an error occured"))
        }).catch(err => reject("Sorry an error occured"))
        //Sending an error is the requested is not initialized after 10 seconds of call.
        setTimeout(() => { reject("Sorry an error occured") }, 10000);
    });
    return to_return;
}
/*** 
    This function is used to : 
    1. Recall the recall the asynchronous 'upload' funtion incase user want to retry upload.
    2. Call the function responsible for displaying upload status.
***/
const retry_upload = (file_id, id_gotten) => {
    //Assigning the file variable to the value of the appropriate property of the 'file_store' object.
    const file = file_store[file_id];
    //Getting the Tbody of the file that is being retried.
    each = id(id_gotten);
    //Selecting the element that indicated the upload status.
    content = each.children[0].children[2].children[0];
    content.innerHTML = "";
    //Adding loading animation to the element, to indicate that the file is currently being processed.
    content.innerHTML = "<div class='loading'></div>";
    //Creating a new form data to be re-uploaded to server. 
    new_form_data = new FormData();
    //Appending the 'file' to the created form date.
    new_form_data.append('files', file);
    //Calling the asynchronous 'upload' function , to upload the file again.
    upload(new_form_data).then((res) => {
        //Calling the 'log_response' function, to log format the page properly and display the upload status.
        log_response(true, id_gotten, res.file_new_name);
    }).catch((err) => {
        //Checking if the error is on frontend
        if (err == "Sorry an error occured") {
            //Calling the 'log_response' function, to log format the page properly and display the upload status.
            log_response(false, id_gotten, "Sorry an error occured");
            //Checking if the request was successful but file upload failed.
        } else {
            //Calling the 'log_response' function, to log format the page properly and display the upload status.
            log_response(false, id_gotten, err.msg[0]);
        }
    });
}
//This is the asynchronous function responsible for deleting uploaded files at user's will.
const delete_function = async (msg) => {
    //Using a promise to make request to the server to delete file and to also allow proper error handling.
    return await new Promise((resolve, reject) => {
        //Making the request
        fetch('delete.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'file_name': msg })
        }).then((res) => {
            res.json().then((json) => {
                json.status != "success" ? reject(json.msg) : resolve(json.msg);
            }).catch((err) => {
                delete_files_store.push(msg);
                reject(err);
            })
        }).catch((err) => {
            //Pushing the filename into the 'delete_files_store' array if the deletion was not successful.
            delete_files_store.push(msg);
            reject(err);
        })
    });
}
//This function is being called whenever the delete button is being clicked.
const delete_file = (id_gotten, msg) => {
    //Hiding the file from the list of uploaded files.
    id(`${id_gotten}`).style.display = "none";
    //Calling the asynchronous 'delete_function' function and sending the recieved filename as the parameter.
    delete_function(msg).then().catch();
}
//This function is used to delete files that are not successfully deleted after click.
const delete_per_interval = (file_store) => {
    //Check the see if there are files that were not successfully deleted.
    if (file_store.length > 0) {
        //Looping throught the 'file_store' array.
        for (index = 0; index < file_store.length; index++) {
            //Sending the delete function again to delete each of the files that failed to delete at first attempt.
            delete_function(file_store[index]).then().catch();
        }
    }
}
/*** 
    This function is used to :
    1. Format and display  list of uploaded files into table.
    2. Format the upload status.
***/
const log_response = (boo, id_gotten, msg) => {
    const delete_icon = `<button class="delete-refresh-btn" onclick="delete_file('${id_gotten}', '${msg}')">${delete_image}</button>`;
    const refresh_icon = `<button class="delete-refresh-btn" name="retry_btn" onclick="retry_upload('${id_gotten}-retry', '${id_gotten}')">${refresh_image}</button>`;
    //Getting the Tbody of the file that is being sent for indexing.
    each = id(id_gotten);
    //Selecting the element that indicated the upload status.
    content = each.children[0].children[2].children[0];
    //Checking if the upload was successful.
    if (boo == true) {
        content.innerHTML = "";
        //Adding the success icon and delete button to the status box if file upload was successful.
        content.innerHTML = check_icon + delete_icon;
        //Changing the status box background to lightgreen, which indicates success.
        content.style.background = "lightgreen";
        //Checking if the upload failed.
    } else {
        //Emptying the initial error contained in the error box.
        each.children[1].innerHTML = "";
        //Adding the new message.
        each.children[1].innerHTML = `<p class="error-display">${msg}</p>`;
        content.innerHTML = "";
        //Adding the success retry button to the status box if file was not successfully uploaded.
        content.innerHTML = refresh_icon;
        //Changing the status box background to reg, which indicates failure.
        content.style.background = "red";
    }
}
//Redirecting click event on the selector div to the file input button.
selector.addEventListener('click', (e) => {
    e.preventDefault();
    file.click();
});
//Overridding browser default behaviour for dragenter event.
function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}
//Overridding browser default behaviour for dragover event.
function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}
/*** 
    Overridding browser default behaviour for drop event.
    Recieving files contained in the drag event.
    Assigning the files recieved to the constant file variable.
    Calling the submit function the submit the files recieved from the drag event.
***/
function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    //Getting the files from the drop event.
    const dt = e.dataTransfer;
    //Assigning the gotten files to the 'files' variable.
    const files = dt.files;
    //Assigning the files recieved to the constant file variable.
    file.files = files;
    submit_function();
}

//Overridding browser default behaviour for dragenter event.
selector.addEventListener("dragenter", dragenter, false);
//Overridding browser default behaviour for dragover event.
selector.addEventListener("dragover", dragover, false);
//Overridding browser default behaviour for drop event.
selector.addEventListener("drop", drop, false);

//Calling the submit_function without the need of a click.
file.addEventListener('change', (e) => { e.preventDefault(); submit_function(); });

//Deleting stuck files after every 1 minute.
setInterval(() => { delete_per_interval(delete_files_store) }, 60000);
