<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body> <!-- en php on utilise "name" et pas l'ID , on l'utilise pour pouvoir envoyer les informations, l'ID est utilise en JavaScript -->
    <form action="" method="post">
        <table>
            <tr>
                <td>Email</td>
                <td>
                    <input type="text" name="txtEmail" id="">
                </td>
            </tr>
            <tr>
                <td>Mot de passe</td>
                <td>
                    <input type="password" name="txtMdp" id="">
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <input type="submit" name="btnLogin" value="Login"> <!-- on a utilise submit pour soumettre le formulaire au serveur -->
                </td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2">
                    <input type="checkbox" name="chkMemo" id="chkMemo">
                    <label for="chkMemo">Memoriser Email et mot de passe</label>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>