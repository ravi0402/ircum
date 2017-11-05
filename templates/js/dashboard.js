
$(document).ready(function(){
    // $( document ).tooltip();

    jconfirm.defaults = {
        icon: 'fa fa-warning',
        backgroundDismiss: false,
        backgroundDismissAnimation: 'glow',
        escapeKey: true,
        closeIcon:true,
        theme:'modern',
        title: 'Are You Sure?',
        autoClose: 'Cancel|15000',
        animation: 'scaleX',
        animationSpeed: 500,
        type: 'red',
        animationBounce: 1.5,
    }
    var allStudentsData;

    $(function(){
        $('[data-toggle="tooltip"]').tooltip();
        $(".side-nav .collapse").on("hide.bs.collapse", function() {                   
            $(this).prev().find(".fa").eq(1).removeClass("fa-angle-right").addClass("fa-angle-down");
        });
        $('.side-nav .collapse').on("show.bs.collapse", function() {                        
            $(this).prev().find(".fa").eq(1).removeClass("fa-angle-down").addClass("fa-angle-right");        
        });
    })   

    var fullObject = [];
    var fullObjectRef = [];
    var fullObjectMetadata = [];
    $(document.body).on('click', '#submitComplyForm', function(){

        var url = $('.complyUrl').val();
        var keywords = $('.complyKeywords').val();
        if(url=='' || keywords=='')
        {
            $.alert({
                title:"STOP!!",
                icon:"fa fa-hand-stop-o",
                content:"Both the fields are compulsory to proceed",
                buttons:{
                    action:{
                        text:"OK",
                        btnClass:"btn-success"
                    }
                }
            })
        }else
        {
            $('#loading').show();
            var result = keywords.split(',');
            console.log(keywords);
            console.log(result);
            var arr = $.map(result, function(el) { return el });
            console.log(arr[0])
            
            result1 = JSON.stringify(arr)
            var obj = {url_field:url, keywords:result1}
            $.ajax({
                type:"POST",
                url:"http://10.200.238.148:5000/processData",
                data:obj,
                success:function(data){
                    console.log(data)
                    console.log(Object.keys(data).length)
                    // console.log(data['others'])
                    // console.log(data['scheme'])
                    // $('#summaryTable').DataTable().destroy();
                    if(!Object.keys(data).length)
                    {
                        $('#summariesContainer').empty();
                        $.alert('No result found.')
                        $('#loading').hide();
                        // $('#summaryTable tbody').find('tr').remove();
                    }else
                    {
                        $('#summaryTable tbody').find('tr').remove();
                        if(1)
                        {
                            $('#summariesContainer').empty()
                            var pickledUrl = url.split('.')

                            if(jQuery.inArray("sebi", pickledUrl) !== -1)
                                $('#summariesContainer').append('<table  id="summaryTable" class="table table-hover table-striped"><thead><tr><th>S No.</th><th>Category</th><th>Title</th><th>Url</th><th>Metadata</th><th>Summarize</th></tr></thead><tbody></tbody></table>');
                            else
                                $('#summariesContainer').append('<table  id="summaryTable" class="table table-hover table-striped"><thead><tr><th>S No.</th><th>Category</th><th>Title</th><th>Url</th></tr></thead><tbody></tbody></table>');
                        
                            var j = 1;
                            
                            console.log(fullObject)
                            for (var property in data) {
                                var category = property
                                for(var i=0;i<data[category].length;i++)
                                {
                                    fullObject.push(data[category][i][2])
                                    fullObjectRef.push(data[category][i][3])
                                    fullObjectMetadata.push(data[category][i][4])
                                    if(jQuery.inArray("sebi", pickledUrl) !== -1)
                                        var row = '<tr ><td >'+j+'</td><td>'+category+'</td><td>'+data[category][i][0]+'</td><td><a class="pageLink" target="_blank" href="'+data[category][i][1]+'">View source</a></td><td><button class="btn btn-warning btn-md viewThisReferences" >VIEW</button></td><td><button class="btn btn-primary btn-md viewThisSummary" >VIEW</button></td></tr>';
                                    else if(jQuery.inArray("mca", pickledUrl) !== -1)
                                        var row = '<tr ><td >'+j+'</td><td>'+category+'</td><td>'+data[category][i][0]+'</td><td><a class="pageLink" target="_blank" href="http://www.mca.gov.in/'+data[category][i][1]+'">View source</a></td></tr>';
                                    else
                                        var row = '<tr ><td >'+j+'</td><td>'+category+'</td><td>'+data[category][i][0]+'</td><td><a class="pageLink" target="_blank" href="'+data[category][i][1]+'">View source</a></td></tr>';
                                    $('#summaryTable tbody').append(row);
                                    j++;
                                }
                                
                            }
                            console.log(fullObject)
                            $('#summaryTable').DataTable({
                                "columnDefs": [
                                    // {"className": "dt-head-center", "targets": "_all"},
                                    { "width": "10%", "targets": 0 }
                                ],
                            })
                        }
                    }
                    $('#loading').hide();
                    
                    
                
                },statusCode:{
                    500:function(){
                        $('#summariesContainer').empty();
                        $.alert('No result found.')
                        $('#loading').hide();
                        // $('#summaryTable tbody').find('tr').remove();

                    }
                    // data = parseJSON(data)
                }
                    
                
            })
        }
        
        // console.log(keywords)
    })
    
    $(document.body).on('click', '.viewThisSummary', function(){
        var index = $(this).parent().closest('tr').index();
        console.log(index)
        console.log(fullObjectRef[index])
        var content = fullObject[index]+"<br><b><i>References </i>:</b><br>";
        var ref = fullObjectRef[index];
        for(var i=0;i<fullObjectRef[index]['url'].length;i++)
        {
            content += fullObjectRef[index]['url'][i] + " "
        }

        
        $.confirm({
            title:"Summary",
            content:content,
            icon:'',
            columnClass: 'col-md-8 col-md-offset-2',
            autoClose:false,
            buttons:{
                Action:{
                    text:"OK",
                    btnClass:"btn-success"
                },
                Cancel:{
                    isHidden:true
                }
            }

        })
    })


    $(document.body).on('click', '.viewThisReferences', function(){
        var index = $(this).parent().closest('tr').index();
        console.log(index)
        console.log(fullObjectRef[index])
        console.log(fullObjectMetadata[index])
        var content = "<b><i>References</i></b>: "
        var ref = fullObjectRef[index];
        for(var i=0;i<fullObjectRef[index]['url'].length;i++)
        {
            content += fullObjectRef[index]['url'][i]
            if(i<=fullObjectRef[index]['url'].length-1) 
                content+=", "
        }
        content += "<br>"
        for(key in fullObjectMetadata[index])
        {
            content+= "<b><i>"+key+"</i></b>: "+ fullObjectMetadata[index][key]+"<br>";
        }

        
        $.confirm({
            title:"MetaData",
            content:content,
            icon:'',
            autoClose:false,    
            columnClass: 'col-md-4 col-md-offset-4',
            buttons:{
                Action:{
                    text:"OK",
                    btnClass:"btn-success"
                },
                Cancel:{
                    isHidden:true
                }
            }

        })
    })
    
        
                
    

    
    $(document.body).on('click', '#logoutBtn', function(){
        location.href = "./index.html"
    })

    
})


