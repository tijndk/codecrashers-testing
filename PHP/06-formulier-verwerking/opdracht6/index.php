<?php
    $titel = '';
	$beschrijving = '';
	$hoofdkopje = '';
	$paragraaf = '';
	$afbeelding = '';

	$achtergrondKleur = '#FFFFFF';
	$tekstKleur = '#000000';
	$tekstGrootte = 16;
	$letterType = '';
	$afbeeldingBorder = '';
?>
<!-- begin html pagina -->
<!DOCTYPE html>
<html lang="nl-NL">
	<head>
		<meta charset="utf-8">
		<title>Maak je pagina</title>
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<link rel="stylesheet" href="css/stylesheet.css">
	</head>
	<body>
        <!-- pagina maker formulier -->
        <form action="resultaat.php" method="post">
			<div style="grid-area:html;">
				<label for="titel">Titel van je pagina:</label>
				<input type="text" name="titel" id="titel" placeholder="Dit zie je bovenin het tabje" value="<?= $titel ?? '' ?>">

				<label for="beschrijving">Beschrijving van je pagina:</label>
				<input type="text" name="beschrijving" id="beschrijving" placeholder="Niet te zien op pagina zelf" value="<?= $beschrijving ?? '' ?>">

				<label for="hoofdkopje">Inhoud van je hoofdkopje:</label>
				<input type="text" name="hoofdkopje" id="hoofdkopje" placeholder="De kop/titel van je content" value="<?= $hoofdkopje ?? '' ?>">

				<label for="paragraaf">Inhoud van je paragraaf:</label>
				<textarea id="paragraaf" name="paragraaf" rows="8" cols="45"><?= $paragraaf ?? '' ?></textarea>

				<label for="afbeelding">Verwijzing naar een afbeelding:</label>
				<input type="text" name="afbeelding" id="afbeelding" placeholder="https://www.icegif.com/wp-content/uploads/2023/01/icegif-162.gif" value="<?= $afbeelding ?? '' ?>">
			</div>
			<div style="grid-area:css;">
			<label for="achtergrondKleur">Achtergrondkleur van je pagina:</label>
				<input type="color" name="achtergrondKleur" id="achtergrondKleur" value="<?= $achtergrondKleur ?? '' ?>">

				<label for="tekstKleur">Tekstkleur van je pagina:</label>
				<input type="color" name="tekstKleur" id="tekstKleur" value="<?= $tekstKleur ?? '' ?>">

				<label for="tekstGrootte">Standaard tekstgrootte van je pagina:</label>
				<input type="number" name="tekstGrootte" id="tekstGrootte" min="10" max="20" step="1" value="<?= $tekstGrootte ?? '' ?>">

				<label for="letterType">Lettertype van je pagina:</label>
				<select name="letterType" id="letterType" value="<?=$letterType;?>">
					<option value="'Times New Roman', Times, serif" <?=$letterType === '\'Times New Roman\', Times, serif' ? 'selected' : '';?>>Times New Roman</option>
					<option value="Arial, Helvetica, sans-serif" <?=$letterType === 'Arial, Helvetica, sans-serif' ? 'selected' : '';?>>Arial</option>
					<option value="'Comic Sans MS', 'Comic Sans', cursive" <?=$letterType === '\'Comic Sans MS\', \'Comic Sans\', cursive' ? 'selected' : '';?>>Comic Sans</option>
					<option value="'Courier New', Courier, monospace" <?=$letterType === '\'Courier New\', Courier, monospace' ? 'selected' : '';?>>Courier New (monospace)</option>
					<option value="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" <?=$letterType === 'Impact, Haettenschweiler, \'Arial Narrow Bold\', sans-serif' ? 'selected' : '';?>>Impact</option>
					</select>

				<label for="afbeeldingBorder">Border om je afbeelding?</label>
				<input type="checkbox" name="afbeeldingBorder" id="afbeeldingBorder" value="ja" <?= $afbeeldingBorder === 'ja' ? 'checked' : ''; ?>>
			</div>
				<input type="submit" name="genereren" value="Genereren" style="grid-area:genereren;">
        </form>



        <?php if (isset($_POST['genereren']) && count($errors) > 0){ ?>
            <ul>
                <?php foreach ($errors as $error){ ?>
                    <li class="red"><?= $error; ?></li>
                <?php } ?>
            </ul>
        <?php } ?>
	</body>
</html>