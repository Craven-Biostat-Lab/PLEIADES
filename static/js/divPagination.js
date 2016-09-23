jQuery(document).ready(function($) {   
           
    var $db = "Divya"                
      
    // Animate the scroll to top
    $('.go-top').click(function(event) {
        event.preventDefault();

        $('#TableReslts').animate({scrollTop: 0}, 300);
    });

    $('.chk_evid').click(function(){
        var $parentform = $(this).parents('form:first');         
        var $inputs = $("#"+ $parentform.attr("id") + " input.chk_evid:checkbox")    //$('input:checkbox')
        var chkbx_name = $(this).attr('name');
        var arr = chkbx_name.split("_");
        if($(this).is(':checked')){
            $inputs.not(this).prop('disabled',true); // <-- disable all but checked one
            document.getElementsByName('shwevid_' + arr[1] + "_" + arr[2])[0].disabled = false; // <-- enable the corresponding show_evidence button
        }else{
            $inputs.prop('disabled',false); // <-- enable all checkboxes in the form
            document.getElementById('unhighlight').disabled = true;
            document.getElementById('SubmitHigh').disabled = true;
            document.getElementsByName('shwevid_' + arr[1] + '_' + arr[2])[0].disabled = true; // <-- disable the corresponding show_evidence button
        }
    });

    $(function(){
        var iframe = document.getElementById('myiFrame'), 
            extsrno,
            extpmcid,
            extfield,           
            hltr;

        $('.show_hide').click(function(event) {
            //alert("Saswati")
            var lnk_id = $(this).attr('id');            
            extpmcid = lnk_id.split("_")[1]; 
            hltr = undefined;           

            var options = {
                speed: 100, // speed you want the toggle to happen    
                easing: '', // the animation effect you want. Remove this line if you dont want an effect and if you haven't included jQuery UI
                changeText: 1, // if you dont want the button text to change, set this to 0
                showText: 'Show Datums', // the button text to show when a div is closed
                hideText: 'Hide Datums' // the button text to show when a div is open
            };

            // this var stores which link you've clicked
            var toggleClick = $(this);
            // this reads the rel attribute of the link to determine which div id to toggle
            var toggleDiv = $(this).attr('id');

            $('.hidden_div').not($(toggleDiv)).filter(':visible').each(function(){
                var $childform = $(this).children('form');
                $(this).siblings('.show_hide').text(options.showText);                
                //$("#"+ $childform.attr("id") + " input.chk_evid[type=checkbox]:checked").removeAttr('checked');   //Uncheck all checked checkboxes of a particular class           
                //$("#"+ $childform.attr("id") + " input.chk_evid:checkbox").prop('disabled',false);    // Enable all checkboxes of a particular class, within a form
                //$("#"+ $childform.attr("id") + " button.show_evidence").prop('disabled',true);    // Disable all buttons of a particular class, within a form                
                $(this).slideUp(100);
            });

            // here we toggle show/hide the correct div at the right speed and using which easing effect
            $(toggleDiv).slideToggle(options.speed, options.easing, function () {
                // this only fires once the animation is completed
                if (options.changeText == 1) {
                    $(toggleDiv).is(":visible") ? toggleClick.text(options.hideText) : toggleClick.text(options.showText);
                }               
            });  
            //console.log("show_hide_click:: The PMCID is: " + extpmcid)   
            document.getElementById('unhighlight').disabled = true;
            document.getElementById('SubmitHigh').disabled = true;                        
        });
            

        $('.show_evidence').click(function(event){
            //alert("Saswati")
            var btn_name = $(this).attr('name');
            var arr = btn_name.split("_");
            var localpmcid = arr[2];
            extsrno = arr[1];
            if(localpmcid != extpmcid)
            {
                alert("Something went wrong! Please click on the 'Hide Datums' link of the current article and then click on 'Show Datums' again.")
            }
            hltr = new TextHighlighter(iframe.contentDocument.body);
            hltr.setColor("yellow");   
            //console.log("show_evidence_click:: The PMCID is: " + extpmcid + " The serial no of the datum is: " + extsrno) 

            var $parentform = $(this).parents('form:first'); 
            $("#"+ $parentform.attr("id") + " input:checkbox:checked").each(function() {
                // This code should only run once for now, as the user can click on only one checkbox at a time within a form
                var chkbx_name = $(this).attr('name');
                var arr1 = chkbx_name.split("_");
                var localpmcid1 = arr1[2];
                var localsrno = arr1[1];                
                if(localpmcid1 != extpmcid && localsrno != extsrno)
                {
                    alert("Something went wrong! Please click on the 'Hide Datums' link of the current article and then click on 'Show Datums' again.")
                } 

                var field = arr1[0].substr(0,3)
                switch (field) {
                    case "sub":
                        extfield = "subject";
                        break;
                    case "ass":
                        extfield = "assay";
                        break;
                    case "chn":
                        extfield = "change";
                        break;
                    case "trt":
                        extfield = "treatment";
                        break;
                }
                //console.log("show_evidence_click:: The PMCID is: " + extpmcid + " The serial no of the datum is: " + extsrno + " The field name is: " + extfield)
            
                //Render highlights: TBD                        

            });
            
            document.getElementById('unhighlight').disabled = false;
            document.getElementById('SubmitHigh').disabled = false;
         
        });


        $("#unhighlight").change(function() {            
            if (hltr) {
                //alert("Divya")
                if(this.checked) {
                   hltr.setColor("white");
                }
                else {
                   hltr.setColor("yellow");
                }
            }
        });

        
        $("#SubmitHigh").click(function() {
            $( "#result_high" ).text( "Highlight changes were submitted!" ).show().fadeOut( 2000 );
        });

    });

    $('body').delegate('#insert-more', 'click', function(e) {
        //alert("Saswati")
        var parent_ul = $(this).siblings('ul:first')
        console.log("The id of the ul element is: " + parent_ul.attr("id"))
        var last = $(this).siblings('ul:first').children('li:visible:last');
        console.log("The id of the last visible li element is: " + last.attr("id")) 
        var $form = $(this).parents('form:first');
        var $pmcid = $form.attr("id")
        console.log("PMCID: " + $pmcid)
        var max_srno = 0;
        $("#"+parent_ul.attr("id")+" li").each(function(){
            //console.log("List element id: " + this.id)
            num = parseInt(this.id.split("_")[1],10);
            if(num > max_srno)
            {
               max_srno = num;
            }
        });   
        console.log("Maximum sr. no: " + max_srno)            
        $('#'+last.attr("id")).after("<li id='"+$pmcid+"_"+(max_srno+1)+"' class='new'>" +
            "<table>" +
                "<tr style='width:100%'>" +
                    "<td>" +
                    "<input type='checkbox' name='del_"+(max_srno+1)+"_"+$pmcid+"' value='Yes'> Delete? &nbsp &nbsp" +
                    "</td>" +                                           
                    "<td width='250px'>" +                                                                                                                
                        "<b>Subject:</b> &nbsp <input type='text' name='sub_"+(max_srno+1)+"_"+$pmcid+"' value='' placeholder=''> &nbsp &nbsp " +                                                                      
                    "</td>" +
                    "<td width='250px'>" +                           
                        "<b>Assay:</b> &nbsp <input type='text' name='ass_"+(max_srno+1)+"_"+$pmcid+"' value='' placeholder=''> &nbsp &nbsp " +                           
                    "</td>" +
                    "<td width='250px'>" +                      
                        "<b>Change:</b> &nbsp <input type='text' name='chn_"+(max_srno+1)+"_"+$pmcid+"' value='' placeholder=''> &nbsp &nbsp " +                           
                    "</td>" +
                    "<td width='250px'>" +                           
                        "<b>Treatment:</b> &nbsp <input type='text' name='trt_"+(max_srno+1)+"_"+$pmcid+"' value='' placeholder=''> &nbsp &nbsp " +                           
                    "</td>" +                                                    
                "</tr>" +
            "</table>" +
        "</li>");

        $('input[name=sub_' +(max_srno+1)+'_'+$pmcid+']').focus();                
    });

    $('body').delegate('#Submit', 'click', function(e) {
        e.preventDefault();
        //alert("Saswati")
        var $form = $(this).parents('form:first');
        var $pmcid = $form.attr("id")                
        var fields = $form.serializeArray()
        var seen = []
        var datums = []
        var json_obj = {}
        json_obj["PMCID"] = $pmcid                
        jQuery.each( fields, function( i, field ) {                                   
            if ($.trim(field.value) != $.trim($('input[name=' + field.name +']').attr("placeholder")) ) { 
                console.log("Field Name: " + field.name + "   " + "Field Value: " + $.trim(field.value) + "   " + "Placeholder: " + $('input[name=' + field.name +']').attr("placeholder"))                                                                   
                var $li = $('input[name=' + field.name +']').parents('li')
                var temp_arr = $li.attr("id").toString().split('_')
                var $list_srno = temp_arr[1]                        
                if( $.inArray($list_srno, seen) != -1){
                    return true
                } 
                seen.push($list_srno)
                var temp = {}
                temp["sr_no"] = $list_srno
                if ($li.attr('class') != undefined)
                {   temp["New"] = "Yes" }
                else {  temp["New"] = "No" }
                $('#'+$li.attr("id")).find('input').each(function(j, element) {  
                    var str_arr = $(element).attr("name").toString().split('_')
                    console.log($(element).attr("name").toString())
                    var values = {}
                    if (str_arr[0] == "del") {                                
                        //console.log($('#'+$(element).attr("id")).is(':checked'));
                        temp["Delete"] = $(element).is(':checked')
                        //return true
                    }          
                    else if (str_arr[0] == "sub") {                                    
                            values["OldValue"] = $(element).attr("placeholder")
                            if ($(element).attr("placeholder") != $(element).attr("value"))
                                {   values["NewValue"] = $(element).attr("value")   }
                            else    { values["NewValue"] = ""   }
                            temp["Subject"] = values
                            $(element).attr("placeholder", $(element).attr("value"))
                    }

                    else if (str_arr[0] == "ass") {                                    
                            values["OldValue"] = $(element).attr("placeholder")
                            if ($(element).attr("placeholder") != $(element).attr("value"))
                                {   values["NewValue"] = $(element).attr("value")   }
                            else    { values["NewValue"] = ""   } 
                            temp["Assay"] = values
                            $(element).attr("placeholder", $(element).attr("value"))
                    }

                    else if (str_arr[0] == "chn") {                                    
                            values["OldValue"] = $(element).attr("placeholder")
                            if ($(element).attr("placeholder") != $(element).attr("value"))
                                {   values["NewValue"] = $(element).attr("value")   }
                            else    { values["NewValue"] = ""   }
                            temp["Change"] = values 
                            $(element).attr("placeholder", $(element).attr("value"))
                    }

                    else if (str_arr[0] == "trt") {                                    
                            values["OldValue"] = $(element).attr("placeholder")
                            if ($(element).attr("placeholder") != $(element).attr("value"))
                                {   values["NewValue"] = $(element).attr("value")   }
                            else    { values["NewValue"] = ""   } 
                            temp["Treatment"] = values
                            $(element).attr("placeholder", $(element).attr("value"))
                    }
                    //console.log("Old_Value: " + $(element).attr("placeholder") + "   " + "New_Value: " + $(element).attr("value"));
                }); // End of the for loop that iterates over all the input elements present within the li item 

                datums.push(temp)
                
            }
        }); // End of the for loop that iterates over the array returned by serializearray
        if (datums.length !== 0) {
            json_obj["Datums"] = datums
            console.log(JSON.stringify(json_obj))

            // Send the data using post
            var posting = $.post( "/feedback", {"jstring": JSON.stringify(json_obj)} );
            // Put the results in a span
            posting.done(function( ret_val ) { 
                console.log(ret_val)
                if (ret_val == "True")
                {   $( "#result_"+$pmcid ).text( "Feedback Saved!" ).show().fadeOut( 2000 ); }
                else  
                {   $( "#result_"+$pmcid ).text( "Something happened and your feedback was lost. Please try again!" ).show().fadeOut( 2000 ); }                         
            }); // End of posting.done
        } 
        else
        {   $( "#result_"+$pmcid ).text( "No changes were detected!" ).show().fadeOut( 2000 ); }
                                                           
    });  // End of the delegated click event of the Submit button
});


