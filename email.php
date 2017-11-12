<?php
require('ignored.php');
$PHONE_REGEXP = '/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/';
$EMAIL_REGEX = '/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/';

$data=file_get_contents('php://input');
if(isset($data) && $data != ""){
  try{
    $mObj = json_decode($data, true);
    if(!preg_match($PHONE_REGEXP,$mObj['phone'])){
      die('invalid phone:' . $mObj['phone']);
    }
    if(!filter_var($mObj['email'], FILTER_VALIDATE_EMAIL)){
      die('invalid email:' . $mObj['email']);
    }
    if(trim($mObj['name']) == ''){
      die('name is required');
    }
    if(trim($mObj['message']) == ''){
      die('message is required');
    }
    $mS = "Name: " . $mObj['name'] . " \r\n ";
    $mS .= "Company: " . $mObj['compName'] . " \r\n ";
    $mS .= "from Email: " . $mObj['email'] . " \r\n ";
    $mS .= "Phone: " . $mObj['phone'] . " \r\n ";
    $mS .="Message: " . $mObj['message'] . " \r\n ";

    mail($emailAddr,"IAD contact form from ".$mObj['name'], $mS) or die("email failed");

    echo "success";
  }catch(Exception $e){
    die("exception occurred");
  }
}else{
  die("no email data");
}
 ?>
