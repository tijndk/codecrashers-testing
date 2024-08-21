<?php
    // als formulier verstuurd is dan dit
    if (isset($_POST['genereren'])) {
        // als invoervelden niet leeg zijn, dan krijgen de variabelen de ingevoerde waarde als value
		$titel = !empty($_POST['titel']) ? htmlspecialchars($_POST['titel']) : '';
        $beschrijving = !empty($_POST['beschrijving']) ? htmlspecialchars($_POST['beschrijving']) : '';
        $hoofdkopje = !empty($_POST['hoofdkopje']) ? htmlspecialchars($_POST['hoofdkopje']) : '';
        $paragraaf = !empty($_POST['paragraaf']) ? htmlspecialchars($_POST['paragraaf']) : '';
        $afbeelding = !empty($_POST['afbeelding']) ? htmlspecialchars($_POST['afbeelding']) : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

        $achtergrondKleur = htmlspecialchars($_POST['achtergrondKleur']);
        $tekstKleur = htmlspecialchars($_POST['tekstKleur']);
        $tekstGrootte = !empty($_POST['tekstGrootte']) ? htmlspecialchars($_POST['tekstGrootte']) : 16;
        $letterType = !empty($_POST['letterType']) ? $_POST['letterType'] : '\'Times New Roman\', Times, serif';
        $afbeeldingBorder = isset($_POST['afbeeldingBorder']) ? htmlspecialchars($_POST['afbeeldingBorder']) : 'Geen border';

    // als formulier niet verstuurd is dan terugsturen naar index.php
    } else {
        header('Location: index.php');
        exit();
    }
?>
<!-- begin html pagina -->
<!DOCTYPE html>
<html lang="nl-NL">
	<head>
		<meta charset="utf-8">
		<title><?= $titel; ?></title>
		<meta name="description" content="<?= $beschrijving; ?>">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<style>
			body {
				background-color: <?= $achtergrondKleur; ?>;
				color: <?= $tekstKleur; ?>;
				font-size: <?= $tekstGrootte; ?>px;
				font-family: <?= $letterType; ?>;
			}
			<?php if ($afbeeldingBorder === 'ja') { ?>
				img {
					border: 2px solid black;
				}
			<?php } ?>
		</style>
	</head>
	<body>
		<h1><?= $hoofdkopje; ?></h1>
		<p><?= $paragraaf; ?></p>
		<img src="<?= $afbeelding; ?>" alt="user added image" style="max-width: 500px;height:auto;">
	</body>
</html>