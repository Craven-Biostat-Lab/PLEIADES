<!DOCTYPE html>
<html>
<head>
<style>
body {background-color: #fff3f0;
font-family:Tahoma,Verdana,Segoe,sans-serif;
font-size:14px;}

.go-top {
    position: absolute;    
    text-decoration: none;
    color: white;
    display: none;
    background-color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    padding: 10px;    
    margin: 0;    
}

.go-top:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    text-decoration: none;
}

#Results {
padding-top: 5px;
width:100%;
}

#TableReslts {
position:absolute
overflow:scroll;
width:50%;
float:left;
}

#ArticleDiv {
width:49%; 
float:right;
}

tr.exp:nth-child(odd) { background-color: #eae0ff; }
tr.exp:nth-child(even) { background-color: #d6c1ff; }

</style>
</head>

<body>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" type="text/javascript"></script>
<script src="divPagination.js" type="text/javascript"></script>
<script src="TextHighlighter.js" type="text/javascript"></script>
<script>
// Show or hide the sticky 'Back_to_Top' button 
jQuery(function ($) {

var car = {};
car.wheels = 4;
car.doors = 2;
car.sound = 'vroom';
car.name = 'Lightning McQueen';
console.log( car );
localStorage.setItem( 'car', JSON.stringify(car) );
console.log( JSON.parse( localStorage.getItem( 'car' ) ) );

$("#TableReslts").scroll(function() {                 
    if ($(this).scrollTop() > 200) {        
        $('.go-top').fadeIn(500);        
    } else {
        $('.go-top').fadeOut(300);
    }
});
});

function placeBtn() {
  var position =  $("#TableReslts").position()  
  $('.go-top').css({ top: (position.top + $("#TableReslts").height() - 50) });
  $('.go-top').css({ left: (position.left + $("#TableReslts").width() - 110) }); 
}

function resizeDiv() {
    var height = $(window).height() - 75; 
    $("#TableReslts").height(height);
    var height1 = $(window).height() - 115;
    $("#ArticleDiv").height(height1);  
}

$(window).resize(function() {
    resizeDiv()
    placeBtn()    
});

$(window).load(function() {
    resizeDiv()
    placeBtn()
});
</script>

<div id="header">
    <a href="/" style="position:fixed;top:0;right:0;"><h4>Search Again!</h4></a>
</div>

<div id="Results">
    <h2>Search Results</h2>
    <div id="TableReslts" style="overflow:scroll;">
        <table style="width:150%">
        %for each_pmid in pmcid_det:
          <tr class="exp">
            <td>
                <ul>
                    <li>
                        <b>{{each_pmid["_id"]["Title"]}}</b> <br />
                        {{each_pmid["_id"]["Authors"]}} <br />
                        <i>{{each_pmid["_id"]["FullJournalName"]}}</i> {{each_pmid["_id"]["PubDate"]}}, {{each_pmid["_id"]["Volume"]}}: {{each_pmid["_id"]["Pages"]}}  &nbsp <a href="/articles/PMC{{each_pmid['_id']['PMCID']}}/PMC{{each_pmid['_id']['PMCID']}}.html" target="_blank">PMC{{each_pmid["_id"]["PMCID"]}} </a> &nbsp <a href="/articles/PMC{{each_pmid['_id']['PMCID']}}/PMC{{each_pmid['_id']['PMCID']}}.html" class="show_hide" id="#slidingDiv_{{each_pmid['_id']['PMCID']}}" target="myiFrame"> Show Datums </a> <br />
                        <div class="hidden_div" id="slidingDiv_{{each_pmid['_id']['PMCID']}}" style="margin-top:10px; border-bottom:5px; solid #3399FF; display:none;">
                            <form id="{{each_pmid['_id']['PMCID']}}">
                                <div class="paginate">                        
                                    <ul id="datumList_{{each_pmid['_id']['PMCID']}}" style="list-style-type: none;">                                                                            
                                        %for each_datum in each_pmid["Datums"]:
                                            <li id="{{each_pmid['_id']['PMCID']}}_{{each_datum['sr_no']}}">
                                                <table style="width:100%">                                                    
                                                    <tr> 
                                                        <td width="10%">
                                                        <input type="checkbox" name="del_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="Yes"> Delete? &nbsp &nbsp
                                                        </td>                                           
                                                        <td width="18%">                                                                                     
                                                        %if 'subject' in each_datum["map"]:
                                                            <!-- <b>Subject:</b> &nbsp -->
                                                            <input type="checkbox" name="subchk_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="Yes" class="chk_evid"> &nbsp
                                                            <input type="text" name="sub_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="{{each_datum['map']['subject'][0]['Entity']['strings']}}" placeholder="{{each_datum['map']['subject'][0]['Entity']['strings']}}"> &nbsp &nbsp 
                                                        %end                                                
                                                        </td>
                                                        <td width="18%">
                                                        %if 'assay' in each_datum["map"]:
                                                            <!-- <b>Assay:</b> &nbsp -->
                                                            <input type="checkbox" name="asschk_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="Yes" class="chk_evid"> &nbsp
                                                            <input type="text" name="ass_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="{{each_datum['map']['assay'][0]['Text']}}" placeholder="{{each_datum['map']['assay'][0]['Text']}}"> &nbsp &nbsp
                                                        %end
                                                        </td>
                                                        <td width="18%">
                                                        %if 'change' in each_datum["map"]:
                                                            <!-- <b>Change:</b> &nbsp -->
                                                            <input type="checkbox" name="chnchk_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="Yes" class="chk_evid"> &nbsp 
                                                            <input type="text" name="chn_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="{{each_datum['map']['change'][0]['Text']}}" placeholder="{{each_datum['map']['change'][0]['Text']}}"> &nbsp &nbsp 
                                                        %end
                                                        </td>
                                                        <td width="18%">
                                                        %if 'treatment' in each_datum["map"]:
                                                            <!-- <b>Treatment:</b> &nbsp -->
                                                            <input type="checkbox" name="trtchk_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="Yes" class="chk_evid"> &nbsp
                                                            <input type="text" name="trt_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" value="{{each_datum['map']['treatment'][0]['Entity']['strings']}}" placeholder="{{each_datum['map']['treatment'][0]['Entity']['strings']}}"> &nbsp &nbsp
                                                        %end
                                                        </td>
                                                        <td width="18%">
                                                        <button type="button" class="show_evidence" name="shwevid_{{each_datum['sr_no']}}_{{each_pmid['_id']['PMCID']}}" disabled="disabled">Show Evidence</button> &nbsp &nbsp 
                                                         
                                                        </td>                                                    
                                                    </tr>
                                                </table>
                                            </li>
                                        %end                                    
                                    </ul> 
                                    <input type="submit" id="Submit" name="Submit" value="Submit"> 
                                    <span id="result_{{each_pmid['_id']['PMCID']}}" width="250px"></span>   &nbsp &nbsp &nbsp &nbsp 
                                    <a href="javascript:void()" id="insert-more"> Add New Datum </a>  <br>                                             
                                </div>
                            </form>
                        </div>
                    </li>
                </ul>
            </td>
          </tr>
        %end
        </table>     
    </div>

    <a href="#" class="go-top">Back to top</a>

    <div id="ArticleDiv">
        <b><input type="checkbox" name="unhighlight" id="unhighlight" value="white" disabled="disabled">UnHighlight &nbsp &nbsp &nbsp <input type="submit" id="SubmitHigh" name="SubmitHigh" value="Submit Highlight Changes" disabled="disabled"></b> &nbsp &nbsp &nbsp <span id="result_high" width="250px"></span> <br><br>
        <iframe name="myiFrame" id="myiFrame" width="100%" height="100%"></iframe> 
    </div>

</div>

</body>
</html>
