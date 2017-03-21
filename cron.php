<?php

$host = 'test.carlostighe.com';
$port = '60315';
$cron = true; // Set $cron = false to Stop cron

if(@$_SERVER['SERVER_PORT'] > 1){
    die('Not accesible via the web !');
}

if($cron == true){
    $checkconn = @fsockopen($host, $port, $errno, $errstr, 5);
    if(empty($checkconn)){
        exec('export HOME=/home/carlosti/testnode; cd /home/carlosti/public_html/test; /home/carlosti/testnode/bin/npm start --production >> /home/carlosti/testnode/ghost60315.log 2>&1 &', $out, $ret);       
    }
}

?>