jQuery(function ($) {
    function check_navigation_display(el) {
        //accepts a jQuery object of the containing div as a parameter 
        $(el).children('.more').show();
        $(el).children('.less').show();
        
        if ($(el).find('ul li:visible').size() <= 20) {
            $(el).children('.less').hide();            
        } 

        if ($(el).find('ul').children('li').last().is(':visible')) {
            $(el).children('.more').hide();            
        } 
    }

    
    //$('.show_hide').showHide();

    $('div.paginate').each(function () {            
        if ($(this).find('ul li').length > 20) {
            var $form = $(this).parents('form:first');
            var $pmcid = $form.attr("id")
            //alert("From inside div.paginate" + $pmcid)
            $(this).append("<br> <a class='more' id='1_"+$pmcid+ "' href='javascript:void()'>Show More</a> <br> <br>");
            $(this).append("<a class='less' id='1_"+$pmcid + "' href='javascript:void()'>Show Less</a>");
        }
        $(this).find('ul li:gt(19)').hide();
        
        check_navigation_display($(this));

        $(this).find('.more').click(function () {
            var last = $(this).siblings('ul').children('li:visible:last');
            last.nextAll(':lt(20)').show();
            //last.next().prevAll().hide();
            check_navigation_display($(this).closest('div'));
        });

        $(this).find('.less').click(function () {
            var last = $(this).siblings('ul').children('li:visible:last');
            var last_li_index = last.index();
            //var visible_size = $(this).siblings('ul').children('li:visible').size();            
            if (last_li_index >= 39) {
                last.prevAll(':lt(19)').hide();
            	last.hide();
            }
            else {
                var elem_hide = last_li_index - 19
            	//alert("The no of li elements to hide: " + elem_hide);
                if (elem_hide > 0) {
                    last.prevAll(":lt(" + (elem_hide-1) + ")").hide();
            		last.hide();
                }
            }
            
            //first.prev().nextAll().hide()
            check_navigation_display($(this).closest('div'));
        });

    });

});

