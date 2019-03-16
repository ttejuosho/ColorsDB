$(document).ready(function(){

    $('#searchForm').on('submit', function(event){
        event.preventDefault();
        var searchTerm = $('#searchTerm').val().toLowerCase();
        $.get("/api/colors/name/" + searchTerm , function(data){
            window.location.href='/colors/'+ data.id
            return
        })
    });
});