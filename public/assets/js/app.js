$(document).ready(function(){
var colorsTable;
    function renderColorTable(data){
        colorsTable = $('#colorsTable').DataTable({
            dom: "<'row justify-content-between'<'col-sm-12 col-md-2'l><'col-sm-12 col-md-4'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8'p>>",
            data: data,
            rowId: 'id',
            responsive: true,
            columns:[
                {
                    data: 'id',
                    className: 'id'
                },
                {
                    data: 'colorName',
                    className: 'colorName text-center',
                    render: function(data, type, row, meta){
                        return '<a href="/colors/'+ row.id +'">'+ data +'</a>';
                    }
                },
                {
                    data: 'category',
                    className: 'category text-center'
                },
                {
                    data: 'colorType',
                    className: 'colorType text-center'
                },
                {
                    data: 'hex',
                    className: 'hex text-center',
                    render: function(data, row, type, meta){
                        return '<span class="hexColor mr-2" style="background-color: '+ data +' "></span><span>'+ data +'</span>';
                    }
                },
                {
                    data: 'id',
                    className: 'text-center',
                    render: function(data,row,type,meta){
                        return '<a href="/colors/' + data + '/update" class="btn btn-warning btn-sm mr-2">Edit</a><a href="/colors/' + data + '/delete" class="btn btn-danger btn-sm" onclick="return confirm(`Are you sure you want to delete this Color?`)">Delete</a>';
                    }
                }
            ]
        });
    }

    $.ajax({
        url: '/api/colors',
        type: 'GET',
        error: function() {
            callback();
        },
        success: function(res) {           
            renderColorTable(res);
            $("#searchTerm").selectize({
                maxItems: 1,
                create: false,
                valueField: 'colorName',
                labelField: 'colorName',
                searchField: ['colorName', 'hex', 'colorType'],
                preload: true,
                render: {
                    option: function(item, escape) {
                        return '<div>' + escape(item.colorName) + '</div>';
                    }
                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    callback(res);
                },
                onChange: function(value){
                    $("#searchButton").attr("href", "/colors/" + $('#searchTerm')[0].selectize.options[value].id);
                }
            });
        }
    });

});