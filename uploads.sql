/*** 
  This file contains the sql queries needed to create the files table that is very vital in this snippet.

  Written By : Femi Fatokun.

  Github : www.github.com/FemiFatokun03
  Email : fatokunfemi3@gmail.com
  Whatsapp : +234 9047238648
***/
CREATE TABLE `files` (
  `id` int(255) NOT NULL,
  `file_name` varchar(10000) NOT NULL,
  `name_in_directory` varchar(10000) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `files`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;