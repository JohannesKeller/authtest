$("#ausführen").click( function()
{
  
  
  var cors = "";
  $("#eins").html('<i class="fas fa-spinner fa-pulse"></i>');
  $.ajax({
    url: cors + "https://felix.hs-furtwangen.de/restapi/repo/courses/96536472673363",
    method: "GET",
    headers: {
      "Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE=",
      "Access-Control-Allow-Credentials": "true"
      //beckerth: Basic YmVja2VydGg6UzlDWjhFUkE= /  beckerth.hfu: Basic YmVja2VydGguaGZ1OlJlc3QjMjAxNw==
    }
  }).fail(function (data) {
    $("#eins").html('<i class="fas fa-check"></i>');
  console.log(data);




  $("#zwei").html('<i class="fas fa-spinner fa-pulse"></i>')
  //Start der Shibboleth-Authentifizierung
  $.ajax({
    url: cors + "https://felix.hs-furtwangen.de/shib/",
    // headers: {
      //   "Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE=",
      //   "username": "beckerth",
      //   "password": "S9CZ8ERA"
      // }
    })
    .done(function (data) {
      console.log(data);
      $("#zwei").html('<i class="fas fa-check"></i>');
      var dataXML = $.parseXML(data);
      var input = $("input", dataXML);
      var relayState;
      var samlRequest;
      var attrs = [];
      input.each(function () {
        //console.log($(this).attr("value"));
        attrs.push($(this).attr("value"));
      })
      var relayState = attrs[0];
      var samlRequest = attrs[1];
      
      // console.log(samlRequest);
      // console.log(relayState);
      



      //SAMLRequest per POST verschicken
      $("#drei").html('<i class="fas fa-spinner fa-pulse"></i>')
      $.ajax({
        url: cors + "https://idp2.hs-furtwangen.de/idp/profile/SAML2/POST/SSO",
        method: "POST",
        headers: {
          "Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="
          
        },
        data: {
          "RelayState": relayState,
          "SAMLRequest": samlRequest,
        },
        contentType: "application/x-www-form-urlencoded"
        
      })
      .done(function(data){
        $("#drei").html('<i class="fas fa-check"></i>');
        var dataXML = $.parseXML(data);
        var samlResponse;
        var input = $("input", dataXML);
        var attrs1 = [];        
        input.each(function(){
          attrs1.push($(this).attr("value"))
        });
        var samlResponse = attrs1[1];
        console.log(data);
        //console.log(samlResponse);
        // console.log(data);
        //console.log(dataXML);
        




        //SAMLResponse per POST verschicken
        $("#vier").html('<i class="fas fa-spinner fa-pulse"></i>')
        $.ajax({
          url: cors + "https://felix.hs-furtwangen.de/Shibboleth.sso/SAML2/POST",
          method: "POST",
          headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="}, //YmVja2VydGg6UzlDWjhFUkE=
          data: {
            "SAMLResponse": samlResponse
          }
        })
        .done(function(data){
          $("#vier").html('<i class="fas fa-check"></i>');
          console.log(data);
          
          
        
          
          //Authentifizierung abschließen
          $("#fünf").html('<i class="fas fa-spinner fa-pulse"></i>')
          $.ajax({
            url: cors + "https://felix.hs-furtwangen.de/shib/",
            method: "GET",
            headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="}
            
          }).done(function(data){
            $("#fünf").html('<i class="fas fa-check"></i>');





            $("#sechs").html('<i class="fas fa-spinner fa-pulse"></i>')
            var cors = "";
            $.ajax({
              url: cors + "https://felix.hs-furtwangen.de/restapi/repo/courses/96536472673363",
              method: "GET",
              headers: {"Authorization": "Basic YmVja2VydGg6UzlDWjhFUkE="},
              // beforeSend: function( xhr ) {
                //   xhr.setRequestHeader("Authorization", "Basic YmVja2VydGg6UzlDWjhFUkE=");
                //        },
                // beforeSend: function( xhr ) {
                  //   xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
                  //        },
                  
                }).done(function(data){
                  console.log(data);
                  $("#sechs").html('<i class="fas fa-check"></i>');
                }).fail(function (data) {
                  console.log(data);
                  $("#sechs").html('<i class="fas fa-times"></i>');
                });
                
            
          })
          
        })
        
        
      })   
    });
  });
});