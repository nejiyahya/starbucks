<!DOCTYPE html>
<html lang="">
<head>
	<title>Starbuck Gamification</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Starbuck Gamification">
	<meta name="keywords" content="">
	<meta name="theme-color" content="#00693a">

	<link rel="shortcut icon" type="image/x-icon" href="assets/images/icon/favicon.ico" />
	<link rel="apple-touch-icon" href="assets/images/icon/touch-icon-iphone.png" />
	<link rel="apple-touch-icon" sizes="72x72" href="assets/images/icon/touch-icon-ipad.png" />
	<link rel="apple-touch-icon" sizes="114x114" href="assets/images/icon/touch-icon-iphone4.png" />

	<meta property='og:url' content=''>
	<meta property='og:title' content=''>
	<meta property='og:description' content=''>
	<meta property='og:site_name' content=''>
	<meta property='og:image' content=''>

	<link rel='stylesheet' type='text/css' href='assets/css/critical.min.css'>
	<link rel='stylesheet' type='text/css' href='assets/css/app.min.css'>
    <link rel='stylesheet' type='text/css' href='assets/css/game.css'>
    <style>
        body{
            overflow: auto;
        }
        .hero-content,#app{
            height: auto;
        }
    </style>
</head>
<body>
	
	<!-- SITE BLOCK -->
	<div id="app" class="site u-images u-images--cover" style="background-image: url('assets/images/starbucks-cover.jpg')">

		<!-- HEADER BLOCK -->
		<header class="header">
			<!-- MENU COMPONENT -->
			<div class="menu">
				<div class="container u-flexbox h-100">

					<a href="index.html" class="menu__brand ml-auto">
						<img src="assets/images/icon/starbucks-logomark.png" alt="">
					</a>

				</div>
			</div>
		</header>

		<!-- MAIN BLOCk -->
		<div class="main main--done">
			<div class="container text-center u-title u-figure">
				<!-- HERO COMPONENT -->
				<div class="hero-content">
					<!-- HEADER COMPONENT -->
					<div class="hero-content__top">
						<h3 class="text-primary u-font u-font--big mb-2">Congrats,</h3>
						<h2>
							Your <span class="text-primary">art in a cup</span> design is here
						</h2>
					</div>
					<!-- GENERATE COMPONENT -->
					<div class="hero-content__generate">
						<figure>
                            <div class="modalCup result">
                                <img src="assets/images/<?= $_GET['layout'];?>/tutup.png" alt="" class="tutup">
                                <img src="assets/images/<?= $_GET['layout'];?>/cup.png" alt="" class="cup">
                                <div id="modalStage" style="-webkit-mask-image: url(assets/images/<?= $_GET['layout'];?>/masking_cup.png);">
                                    <div>
                                        <div class="cup_wrapper animated zoomIn" id="layoutStage">
                                            <img src="gallery/result_art_<?= $_GET['id'];?>.png" alt="" class="result layout">
                                        </div>
                                        <div id="cupResult"></div>
                                    </div>
                                </div>
                            </div>
						</figure>
						<div class="icon position-absolute u-flexbox">
							<a href="gallery/result_cup_<?= $_GET["id"]; ?>.png" download="starbucks.png" class="mb-3" target="_blank">
								<div class="u-flexbox justify-content-center mb-1">
									<img src="assets/images/icon/download.svg" alt="">
								</div>
								Download
							</a>
							<a href="" target="_blank" id="BtnPrint">
								<div class="u-flexbox justify-content-center mb-1">
									<img src="assets/images/icon/printer-tool.svg" alt="">
								</div>
								Print this
							</a>
						</div>
					</div>
					<!-- DESCRIPTION COMPONENT -->
					<div class="hero-content__description mt-2">
						<h2 class="mb-0">screenshot <span class="text-primary">and show to our barista</span></h2>
						<p class="mb-3">to <span class="text-primary">SAVE 20%</span> on these beverages.</p>
						<small>*Valid until 20 March 2019. <a href="">Click here</a> for T&amp;C</small>
						<ul class="share u-flexbox justify-content-center my-3">
							<li class="divided">Share : </li>
							<li>
								<a href="" target="_blank" class="link u-background--primary u-flexbox justify-content-center">
									<i class="fab fa-twitter"></i>
								</a>
							</li>
							<li>
								<a href="" target="_blank" class="u-background--primary u-flexbox justify-content-center">
									<i class="fab fa-facebook-f"></i>
								</a>
							</li>
							<li>
								<a href="" target="_blank" class="u-background--primary u-flexbox justify-content-center">
									<i class="fab fa-instagram"></i>
								</a>
							</li>
						</ul>
						<figure>
							<img src="assets/images/your-prize.png" alt="">
						</figure>
					</div>
				</div>
			</div>
		</div>

		<!-- FOOTER BLOCK -->
		<footer class="footer">
			<div class="container text-center">
				<div class="footer__copy">
					&copy; 2019. <a href="http://www.starbucks.co.id/" target="_blank">Starbucks Indonesia</a>
				</div>
			</div>
		</footer>
	</div>

	<script src='public/jquery/jquery.min.js'></script>
	<script src='public/bootstrap/bootstrap.bundle.min.js'></script>
    <script src='public/print.min.js'></script>
	<script src='assets/js/app.min.js'></script>
    <script src="public/html2canvas.js" type="text/javascript"></script>

    <script>

        $(document).ready(function(){
            document.getElementById("BtnPrint").addEventListener("click",function (e) {
                e.preventDefault();

                printJS({
                    printable: 'gallery/result_cup_<?= $_GET["id"]; ?>.png',
                    type: 'image',
                    imageStyle: 'width:280px;margin:0 auto;'
                })
            })

            <?php
                if(!file_exists("gallery/result/cup_".$_GET["id"].".png")){
            ?>
                html2canvas($(".modalCup.result"), {
                    allowTaint: true,
                    foreignObjectRendering:true,
                    onrendered: function(canvas) {
                        var dataURL = canvas.toDataURL();
                        console.log(dataURL);
                        $.ajax({
                            url: 'saveImage.php',
                            type: 'post',
                            dataType: 'json',
                            data: {
                                imageArt: dataURL,
                                type:"cup",
                                layout:"assets/images/<?=$_GET['layout'];?>",
                                "userID":"<?=$_GET['id'];?>"
                            },
                            success: function(response) {

                            }
                        });
                    }
                });
            <?php
                }
            ?>
        })
    </script>
</body>
</html>