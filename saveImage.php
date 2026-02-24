<?php
    function imagealphamask( &$picture, $mask ) {
        // Get sizes and set up new picture
        $xSize = imagesx( $picture );
        $ySize = imagesy( $picture );
        $newPicture = imagecreatetruecolor( $xSize, $ySize );
        imagesavealpha( $newPicture, true );
        imagefill( $newPicture, 0, 0, imagecolorallocatealpha( $newPicture, 0, 0, 0, 127 ) );

        // Resize mask if necessary
        if( $xSize != imagesx( $mask ) || $ySize != imagesy( $mask ) ) {
            $tempPic = imagecreatetruecolor( $xSize, $ySize );
            imagecopyresampled( $tempPic, $mask, 0, 0, 0, 0, $xSize, $ySize, imagesx( $mask ), imagesy( $mask ) );
            imagedestroy( $mask );
            $mask = $tempPic;
        }

        // Perform pixel-based alpha map application
        for( $x = 0; $x < $xSize; $x++ ) {
            for( $y = 0; $y < $ySize; $y++ ) {
                $alpha = imagecolorsforindex( $mask, imagecolorat( $mask, $x, $y ) );
                $color = imagecolorsforindex( $picture, imagecolorat( $picture, $x, $y ) );
                $alpha = 127 - floor((127-$color['alpha']) * ($alpha[ 'red' ]/255));
                imagesetpixel( $newPicture, $x, $y, imagecolorallocatealpha( $newPicture, $color[ 'red' ], $color[ 'green' ], $color[ 'blue' ], $alpha ) );
            }
        }

        // Copy back to original picture
        imagedestroy( $picture );
        $picture = $newPicture;
    }

    function imageDecode($data){
        $arr = array();
        $arr['status']='success';

        if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
        $data = substr($data, strpos($data, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif
            if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
                $arr['status']='failed';
                $arr['message'] = 'invalid image type';
                echo json_encode($arr);
                die();
            }

            $arr['message'] = base64_decode($data);
            $arr['type'] = $type;

            if ($data === false) {
                $arr['status']='failed';
                $arr['message'] = 'base64_decode failed';
                echo json_encode($arr);
                die();
            }
        } else {
            $arr['status']='failed';
            $arr['message'] = 'did not match data URI with image data';
            echo json_encode($arr);
            die();
        }

        return $arr;
    }

    $arr = array();
    $dataArt = $_POST["imageArt"];
    $layout = $_POST["layout"];

    $id = isset($_POST["userID"])?$_POST["userID"]:"";

    $decodeArt = imageDecode($dataArt);

    if($decodeArt['status'] == "failed"){
        echo json_encode($decodeArt);
        die();
    }

    try{
        file_put_contents("gallery/temp_{$_POST["type"]}_".$id.".{$decodeArt['type']}", $decodeArt['message']);
        header( "Content-type: image/png");

        $source_art = imagecreatefrompng( "gallery/temp_{$_POST["type"]}_".$id.".{$decodeArt['type']}" );
        if($_POST["type"] == "art"){
            $mask = imagecreatefrompng( $layout."/masking.png" );
        }
        else{
            $mask = imagecreatefrompng( $layout."/mask_cup.png" );
        }

        imagealphamask( $source_art, $mask );
        imagepng($source_art,"gallery/result_{$_POST["type"]}_".$id.".png");

         unlink("gallery/temp_{$_POST["type"]}_".$id.".{$decodeArt['type']}");
    }catch (ErrorException $e) {
        $arr['message'] = $e;
    }

    $arr['message']='success';
    $split = explode("/",$layout);
    $arr['layout']=$split[count($split)-1];
    echo json_encode($arr);