function isAValidURL(url){
    var re_weburl = new RegExp(
      "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
          // IP address exclusion
          // private & local networks
          "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
          "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
          "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
          // IP address dotted notation octets
          // excludes loopback network 0.0.0.0
          // excludes reserved space >= 224.0.0.0
          // excludes network & broacast addresses
          // (first & last IP address of each class)
          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
          // host name
          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
          // domain name
          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
          // TLD identifier
          "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
          // TLD may end with dot
          "\\.?" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
      "$", "i"
    );
    return re_weburl.test(url);
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function showLoading(){
    var x = ($(window).width()/2)-40;
    var y = $(window).height()/2;

    var str = "<image href='img/loading.gif' width='20' height='20' x='"+(x-25)+"' y='"+(y-15)+"'></image>";
    str += "<text x='"+x+"' y='"+y+"'>Loading...</text>";

    $("svg").html(str)
}

function exportToPNG(){
    saveAs(new Blob(['<svg>'+$("#svg-canvas").html()+"</svg>"], {type:"application/svg+xml"}), "name.svg");
}

function loadURL(type, url){
    if( ! type || ! url){
        return alert("The type and URL parameters are required for loading a URL");
    }

    if( ! isAValidURL(url)){
        return alert("The url paramter is not a valid url");
    }

    showLoading();

    $.get(url, function( data ) {
        if(type == "bibtex"){
            importBibtex(data);
        }else{
            alert("The type parameter is not a valid type.");
        }
    });
}

function importBibtex(bibtex){
    var entries = ConvertUtils.fromBibtexToEntries(bibtex);

    var graph = ConvertUtils.fromBibtexEntriesToGraph(entries);

    plotCollaborationNetwork(graph);
}

$(function(){

    // Add custom validation ruless
    $.formUtils.addValidator(NodesValidation.getRule());
    $.formUtils.addValidator(EdgesValidation.getRule());

    $("#btn-export-to-png").click(function(){
        exportToPNG();
    });

    $("#btn-example").click(function(){
        $("#input-nodes").val(ExampleUtils.getNodes());
        $("#input-edges").val(ExampleUtils.getEdges());
    });

    $("#btn-example-bibtex").click(function(){
        $("#input-bibtex").val(ExampleUtils.getBibtex());
    });

    $.validate({ form:"#form-new" ,onSuccess: function($form) {
         $("#modal-new").modal("hide");

         var nodes = $("#input-nodes").val();
         var edges = $("#input-edges").val();

         nodes = ConvertUtils.fromStringToNodes(nodes);
         edges = ConvertUtils.fromStringToEdges(edges);

         var graph = ConvertUtils.toGraph(nodes,edges);

         plotCollaborationNetwork(graph);

         return false;
    }});

    $.validate({ form:"#form-import" ,onSuccess: function($form) {
         $("#modal-import").modal("hide");

         var bibtex = $("#input-bibtex").val();

         if(isAValidURL(bibtex)){
             loadURL("bibtex", bibtex);
         }else{
             importBibtex(bibtex);
         }

         return false;
    }});

    // Open a url passed by parameters

    var parameters = getQueryParams(document.location.search);

    if(parameters.type && parameters.url){
        loadURL(parameters.type, parameters.url);
    }else{
        plotCollaborationNetwork();
    }
});
