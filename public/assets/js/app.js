$(document).ready(function(){
    $("#searchTerm").selectize({
        maxItems: 1,
        create: false,
        valueField: 'colorName',
        labelField: 'colorName',
        searchField: 'colorName',
        preload: true,
        render: {
            option: function(item, escape) {
                return '<div>' + escape(item.colorName) + '</div>';
            }
        },
        load: function(query, callback) {
            if (!query.length) return callback();
            $.ajax({
                url: '/api/colors',
                type: 'GET',
                error: function() {
                    callback();
                },
                success: function(res) {
                    callback(res);
                }
            });
        },
        onChange: function(value){
            $("#searchButton").attr("href", "/colors/" + $('#searchTerm')[0].selectize.options[value].id);
        }
    });

    fetch('/api/colors/charts').then(function(data){
        return data.json();
    }).then(function(data) {
        var ctx = $('#myChart');
        var myChart = new Chart (ctx, {
            type: "bar",
            data: {
                labels: ['Primary', 'Secondary', 'Tertiary', 'None'],
                datasets: [{
                    label: "Colors Types",
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        })
    });
});