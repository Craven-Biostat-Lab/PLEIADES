<!DOCTYPE html>
<html>
<head>
<style>
body {background-color:lightblue;
font-family:Tahoma,Verdana,Segoe,sans-serif;
font-size:14px;}

#header {
    background-color:black;
    color:white;
    text-align:center;
    padding:5px;
}
#Subject {
padding-bottom: 25px;

}
#Assay {

padding-bottom: 25px;
}
#Change {
padding-bottom: 25px;

}
#Treatment {
padding-bottom: 25px;

}
#footer {
    background-color:black;
    color:white;
    clear:both;
    text-align:center;
    padding:5px;
}

</style>
</head>
<body>

<form accept-charset="UTF-8" action="/datum" method="POST">

<div id="header">
<h1 style="color:lightblue">PLEIADES Extracted Datum Browser</h1>
</div>
<br>
<div id="rank">
    <h2>Rank Datums</h2>
    <table>
        <tr style="width:100%"> 
            <td width="250px">
            <input type="radio" name="rank_by" value="expected" checked> Expected number of datums &nbsp &nbsp
            </td> 
        </tr>
        <tr style="width:100%">                                          
            <td width="250px">                                                                                     
            <input type="radio" name="rank_by" value="uncertainty"> Most uncertainty about datums &nbsp &nbsp                                               
            </td>
        </tr>
    </table>
</div>
<hr>

<div id="Subject">
<h2>Subject</h2>

<input type="text" name="subject" size="40" maxlength="30">

</div>
<hr>

<div id="Assay">
<h2>Assay</h2>
<input type="checkbox" name="assay_phos" value="phos">Phosphorylation<br>
<input type="checkbox" name="assay_copp" value="copptby">Coprecipitation<br>
<input type="checkbox" name="assay_ubiq" value="ubiq">Ubiquitination<br>
<input type="checkbox" name="assay_gtp" value="GTP-association">GTP association<br>

</div>
<hr>

<div id="Change">
<h2>Change</h2>
<input type="checkbox" name="change_inc" value="increased">Increased<br>
<input type="checkbox" name="change_dec" value="decreased">Decreased<br>
<input type="checkbox" name="change_unc" value="unchanged">Unchanged<br>
<input type="checkbox" name="change_detunc" value="det_unch">Detectable but unchanged<br>
<input type="checkbox" name="change_det" value="detect">Detectable<br>
<input type="checkbox" name="change_undet" value="undetect">Undetectable<br>

</div>
<hr>

<div id="Treatment">
<h2>Treatment</h2>

<input type="text" name="treatment" size="40" maxlength="30">

</div>
<hr>
<br>

<div>
<input type="submit" id="search" value="Search" style="width: 100px; height: 40px">
</div>

<br><br><br>
<div id="footer">
University of Wisconsin - Madison
</div>
<br>
</form>

</body>
</html>
